<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';
	import { slide } from 'svelte/transition';

	import CameraStream from '$lib/components/CameraStream.svelte';
	import CardPositionIndicator from '$lib/components/CardPositionIndicator.svelte';

	import { ocr } from '$lib/tesseract';
	import { fromAsyncIterable, asyncDerrived } from '$lib/store';
	import { closestBird } from '$lib/birds';

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
			if (!videoElement) {
				return '';
			}

			const result = await ocr(
				videoElement,
				indicator,
				// `canvasElement` will be `null` if the debug menu has closed
				// if that's the case, we want to pass `undefined` through instead so that
				// the default argument (a fresh `canvas` element) is used instead
				canvasElement ?? undefined
			);

			// The scientific name is right under the "common" name
			// We want to ignore that if it's there
			const [firstResultLine] = result.split('\n');

			// Match the OCR input against the bird name DB
			return closestBird(firstResultLine);
		}
	);

	/* === Debug Menu === */
	let debugMenuVisible = false;

	function showDebugMenu() {
		debugMenuVisible = true;
	}

	function hideDebugMenu() {
		debugMenuVisible = false;
	}
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
			<li><button type="button" on:click={showDebugMenu}>Show Debug Menu</button></li>
		</ul>

		{#if debugMenuVisible}
			<div class="debug-menu" transition:slide>
				<div class="header">
					<p>{$ocrResultStore}</p>

					<button on:click={hideDebugMenu}>Close</button>
				</div>

				<canvas bind:this={canvasElement} />
			</div>
		{/if}
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

	:global(button) {
		cursor: pointer;
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

	.links {
		padding: 0;
		list-style: none;

		& > * ~ * {
			padding-top: 0.5em;
		}

		& button {
			color: var(--silver-lake-blue);
			border: none;
			padding: 0;
			font-size: 1em;
		}
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

	.debug-menu {
		/* Full-bleed */
		margin-left: -1em;
		margin-right: -1em;
		padding: 1em;

		background-color: var(--rojo);
		color: var(--antiflash-white);

		/* Hard-coded height required for slide transition */
		height: 71.5px;

		& p {
			margin: 0;
		}

		& .header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 1em;
		}
	}
</style>
