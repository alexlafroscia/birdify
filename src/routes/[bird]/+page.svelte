<script lang="ts">
	import DetailPageWrapper from '$lib/components/DetailPageWrapper.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ page, images, summary } = data);
</script>

<DetailPageWrapper>
	<h1 slot="title">{page.title}</h1>

	<p>{summary.extract}</p>
	<a href={page.fullurl}>View More on Wikipedia</a>

	<ul class="images">
		{#each images as image}
			<li><img class="image" alt={image.title} src={image.url} /></li>
		{/each}
	</ul>
</DetailPageWrapper>

<style>
	.images {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		list-style: none;
		padding: 0;
	}

	.image {
		width: 100px;
	}
</style>
