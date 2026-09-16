<script lang='ts'>
  import type { PageData } from './$types'
  import Content from '$lib/components/Content.svelte'
  import EditIcon from '$lib/components/EditIcon.svelte'
  import EntryCard from '$lib/components/EntryCard.svelte'
  import FavouriteIcon from '$lib/components/FavouriteIcon.svelte'
  import WordCard from '$lib/components/WordCard.svelte'
  import { snippet } from '$lib/snippet'

  export let data: PageData

  const word = data.word
</script>

<svelte:head>
  <title>Learn to sign the word '{word.word}' • Baby Sign • Kuzio Apps</title>
  <meta name='description' content="Learn to sign the word '{word.word}'" />
</svelte:head>

<Content>
  <h1 class='relative mb-3 text-2xl leading-none font-extrabold'>
    {word.word}
    {#if data.user}
      <FavouriteIcon id={word.id} favourited={data.favourited} size='large' />
      <EditIcon href='/words/{word.slug}/edit' size='large' />
    {/if}
  </h1>
  {#if word.tags.length > 0}
    <div class='mb-3 flex flex-wrap justify-center gap-2'>
      {#each word.tags as { tag } (tag.id)}
        <a href='/words?tag={tag.slug}' class='badge badge-primary'>{tag.name}</a>
      {/each}
    </div>
  {/if}
  <figure class='mt-10 mb-3 flex flex-col items-center justify-center max-w-96 ml-auto mr-auto'>
    <WordCard {word} imageUrl={data.imageUrl} size='large' />
    <figcaption>
      <cite class='text-base-content/60 text-sm'>
        Graphic
        <!--
        {#if word.definition}
          and definition
        {/if}
        -->
        for {word.word} sign from
        <a
          href='https://babysignlanguage.com/dictionary/{word.slug}/'
          class='link link-hover'
          target='_blank'>babysignlanguage.com</a
        >.
      </cite>
    </figcaption>
  </figure>
  {#if word.description}
    <p class='mb-3 whitespace-pre-line text-center'>{word.description}</p>
  {/if}
  {#if word.phrases.length}
    <h3 class='mb-3 text-lg font-semibold'>Phrases with '{word.word}':</h3>
    <ul class='mb-3 flex flex-col max-w-4xl ml-auto mr-auto gap-4'>
      {#each word.phrases as { phrase } (phrase.slug)}
        <li>
          <EntryCard
            id={phrase.id}
            href='/phrases/{phrase.slug}'
            editHref='/phrases/{phrase.slug}/edit'
            title={phrase.title}
            description='“{phrase.phrase}”'
            tags={phrase.tags}
            tagFilterHref='/phrases'
            words={phrase.words}
            imageUrl={data.imageUrl}
          />
        </li>
      {/each}
    </ul>
  {/if}
  {#if word.songs.length}
    <h3 class='mb-3 text-lg font-semibold'>Songs with '{word.word}':</h3>
    <ul class='mb-3 flex flex-col max-w-4xl ml-auto mr-auto gap-4'>
      {#each word.songs as { song } (song.slug)}
        <li>
          <EntryCard
            id={song.id}
            href='/songs/{song.slug}'
            editHref='/songs/{song.slug}/edit'
            title={song.title}
            description={snippet(song.lyrics, 50)}
            tags={song.tags}
            tagFilterHref='/songs'
            words={song.words}
            imageUrl={data.imageUrl}
          />
        </li>
      {/each}
    </ul>
  {/if}
</Content>
