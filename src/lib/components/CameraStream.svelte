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

	let unrecoverableError: string | null = null;

	onMount(async () => {
		if (!window.isSecureContext) {
			unrecoverableError = 'Currently browsing from an insecure context';
			return;
		}

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

{#if unrecoverableError}
	<p class="unrecoverable-error">{unrecoverableError}</p>
{:else}
	<video
		bind:this={videoElement}
		{height}
		{width}
		playsinline
		{...$$restProps}
		on:loadeddata={({ currentTarget }) => {
			currentTarget.play();
		}}
	>
	</video>
{/if}

<style>
	.unrecoverable-error {
		color: var(--antiflash-white);
		background-color: var(--rojo);
		padding: 1em;
	}
</style>
