<script lang="ts">
	import type { PageData } from '../$types';
	import Content from '$lib/components/Content.svelte';
	import NavCard from '$lib/components/NavCard.svelte';
	import WordCard from '$lib/components/WordCard.svelte';

	export let data: PageData;

	const words = data.words;
</script>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Dictionary</h1>
	<p class="mb-3">Here are some words you can learn:</p>

	{#if words && words.length > 0}
		<ul class="align-center grid grid-cols-2 justify-center gap-4 md:grid-cols-4 xl:grid-cols-6">
			{#each words as word (word.id)}
				<li>
					<WordCard {word} />
				</li>
			{/each}
			<!--
			<li>
				<NavCard href="/dictionary/add" label="Add word +" />
			</li>
			-->
		</ul>
	{:else}
		<p>No words found.</p>
	{/if}
</Content>
