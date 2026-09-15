<script lang='ts'>
  import type { PageData } from './$types.js'
  import Content from '$lib/components/Content.svelte'
  import EntryCard from '$lib/components/EntryCard.svelte'
  import ListingFilters from '$lib/components/ListingFilters.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import SearchAutocomplete from '$lib/components/SearchAutocomplete.svelte'

  export let data: PageData

  let query = ''

  $: phrases = data.phrases
  $: extraParams = [
    ...data.selectedTagSlugs.map((slug): [string, string] => ['tag', slug]),
    ...(data.favouritesOnly ? [['favourite', '1'] as [string, string]] : []),
  ]
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

  <ListingFilters tags={data.tags} selectedTagSlugs={data.selectedTagSlugs} favouritesOnly={data.favouritesOnly} />

  {#if phrases.length > 0}
    <div class='mb-4 max-w-sm ml-auto mr-auto'>
      <SearchAutocomplete
        items={searchItems}
        bind:query
        placeholder='Search phrases…'
        emptyLabel='No matching phrases.'
      />
    </div>
  {/if}

  {#if !filteredPhrases || filteredPhrases.length === 0}
    <p class='mb-4'>
      {#if phrases.length === 0 && data.favouritesOnly}
        You haven't favourited any phrases yet.
      {:else if phrases.length === 0 && data.selectedTagSlugs.length > 0}
        No phrases match the selected tags.
      {:else if phrases.length === 0}
        No phrases found.
      {:else}
        No phrases match your search.
      {/if}
    </p>
  {/if}

  <ul class='flex flex-col max-w-4xl ml-auto mr-auto gap-4'>
    {#if filteredPhrases && filteredPhrases.length > 0}
      {#each filteredPhrases as phrase (phrase.id)}
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
            showEdit={!!data.user}
            showFavourite={!!data.user}
            favourited={data.favouritedPhraseIds.has(phrase.id)}
          />
        </li>
      {/each}
    {/if}
    {#if data.user}
      <li>
        <NavCard href='/phrases/new' label='Add phrase +' />
      </li>
    {/if}
  </ul>

  <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} {extraParams} />
</Content>
