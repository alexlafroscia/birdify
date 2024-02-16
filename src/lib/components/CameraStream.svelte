<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	interface $$Props extends HTMLVideoAttributes {
		mediaStream?: MediaStream | undefined;
	}

	let videoElement: HTMLVideoElement;

	/**
	 * The `MediaStream` for the user's camera
	 *
	 * Can be `undefined` while pending request or denied access
	 */
	export let mediaStream: MediaStream | undefined = undefined;

	onMount(async () => {
		mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

		videoElement.srcObject = mediaStream;
	});
</script>

<video
	{...$$restProps}
	bind:this={videoElement}
	on:loadeddata={({ currentTarget }) => {
		currentTarget.play();
	}}
></video>
