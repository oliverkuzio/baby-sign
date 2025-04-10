<script lang="ts">
	import type { PageData } from '../../$types.js';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';

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
