<script lang="ts" context="module">
	export interface ReadResult {
		raw: string;
		closest: string;
	}
</script>

<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { ocr, type IndicatorConfig } from '$lib/tesseract';
	import { closestBird } from '$lib/birds';
	import { Capture } from '$lib/capture';

	const dispatch = createEventDispatcher<{
		start: void;
		read: ReadResult;
		match: string;
		error: string;
	}>();

	export let indicator: IndicatorConfig;
	export let canvasElement: HTMLCanvasElement | null | undefined = undefined;

	let videoElement: HTMLVideoElement;
	let isPlaying = false;

	let haltOcrController = new AbortController();

	onMount(async function () {
		if (!window.isSecureContext) {
			dispatch('error', 'Currently browsing from an insecure context');
			return;
		}

		const mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				aspectRatio: {
					exact: 2 / 3
				},
				facingMode: 'environment'
			}
		});

		const [track] = mediaStream.getTracks();
		console.log(track.getSettings());

		videoElement.srcObject = mediaStream;


		const capture = new Capture();

		for await (const timeStamp of requestAnimationFrames()) {
			if (haltOcrController.signal.aborted) {
				break;
			}

			let result = await ocr(videoElement, indicator, canvasElement ?? undefined);
			result = result.split('\n')[0];

			capture.addScan(result, timeStamp);

			dispatch('read', {
				raw: result,
				closest: closestBird(result)
			});

			if (capture.isComplete) {
				dispatch('match', capture.result);
			}
		}
	});

	onDestroy(() => {
		haltOcrController.abort();
	});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
	bind:this={videoElement}
	class="border-radius"
	playsinline
	on:loadeddata={({ currentTarget }) => {
		currentTarget.play();
		isPlaying = true;
		dispatch('start');
	}}
>
</video>

{#if !isPlaying}
	<div class="loading border-radius">
		<p>Loading...</p>
	</div>
{/if}

<style>
	.border-radius {
		border-radius: var(--border-radius);
	}

	video {
		height: 100%;
		max-width: 100%;
	}

	.loading {
		background: rgb(from var(--ash-gray) r g b / 30%);
		border: 2px solid var(--ash-gray);
		font-weight: bold;

		position: absolute;
		top: 0;

		height: 100%;
		width: 100%;
	}
</style>
