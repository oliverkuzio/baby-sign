<script lang="ts">
	import type { PageData } from './$types';
	import Content from '$lib/components/Content.svelte';
	import NavCard from '$lib/components/NavCard.svelte';

	export let data: PageData;

	const songs = data.songs;
</script>

<svelte:head>
	<title>Songs to sign and sing • Baby Sign • Kuzio Apps</title>
	<meta name="description" content="Songs to sign and sing" />
</svelte:head>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Songs</h1>
	<p class="mb-3">Here are some songs to sign and sing:</p>

	{#if songs && songs.length > 0}
		<ul
			class="align-center mb-3 grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3"
		>
			{#each songs as song (song.id)}
				<li>
					<NavCard href="/songs/{song.slug}" label={song.title} />
				</li>
			{/each}
			<!--
			<li>
				<NavCard href="/songs/add" label="Add song +" />
			</li>
			-->
		</ul>
	{:else}
		<p>No songs found.</p>
	{/if}
</Content>
