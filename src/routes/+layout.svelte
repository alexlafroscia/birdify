<script lang="ts">
	import { slide } from 'svelte/transition';

	import CameraStream, { type ReadResult } from '$lib/components/CameraStream.svelte';

	let canvasElement: HTMLCanvasElement;
	let ocrResult: ReadResult | undefined = undefined;

	/* === Debug Menu === */
	let debugMenuVisible = false;

	function toggleDebugMenu() {
		debugMenuVisible = !debugMenuVisible;
	}
</script>

<div class="layout">
	<div class="left-column">
		<h1><a href="/">Birdify</a></h1>

		<div class="identifier">
			<CameraStream
				{canvasElement}
				on:read={({ detail }) => {
					ocrResult = detail;
				}}
			/>
		</div>

		<div class="spacer" />

		<ul class="links">
			<li><a class="link" href="/credits">Credits</a></li>
			<li><button type="button" on:click={toggleDebugMenu}>Toggle Debug Menu</button></li>
		</ul>

		{#if debugMenuVisible}
			<div class="debug-menu" transition:slide>
				{#if ocrResult}
					<dl>
						<dt>Raw</dt>
						<dd>{ocrResult.raw}</dd>
						<dt>Guess</dt>
						<dd>{ocrResult.guess}</dd>
						<dt>Preview</dt>
						<dd class="preview">
							<canvas bind:this={canvasElement} />
						</dd>
					</dl>
				{:else}
					<p>Start Capture to Debug</p>
				{/if}
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
		height: 100dvh;
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

		border-top: 2px solid var(--dun);
		background: rgb(from var(--dun) r g b / 30%);

		& dl {
			display: grid;
			grid-template-columns: min-content 1fr;
			gap: 0.2em 1em;
			margin: 0;
		}

		& dt {
			font-weight: bold;
		}

		& dd {
			margin: 0;
		}

		& .preview {
			height: 50px;
		}

		& p {
			margin: 0;
			text-align: center;
		}
	}
</style>
