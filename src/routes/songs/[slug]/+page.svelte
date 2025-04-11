<script lang="ts">
	import type { PageData } from '../../$types';
	import Aside from '../../../stories/Aside/Aside.svelte';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';
	import HorizontalScroller from '../../../stories/HorizontalScroller/HorizontalScroller.svelte';
	import WordCard from '../../../stories/WordCard/WordCard.svelte';

	export let data: PageData;

	const song = data.song;
	song.words = [
		{
			id: 7,
			slug: 'hello',
			word: 'Hello'
		},
		{
			id: 8,
			slug: 'bye-bye',
			word: 'Bye-bye'
		},
		{
			id: 1,
			slug: 'mommy',
			word: 'Mummy'
		},
		{
			id: 2,
			slug: 'daddy',
			word: 'Daddy'
		},
		{
			id: 3,
			slug: 'good',
			word: 'Good'
		},
		{
			id: 4,
			slug: 'bad',
			word: 'Bad'
		}
	];
</script>

<Content>
	<h1 class="relative mb-3 text-center text-2xl leading-none font-extrabold">
		{song.title}
		<EditIcon href="/songs/{song.slug}/edit" size="large" />
	</h1>
	{#each song.lyrics.split('.').filter(Boolean) as segment, i}
		<p class="mt-10 text-center text-xl italic">
			♬
			<br />

			{#each segment.split(',') as verse, i (verse + i)}
				{#if i < segment.split(',').length - 1}
					{verse}, <br />
				{:else}
					{verse}
				{/if}
			{/each}
		</p>
	{/each}
</Content>

{#if song.words && song.words.length > 0}
	<Aside>
		<h2 class="mb-3 text-xl font-semibold">Words in this song:</h2>
		<HorizontalScroller>
			{#each song.words as word (word.id)}
				<div class="shrink-0 grow-1 basis-[50vw] md:basis-[25vw] lg:basis-[20vw] xl:basis-[15vw]">
					<WordCard {word} />
				</div>
			{/each}
		</HorizontalScroller>
	</Aside>
{/if}
