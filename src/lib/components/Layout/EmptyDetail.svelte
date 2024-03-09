<div class="empty-detail">
	<slot />
</div>

<style>
	.empty-detail {
		display: none;

		@media (min-width: 600px) {
			display: block;
		}
	}
</style>
