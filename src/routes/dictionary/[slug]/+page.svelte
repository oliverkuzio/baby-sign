<script lang="ts">
	import type { PageData } from '../../$types.js';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';
	import WordCard from '../../../stories/WordCard/WordCard.svelte';

	export let data: PageData;

	const word = data.word;
</script>

<Content>
	<h1 class="relative mb-3 text-2xl leading-none font-extrabold">
		{word.word}
		<EditIcon href="/dictionary/{word.slug}/edit" size="large" />
	</h1>
	<div class="mt-10 mb-3">
		<WordCard {word} size="large" />
	</div>
	<figure>
		{#if word.definition}
			<blockquote class="border-l-4 border-l-gray-700 pl-4">
				<p class="mb-3">{word.definition}</p>
			</blockquote>
		{/if}
		{#if word.phrases.length}
			<p class="mb-3">Phrases with '{word.word}':</p>
			<ul class="mb-3 list-disc">
				{#each word.phrases as phrase}
					<li class="ms-6">
						<a href="/phrases/{phrase.phrase.slug}" class="underline">
							{phrase.phrase.phrase}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
		{#if word.songs.length}
			<p class="mb-3">Songs with '{word.word}':</p>
			<ul class="mb-3 list-disc">
				{#each word.songs as song}
					<li class="ms-6">
						<a href="/songs/{song.song.slug}" class="underline">
							{song.song.title}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
		<figcaption>
			<cite class="text-sm text-gray-500">
				Graphic
				{#if word.definition}
					and definition
				{/if}
				for {word.word} sign from
				<a
					href="https://babysignlanguage.com/dictionary/{word.slug}/"
					class="underline"
					target="_blank">babysignlanguage.com</a
				>.
			</cite>
		</figcaption>
	</figure>
</Content>
