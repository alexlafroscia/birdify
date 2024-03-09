<div class="empty-detail">
	<slot />
</div>

<style>
	.empty-detail {
		display: none;
		margin: 1em;

		@media (min-width: 600px) {
			display: block;
		}
	}
</style>
