<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { ocr, type IndicatorConfig } from '$lib/tesseract';
	import { closestBird } from '$lib/birds';

	const dispatch = createEventDispatcher<{
		read: {
			raw: string;
			guess: string;
		};
		match: string;
		error: string;
	}>();

	export let indicator: IndicatorConfig;
	export let canvasElement: HTMLCanvasElement | null | undefined = undefined;

	let videoElement: HTMLVideoElement;

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
	}}
>
</video>

<style>
	.border-radius {
		border-radius: var(--border-radius);
	}

	video {
		height: 100%;
		max-width: 100%;
	}
</style>
