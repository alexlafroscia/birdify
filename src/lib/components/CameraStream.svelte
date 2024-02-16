<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	interface $$Props extends HTMLVideoAttributes {
		height?: number;
		width?: number;
		videoElement: HTMLVideoElement;
	}

	export let height: number = 300;
	export let width: number = 200;

	/**
	 * Allow the "parent component" to access the `video` element by binding to this
	 */
	export let videoElement: HTMLVideoElement;

	onMount(async () => {
		const mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: true
		});

		videoElement.srcObject = mediaStream;

		// Set the dimensions of the video stream
		const primaryTrack = mediaStream.getTracks()[0];
		primaryTrack.applyConstraints({
			height,
			width
		});
	});
</script>

<video
	bind:this={videoElement}
	{height}
	{width}
	{...$$restProps}
	on:loadeddata={({ currentTarget }) => {
		currentTarget.play();
	}}
>
</video>
