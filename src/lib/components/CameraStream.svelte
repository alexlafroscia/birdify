<script lang="ts">
	import CardPositionIndicator from './CardPositionIndicator.svelte';
	import Video from './CameraStream/Video.svelte';

	export let canvasElement: HTMLCanvasElement | null | undefined = undefined;

	const indicator = {
		x: 85,
		y: 15,
		height: 30,
		width: 90
	};

	let errorMessage: string | undefined;

	let isCapturing = false;

	function startCapturingVideo() {
		isCapturing = true;
	}
</script>

<div class="border-radius camera-stream" class:error={!!errorMessage}>
	{#if errorMessage}
		<p>Error!</p>
		<p>{errorMessage}</p>
	{:else if isCapturing}
		<Video
			{canvasElement}
			{indicator}
			on:match
			on:read
			on:error={({ detail }) => {
				errorMessage = detail;
			}}
		/>
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
	{:else}
		<div class="border-radius placeholder">
			<button on:click={startCapturingVideo}>Start Capture</button>
		</div>
	{/if}
</div>

<style>
	.border-radius {
		--border-radius: 10px;

		border-radius: var(--border-radius);
	}

	.camera-stream {
		aspect-ratio: 2/3;
		position: relative;
	}

	.indicator {
		position: absolute;

		top: var(--y);
		left: var(--x);
		height: var(--height);
		width: var(--width);
	}

	.error {
		border: 2px solid var(--rojo);
		background: rgb(from var(--rojo) r g b / 30%);
		color: var(--rojo);
		font-weight: bold;
	}

	.placeholder {
		border: 2px solid var(--steel-blue);
		background-color: var(---air-superiority-blue);

		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
