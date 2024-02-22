<script lang="ts" context="module">
	export interface ReadResult {
		raw: string;
		guess: string;
	}
</script>

<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { ocr, type IndicatorConfig } from '$lib/tesseract';
	import { closestBird } from '$lib/birds';

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
			video: true
		});

		videoElement.srcObject = mediaStream;

		const { height: videoElementHeightPx, width: videoElementWidthPx } =
			window.getComputedStyle(videoElement);
		const height = parseInt(videoElementHeightPx.replace('px', ''), 10);
		const width = parseInt(videoElementWidthPx.replace('px', ''), 10);

		// Set the dimensions of the video stream
		const primaryTrack = mediaStream.getTracks()[0];
		await primaryTrack.applyConstraints({
			height,
			width
		});

		for await (const _tick of requestAnimationFrames()) {
			if (haltOcrController.signal.aborted) {
				break;
			}

			let result = await ocr(videoElement, indicator, canvasElement ?? undefined);
			result = result.split('\n')[0];

			dispatch('read', {
				raw: result,
				guess: closestBird(result)
			});
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
