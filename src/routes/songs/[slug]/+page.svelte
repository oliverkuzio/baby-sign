<script lang='ts'>
  import type { PageData } from './$types'
  import Aside from '$lib/components/Aside.svelte'
  import Content from '$lib/components/Content.svelte'
  import EditIcon from '$lib/components/EditIcon.svelte'
  import FavouriteIcon from '$lib/components/FavouriteIcon.svelte'
  import WordScroller from '$lib/components/WordScroller.svelte'
  import { extractYouTubeVideoId } from '$lib/youtube'

  export let data: PageData

  const song = data.song
  const hasLyrics = song.lyrics.trim().length > 0
  const videoId = song.videoUrl ? extractYouTubeVideoId(song.videoUrl) : null
  const hasVideo = videoId !== null

  let activeTab: 'lyrics' | 'video' = hasLyrics ? 'lyrics' : 'video'
</script>

<svelte:head>
  <title>Sign and sing '{song.title}' • Baby Sign • Kuzio Apps</title>
  <meta name='description' content="Sign and sing '{song.title}'" />
</svelte:head>

<Content>
  <h1 class='relative mb-3 text-center text-2xl leading-none font-extrabold'>
    {song.title}
    {#if data.user}
      <FavouriteIcon id={song.id} favourited={data.favourited} size='large' />
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
  {#if hasLyrics && hasVideo}
    <div role='tablist' class='tabs tabs-boxed mt-6 justify-center'>
      <button
        type='button'
        role='tab'
        class='tab'
        class:tab-active={activeTab === 'lyrics'}
        onclick={() => (activeTab = 'lyrics')}
      >
        Lyrics
      </button>
      <button
        type='button'
        role='tab'
        class='tab'
        class:tab-active={activeTab === 'video'}
        onclick={() => (activeTab = 'video')}
      >
        Video
      </button>
    </div>
  {/if}

  {#if hasLyrics && (!hasVideo || activeTab === 'lyrics')}
    {#each song.lyrics.split('.').filter(Boolean) as verse, i (i)}
      {@const lines = verse.split(/,\s*\n/)}
      <p class='mt-10 text-center text-xl italic'>
        ♬
        <br />

        {#each lines as line, i (line + i)}
          {#if i < lines.length - 1}
            {line}, <br />
          {:else}
            {line}.
          {/if}
        {/each}
      </p>
    {/each}
  {/if}

  {#if hasVideo && (!hasLyrics || activeTab === 'video')}
    <div class='mx-auto mt-10 aspect-video w-full max-w-2xl'>
      <iframe
        class='h-full w-full rounded-box'
        src='https://www.youtube.com/embed/{videoId}'
        title={song.title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowfullscreen
      ></iframe>
    </div>
  {/if}
</Content>

{#if song.words && song.words.length > 0}
  <Aside>
    <h2 class='mb-3 text-xl font-semibold'>Words in this song:</h2>
    <WordScroller words={song.words} imageUrl={data.imageUrl} />
  </Aside>
{/if}
