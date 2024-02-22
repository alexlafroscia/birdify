<script lang="ts">
	import '../app.css';

	import { goto as navigateTo } from '$app/navigation';
	import { slide } from 'svelte/transition';

	import CameraStream, { type ReadResult } from '$lib/components/CameraStream.svelte';
	import { urlFor as urlForResult } from '$lib/birds';
	import { list } from '$lib/store';

	const results = list<string>();

	/* === Debug Menu === */

	let debugMenuVisible = false;
	let canvasElement: HTMLCanvasElement;
	let ocrResult: ReadResult | undefined = undefined;

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
				on:match={({ detail }) => {
					results.push(detail);
					navigateTo(urlForResult(detail));
				}}
			/>
		</div>

		<ul class="links">
			{#each $results as result}
				<li>
					<a class="link" href={`/${encodeURIComponent(result)}`}>
						{result}
					</a>
				</li>
			{/each}
		</ul>

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
						<dt>Closest</dt>
						<dd>{ocrResult.closest}</dd>
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
