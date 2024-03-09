<div class="layout">
	<slot />
</div>

<style>
	.layout {
		/* Match page height */
		display: grid;
		height: 100dvh;

		grid-template-columns: 300px;
		justify-content: center;

		@media (min-width: 600px) {
			grid-template-columns: 300px 1fr;
		}
	}
</style>
