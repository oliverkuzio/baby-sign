<script lang='ts'>
  import type { PageData } from './$types'
  import Aside from '$lib/components/Aside.svelte'
  import Content from '$lib/components/Content.svelte'
  import EditIcon from '$lib/components/EditIcon.svelte'
  import FavouriteIcon from '$lib/components/FavouriteIcon.svelte'
  import WordScroller from '$lib/components/WordScroller.svelte'

  export let data: PageData

  const phrase = data.phrase
</script>

<svelte:head>
  <title>Learn to sign the phrase '{phrase.phrase}' • Baby Sign • Kuzio Apps</title>
  <meta name='description' content="Learn to sign the phrase '{phrase.phrase}'" />
</svelte:head>

<Content>
  <h1 class='relative mb-3 text-2xl leading-none font-extrabold'>
    {phrase.title}
    {#if data.user}
      <FavouriteIcon id={phrase.id} favourited={data.favourited} size='large' />
      <EditIcon href='/phrases/{phrase.slug}/edit' size='large' />
    {/if}
  </h1>
  {#if phrase.tags.length > 0}
    <div class='mb-3 flex flex-wrap justify-center gap-2'>
      {#each phrase.tags as { tag } (tag.id)}
        <a href='/phrases?tag={tag.slug}' class='badge badge-primary'>{tag.name}</a>
      {/each}
    </div>
  {/if}
  <blockquote class='mt-10 border-l-4 border-l-base-content text-center ml-auto mr-auto pl-4 w-fit'>
    <p class='mb-3 text-xl md:text-2xl lg:text-4xl font-semibold italic'>“{phrase.phrase}”</p>
  </blockquote>
</Content>

{#if phrase.words && phrase.words.length > 0}
  <Aside>
    <h2 class='mb-3 text-xl font-semibold'>Words in this phrase:</h2>
    <WordScroller words={phrase.words} imageUrl={data.imageUrl} />
  </Aside>
{/if}
