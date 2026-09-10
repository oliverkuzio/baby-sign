<script lang='ts'>
  import type { PageData } from './$types.js'
  import Content from '$lib/components/Content.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import SearchAutocomplete from '$lib/components/SearchAutocomplete.svelte'
  import TagFilter from '$lib/components/TagFilter.svelte'

  export let data: PageData

  let query = ''

  $: phrases = data.phrases
  $: extraParams = data.selectedTagSlugs.map((slug): [string, string] => ['tag', slug])
  $: searchItems = phrases.map(phrase => ({ id: phrase.id, label: phrase.title }))
  $: filteredPhrases = phrases.filter(phrase =>
    !query.trim() || phrase.title.toLowerCase().includes(query.trim().toLowerCase()),
  )
</script>

<svelte:head>
  <title>Phrasebook • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Phrases to learn and sign' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Phrasebook</h1>
  <p class='mb-3'>Here are some phrases to learn and sign:</p>

  <TagFilter tags={data.tags} selectedTagSlugs={data.selectedTagSlugs} />

  {#if phrases.length > 0}
    <div class='mb-4 max-w-sm'>
      <SearchAutocomplete
        items={searchItems}
        bind:query
        placeholder='Search phrases…'
        emptyLabel='No matching phrases.'
      />
    </div>
  {/if}

  {#if !filteredPhrases || filteredPhrases.length === 0}
    <p>
      {#if phrases.length === 0 && data.selectedTagSlugs.length > 0}
        No phrases match the selected tags.
      {:else if phrases.length === 0}
        No phrases found.
      {:else}
        No phrases match your search.
      {/if}
    </p>
  {/if}

  <ul class='align-center grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
    {#if filteredPhrases && filteredPhrases.length > 0}
      {#each filteredPhrases as phrase (phrase.id)}
        <li class='shrink-0 grow-0 basis-full'>
          <NavCard
            href='/phrases/{phrase.slug}'
            label={phrase.title}
            description='“{phrase.phrase}”'
          />
        </li>
      {/each}
    {/if}
    {#if data.user}
      <li class='shrink-0 grow-0 basis-full'>
        <NavCard href='/phrases/new' label='Add phrase +' />
      </li>
    {/if}
  </ul>

  <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} {extraParams} />
</Content>
