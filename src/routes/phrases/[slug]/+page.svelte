<script lang="ts">
	import type { PageData } from '../../$types.js';
	import Aside from '../../../stories/Aside/Aside.svelte';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';
	import WordScroller from '../../../stories/WordScroller/WordScroller.svelte';

	export let data: PageData;

	const phrase = data.phrase;
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
		<WordScroller words={phrase.words} />
	</Aside>
{/if}
