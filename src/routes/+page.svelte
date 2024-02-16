<script lang="ts">
	import CameraStream from '$lib/components/CameraStream.svelte';
</script>

<main>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

	<div class="camera-stream">
		<CameraStream></CameraStream>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.camera-stream {
		flex-grow: 1;
	}
</style>
