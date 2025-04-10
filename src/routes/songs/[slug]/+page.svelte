<script lang="ts">
	import type { PageData } from '../../$types';
	import Content from '../../../stories/Content/Content.svelte';
	import EditIcon from '../../../stories/EditIcon/EditIcon.svelte';

	export let data: PageData;

	const song = data.song;
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
