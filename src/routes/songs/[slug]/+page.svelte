<script lang='ts'>
  import type { PageData } from './$types'
  import Aside from '$lib/components/Aside.svelte'
  import Content from '$lib/components/Content.svelte'
  import EditIcon from '$lib/components/EditIcon.svelte'
  import WordScroller from '$lib/components/WordScroller.svelte'

  export let data: PageData

  const song = data.song
</script>

<svelte:head>
  <title>Sign and sing '{song.title}' • Baby Sign • Kuzio Apps</title>
  <meta name='description' content="Sign and sing '{song.title}'" />
</svelte:head>

<Content>
  <h1 class='relative mb-3 text-center text-2xl leading-none font-extrabold'>
    {song.title}
    {#if data.user}
      <EditIcon href='/songs/{song.slug}/edit' size='large' />
    {/if}
  </h1>
  {#if song.tags.length > 0}
    <div class='mb-3 flex flex-wrap justify-center gap-2'>
      {#each song.tags as { tag } (tag.id)}
        <a href='/songs?tag={tag.slug}' class='badge badge-primary'>{tag.name}</a>
      {/each}
    </div>
  {/if}
  {#each song.lyrics.split('.').filter(Boolean) as segment, i (i)}
    <p class='mt-10 text-center text-xl italic'>
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
    <h2 class='mb-3 text-xl font-semibold'>Words in this song:</h2>
    <WordScroller words={song.words} imageUrl={data.imageUrl} />
  </Aside>
{/if}
