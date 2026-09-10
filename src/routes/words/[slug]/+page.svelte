<script lang='ts'>
  import type { PageData } from './$types'
  import Content from '$lib/components/Content.svelte'
  import EditIcon from '$lib/components/EditIcon.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import WordCard from '$lib/components/WordCard.svelte'

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
      <EditIcon href='/words/{word.slug}/edit' size='large' />
    {/if}
  </h1>
  {#if word.tags.length > 0}
    <div class='mb-3 flex flex-wrap gap-2'>
      {#each word.tags as { tag } (tag.id)}
        <a href='/words?tag={tag.slug}' class='badge badge-primary'>{tag.name}</a>
      {/each}
    </div>
  {/if}
  <div class='mt-10 mb-3'>
    <WordCard {word} imageUrl={data.imageUrl} size='large' />
  </div>
  <figure>
    <!--
    {#if word.definition}
      <blockquote class="border-l-4 border-l-gray-700 pl-4">
        <p class="mb-3">{word.definition}</p>
      </blockquote>
    {/if}
    -->
    {#if word.phrases.length}
      <h3 class='mb-3 text-lg font-semibold'>Phrases with '{word.word}':</h3>
      <ul
        class='align-center mb-3 grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'
      >
        {#each word.phrases as phrase (phrase.phrase.slug)}
          <li class='shrink-0 grow-0 basis-full'>
            <NavCard
              href='/phrases/{phrase.phrase.slug}'
              label={phrase.phrase.title}
              description='“{phrase.phrase.phrase}”'
            />
          </li>
        {/each}
      </ul>
    {/if}
    {#if word.songs.length}
      <h3 class='mb-3 text-lg font-semibold'>Songs with '{word.word}':</h3>
      <ul
        class='align-center mb-3 grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'
      >
        {#each word.songs as song (song.song.slug)}
          <li class='shrink-0 grow-0 basis-full'>
            <NavCard href='/songs/{song.song.slug}' label={song.song.title} />
          </li>
        {/each}
      </ul>
    {/if}
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
</Content>
