<script lang="ts">
	import Video from './CameraStream/Video.svelte';

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
			{indicator}
			on:match
			on:read
			on:error={({ detail }) => {
				errorMessage = detail;
			}}
		/>
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
