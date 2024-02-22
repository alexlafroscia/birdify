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

		const { height: videoElementHeightPx, width: videoElementWidthPx } =
			window.getComputedStyle(videoElement);
		const height = parseInt(videoElementHeightPx.replace('px', ''), 10);
		const width = parseInt(videoElementWidthPx.replace('px', ''), 10);

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
		bind:this={videoElement}
		class="border-radius"
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

	video {
		aspect-ratio: 2/3;
		max-width: 100%;
	}
</style>
