<script lang="ts">
	import DetailPageWrapper from '$lib/components/DetailPageWrapper.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ page, summary } = data);
	$: ({ originalimage: image } = summary);

	$: console.log(summary);
</script>

<DetailPageWrapper>
	<h1 slot="title">{page.title}</h1>

	<img class="image" src={image.source} />

	<p>{summary.extract}</p>
	<a href={page.fullurl}>View More on Wikipedia</a>
</DetailPageWrapper>

<style>
	h1 {
		margin-top: 0;
		margin-bottom: 0;
	}

	.image {
		max-width: 100%;
	}
</style>
