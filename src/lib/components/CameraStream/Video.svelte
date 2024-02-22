<script lang="ts">
	import requestAnimationFrames from 'request-animation-frames';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	import { ocr, type IndicatorConfig } from '$lib/tesseract';
	import { closestBird } from '$lib/birds';

	const dispatch = createEventDispatcher<{
		read: {
			raw: string;
			guess: string;
		};
		match: string;
	}>();

	export let width: number = 250;
	export let height: number = (width * 3) / 2;

	export let indicator: IndicatorConfig;

	/**
	 * Allow the "parent component" to access the `video` element by binding to this
	 */
	export let videoElement: HTMLVideoElement;

	let unrecoverableError: string | null = null;

	let haltOcrController = new AbortController();

	onMount(async function () {
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

		for await (const _tick of requestAnimationFrames()) {
			if (haltOcrController.signal.aborted) {
				break;
			}

			let result = await ocr(videoElement, indicator);
			result = result.split('\n')[0];

			dispatch('read', {
				raw: result,
				guess: closestBird(result)
			});
		}
	});

	onDestroy(() => {
		haltOcrController.abort();
	});
</script>

{#if unrecoverableError}
	<p class="unrecoverable-error">{unrecoverableError}</p>
{:else}
	<video
		class="border-radius"
		bind:this={videoElement}
		{height}
		{width}
		playsinline
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

	.border-radius {
		border-radius: var(--border-radius);
	}
</style>
