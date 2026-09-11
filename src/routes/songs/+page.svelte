<script lang='ts'>
  import type { PageData } from './$types'
  import Content from '$lib/components/Content.svelte'
  import EntryCard from '$lib/components/EntryCard.svelte'
  import ListingFilters from '$lib/components/ListingFilters.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import SearchAutocomplete from '$lib/components/SearchAutocomplete.svelte'

  export let data: PageData

  let query = ''

  $: songs = data.songs
  $: extraParams = [
    ...data.selectedTagSlugs.map((slug): [string, string] => ['tag', slug]),
    ...(data.favouritesOnly ? [['favourite', '1'] as [string, string]] : []),
  ]
  $: searchItems = songs.map(song => ({ id: song.id, label: song.title }))
  $: filteredSongs = songs.filter(song =>
    !query.trim() || song.title.toLowerCase().includes(query.trim().toLowerCase()),
  )
</script>

<svelte:head>
  <title>Songbook • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Songs to sign and sing' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Songbook</h1>
  <p class='mb-3'>Here are some songs to sign and sing:</p>

  <ListingFilters tags={data.tags} selectedTagSlugs={data.selectedTagSlugs} favouritesOnly={data.favouritesOnly} />

  {#if songs.length > 0}
    <div class='mb-4 max-w-sm'>
      <SearchAutocomplete
        items={searchItems}
        bind:query
        placeholder='Search songs…'
        emptyLabel='No matching songs.'
      />
    </div>
  {/if}

  {#if !filteredSongs || filteredSongs.length === 0}
    <p>
      {#if songs.length === 0 && data.favouritesOnly}
        You haven't favourited any songs yet.
      {:else if songs.length === 0 && data.selectedTagSlugs.length > 0}
        No songs match the selected tags.
      {:else if songs.length === 0}
        No songs found.
      {:else}
        No songs match your search.
      {/if}
    </p>
  {/if}

  <ul class='mb-3 flex flex-col gap-4'>
    {#if filteredSongs && filteredSongs.length > 0}
      {#each filteredSongs as song (song.id)}
        <li>
          <EntryCard
            id={song.id}
            href='/songs/{song.slug}'
            editHref='/songs/{song.slug}/edit'
            title={song.title}
            tags={song.tags}
            tagFilterHref='/songs'
            words={song.words}
            imageUrl={data.imageUrl}
            showEdit={!!data.user}
            showFavourite={!!data.user}
            favourited={data.favouritedSongIds.has(song.id)}
          />
        </li>
      {/each}
    {/if}
    {#if data.user}
      <li>
        <NavCard href='/songs/new' label='Add song +' />
      </li>
    {/if}
  </ul>

  <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} {extraParams} />
</Content>
