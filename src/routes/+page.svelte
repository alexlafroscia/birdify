<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';

	import CameraStream from '$lib/components/CameraStream.svelte';
	import CardPositionIndicator from '$lib/components/CardPositionIndicator.svelte';

	import { ocr } from '$lib/tesseract';
	import { fromAsyncIterable, asyncDerrived } from '$lib/store';
	import { closestBird } from '$lib/birds';

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;

	const indicator = {
		x: 80,
		y: 5,
		height: 50,
		width: 100
	};

	const ocrResultStore = asyncDerrived(
		fromAsyncIterable(requestAnimationFrames()),
		async (_timestamp) => {
			// DOM nodes will take a tick to be present
			if (!videoElement || !canvasElement) {
				return '';
			}

			const result = await ocr(videoElement, indicator, canvasElement);

			// The scientific name is right under the "common" name
			// We want to ignore that if it's there
			const [firstResultLine] = result.split('\n');

			// Match the OCR input against the bird name DB
			return closestBird(firstResultLine);
		}
	);
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
	{$ocrResultStore}
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
