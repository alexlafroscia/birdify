<main>
	<header>
		<a class="back-nav-link" href="/">Back</a>

		<div class="title">
			<slot name="title" />
		</div>
	</header>

	<slot />
</main>

<style>
	header {
		display: flex;
		align-items: center;
	}

	.back-nav-link {
		@media (min-width: 600px) {
			display: none;
		}
	}

	.title {
		font-family: CardenioModern;
		text-align: center;
		flex-grow: 1;
	}
</style>
