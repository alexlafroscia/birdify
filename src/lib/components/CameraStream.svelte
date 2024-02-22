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

	let showIndicator = false;

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
			on:start={() => {
				showIndicator = true;
			}}
			on:error={({ detail }) => {
				errorMessage = detail;
			}}
		/>
		{#if showIndicator}
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
		{/if}
	{:else}
		<div class="border-radius start-button-container">
			<button class="start-button border-radius" on:click={startCapturingVideo}>
				<span class="icon">📸</span>
				<br />
				Start Capture
			</button>
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

	.start-button-container {
		border: 2px solid var(--steel-blue);
		background: rgb(from var(--steel-blue) r g b / 30%);

		color: var(--steel-blue);

		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.start-button {
		border: 0;
		background: transparent;
		height: 100%;
		font-size: unset;
		font-weight: bold;
	}

	.icon {
		font-size: 2rem;
	}
</style>
