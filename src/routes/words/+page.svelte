<script lang='ts'>
  import type { PageData } from './$types'
  import Content from '$lib/components/Content.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import TagFilter from '$lib/components/TagFilter.svelte'
  import WordAutocomplete from '$lib/components/WordAutocomplete.svelte'
  import WordCard from '$lib/components/WordCard.svelte'

  export let data: PageData

  let query = ''

  $: words = data.words.filter(word =>
    !query.trim() || word.word.toLowerCase().includes(query.trim().toLowerCase()),
  )
  $: extraParams = data.selectedTagSlugs.map((slug): [string, string] => ['tag', slug])
</script>

<svelte:head>
  <title>Words to learn and sign • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Words to learn and sign' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Dictionary</h1>
  <p class='mb-3'>Here are some words you can learn:</p>

  <TagFilter tags={data.tags} selectedTagSlugs={data.selectedTagSlugs} />

  {#if data.words.length > 0}
    <div class='mb-4 max-w-sm'>
      <WordAutocomplete
        words={data.words}
        imageUrl={data.imageUrl}
        selectable={false}
        bind:query
        placeholder='Search words…'
      />
    </div>
  {/if}

  {#if !words || words.length === 0}
    <p>
      {#if data.words.length === 0 && data.selectedTagSlugs.length > 0}
        No words match the selected tags.
      {:else if data.words.length === 0}
        No words found.
      {:else}
        No words match your search.
      {/if}
    </p>
  {/if}

  <ul class='align-center grid grid-cols-2 justify-center gap-4 md:grid-cols-4 xl:grid-cols-6'>
    {#if words && words.length > 0}
      {#each words as word (word.id)}
        <li>
          <WordCard {word} imageUrl={data.imageUrl} showEdit={!!data.user} tags={word.tags} />
        </li>
      {/each}
    {/if}
    {#if data.user}
      <li>
        <NavCard href='/words/new' label='Add word +' />
      </li>
    {/if}
  </ul>

  <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} {extraParams} />
</Content>
