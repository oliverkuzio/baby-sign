<script lang="ts">
	import type { Word } from '../../lib/server/db/schema.js'; // Adjust path as needed to your types
	import HorizontalScroller from '../HorizontalScroller/HorizontalScroller.svelte';
	import WordCard from '../WordCard/WordCard.svelte';

	interface Props {
		words: {
			word: Word;
		}[];
	}

	const { words = [] }: Props = $props();
</script>

<HorizontalScroller>
	{#each words as word (word.word.id)}
		<div class="shrink-0 grow-1 basis-[50vw] md:basis-[25vw] lg:basis-[20vw] xl:basis-[15vw]">
			<WordCard word={word.word} />
		</div>
	{/each}
</HorizontalScroller>
