<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import Video from './CameraStream/Video.svelte';

	interface $$Props extends HTMLVideoAttributes {
		height?: number;
		width?: number;
		videoElement: HTMLVideoElement;
	}

	const indicator = {
		x: 85,
		y: 15,
		height: 30,
		width: 90
	};

	/**
	 * Allow the "parent component" to access the `video` element by binding to this
	 */
	export let videoElement: HTMLVideoElement;

	let isCapturing = false;

	function startCapturingVideo() {
		isCapturing = true;
	}
</script>

<div class="border-radius camera-stream">
	{#if isCapturing}
		<Video bind:videoElement {indicator} on:match on:read />
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
		position: relative;
	}

	.placeholder {
		aspect-ratio: 2/3;

		border: 2px solid var(--steel-blue);
		background-color: var(---air-superiority-blue);

		display: flex;
		flex-direction: column;

		height: var(--height);
		width: var(--width);
	}
</style>
