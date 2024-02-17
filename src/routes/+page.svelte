<script lang="ts">
	import { onMount } from 'svelte';
	import requestAnimationFrames from 'request-animation-frames';

	import CameraStream from '$lib/components/CameraStream.svelte';
	import CardPositionIndicator from '$lib/components/CardPositionIndicator.svelte';

	import { populateCanvas, ocr } from '$lib/tesseract';
	import { fromAsyncIterable, asyncDerrived } from '$lib/store';

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;

	const indicator = {
		x: 80,
		y: 5,
		height: 50,
		width: 100
	};

	const ocrResults = asyncDerrived(fromAsyncIterable(requestAnimationFrames()), (_timestamp) => {
		// `videoElement` can take a tick to initialize
		if (!videoElement) {
			return Promise.resolve('');
		}

		return ocr(videoElement, indicator);
	});

	onMount(async () => {
		for await (const _timestamp of requestAnimationFrames()) {
			populateCanvas(videoElement, canvasElement, indicator);
		}
	});
</script>

<main>
	<div class="identifier">
		<div class="camera-stream">
			<CameraStream bind:videoElement />
		</div>
		<div
			class="indicator"
			style={`
				--x: ${indicator.x}px;
				--y: ${indicator.y}px;
				--height: ${indicator.height}px;
				--width: ${indicator.width}px;
			`}
		>
			<CardPositionIndicator />
		</div>
	</div>

	<div>
		<canvas bind:this={canvasElement} />
	</div>
</main>

<div>
	{$ocrResults}
</div>

<style>
	main {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.identifier {
		position: relative;
	}

	.indicator {
		position: absolute;

		top: var(--y);
		left: var(--x);
		height: var(--height);
		width: var(--width);
	}
</style>
