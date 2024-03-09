<div class="sidebar">
	<slot />
</div>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding-right: 1em;
		padding-left: 1em;

		/* When displaying as a sidebar.. */
		@media (min-width: 600px) {
			border-right: 1px solid var(--ash-gray);
		}
	}

	:global(.layout:has(.detail)) .sidebar {
		display: none;

		@media (min-width: 600px) {
			display: flex;
		}
	}
</style>
