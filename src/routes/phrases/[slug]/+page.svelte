<script lang="ts">
	import type { PageData } from '../../$types.js';
	import Aside from '../../../stories/Aside/Aside.svelte';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';
	import HorizontalScroller from '../../../stories/HorizontalScroller/HorizontalScroller.svelte';
	import WordCard from '../../../stories/WordCard/WordCard.svelte';

	export let data: PageData;

	const phrase = data.phrase;
	phrase.words = [
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
	<h1 class="relative mb-3 text-2xl leading-none font-extrabold">
		{phrase.title}
		<EditIcon href="/phrases/{phrase.slug}/edit" size="large" />
	</h1>
	<blockquote class="mt-10 border-l-4 border-l-gray-700 pl-4">
		<p class="mb-3 text-xl font-semibold">“{phrase.phrase}”</p>
	</blockquote>
</Content>

{#if phrase.words && phrase.words.length > 0}
	<Aside>
		<h2 class="mb-3 text-xl font-semibold">Words in this phrase:</h2>
		<HorizontalScroller>
			{#each phrase.words as word (word.id)}
				<div class="shrink-0 grow-1 basis-[50vw] md:basis-[25vw] lg:basis-[20vw] xl:basis-[15vw]">
					<WordCard {word} />
				</div>
			{/each}
		</HorizontalScroller>
	</Aside>
{/if}
