<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import Video from './CameraStream/Video.svelte';

	interface $$Props extends HTMLVideoAttributes {
		height?: number;
		width?: number;
		videoElement: HTMLVideoElement;
	}

	export let width: number = 250;
	export let height: number = (width * 3) / 2;

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
		<Video bind:videoElement {indicator} {height} {width} on:match on:read />
	{:else}
		<div class="border-radius placeholder" style={`--height: ${height}px; --width: ${width}px`}>
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
		border: 2px solid var(--steel-blue);
		background-color: var(---air-superiority-blue);

		display: flex;
		flex-direction: column;

		height: var(--height);
		width: var(--width);
	}
</style>
