<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';

	import CameraStream from '$lib/components/CameraStream.svelte';
	import CardPositionIndicator from '$lib/components/CardPositionIndicator.svelte';

	import { ocr } from '$lib/tesseract';
	import { fromAsyncIterable, asyncDerrived } from '$lib/store';
	import { closestBird } from '$lib/birds';
	import * as wiki from '$lib/wikipedia';

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;

	const indicator = {
		x: 85,
		y: 15,
		height: 30,
		width: 90
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

<div class="layout">
	<div class="left-column">
		<h1><a href="/">Birdify</a></h1>

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

		<div class="spacer" />

		<ul class="links">
			<li><a class="link" href="/credits">Credits</a></li>
		</ul>

		<div class="debug-canvas">
			<canvas bind:this={canvasElement} />
		</div>
	</div>

	<slot />
</div>

<style>
	@font-face {
		font-family: 'CardenioModern';
		src: url('/cardenio_modern/CardenioModern-Regular.otf') format('opentype');
	}

	:root {
		/* CSS HEX */
		/* --antiflash-white: #f2f6f8ff;
		--dun: #c4bdaeff;
		--silver-lake-blue: #5785b5ff;
		--air-superiority-blue: #87a2bdff;
		--rojo: #df2b2bff;
		--ash-gray: #abcbbcff; */

		/* CSS HSL */
		--antiflash-white: hsla(200, 30%, 96%, 1);
		--dun: hsla(41, 16%, 73%, 1);
		--silver-lake-blue: hsla(211, 39%, 53%, 1);
		--air-superiority-blue: hsla(210, 29%, 64%, 1);
		--rojo: hsla(0, 74%, 52%, 1);
		--ash-gray: hsla(152, 24%, 73%, 1);
		--steel-blue: hsla(210, 42%, 50%, 1);

		/* Default to sans-serif font */
		font-family: Arial, Helvetica, sans-serif;
	}

	:global(body) {
		background-color: var(--antiflash-white);
		margin: 0;
	}

	.layout {
		display: grid;
		grid-template-areas: 'sidebar detail';
		grid-template-columns: 300px 1fr;

		/* Match page height */
		height: 100vh;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding-right: 1em;
		padding-left: 1em;

		/* When displaying as a sidebar.. */
		@media (min-width: 600px) {
			border-right: 1px solid var(--ash-gray);
			margin-right: 1em;
		}
	}

	h1 {
		font-family: CardenioModern;
		text-align: center;

		& a {
			text-decoration: none;
		}
	}

	.identifier {
		position: relative;
		text-align: center;
	}

	.indicator {
		position: absolute;

		top: var(--y);
		left: var(--x);
		height: var(--height);
		width: var(--width);
	}

	.debug-canvas {
		display: none;
	}

	.links {
		padding: 0;
		list-style: none;
	}

	.link {
		color: var(--silver-lake-blue);
		text-decoration: none;

		&:visited {
			color: var(--silver-lake-blue);
		}
	}

	.spacer {
		flex-grow: 1;
	}
</style>
