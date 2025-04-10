<script lang="ts">
	import type { PageData } from '../$types.js';
	import Content from '../../stories/Content/Content.svelte';
	import NavCard from '../../stories/NavCard/NavCard.svelte';

	export let data: PageData;

	const phrases = data.phrases;
</script>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Phrases</h1>
	<p class="mb-3">Here are some phrases to learn:</p>

	{#if phrases && phrases.length > 0}
		<ul class="align-center grid grid-cols-1 justify-center gap-3 md:grid-cols-2 xl:grid-cols-3">
			{#each phrases as phrase (phrase.id)}
				<li class="shrink-0 grow-0 basis-full">
					<NavCard
						href="/phrases/{phrase.slug}"
						label={phrase.title}
						description="“{phrase.phrase}”"
					/>
				</li>
			{/each}
			<li>
				<NavCard href="/phrases/add" label="Add phrase +" />
			</li>
		</ul>
	{:else}
		<p>No phrases found.</p>
	{/if}
</Content>
