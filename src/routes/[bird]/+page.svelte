<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ page, images, summary } = data);
</script>

<h1>{page.title}</h1>

<p>{summary.extract}</p>
<a href={page.fullurl}>View More on Wikipedia</a>

<ul class="images">
	{#each images as image}
		<li><img class="image" alt={image.title} src={image.url} /></li>
	{/each}
</ul>

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
