<script lang='ts'>
  import type { PageData } from './$types'
  import Content from '$lib/components/Content.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import SearchAutocomplete from '$lib/components/SearchAutocomplete.svelte'
  import TagFilter from '$lib/components/TagFilter.svelte'

  export let data: PageData

  let query = ''

  $: songs = data.songs
  $: extraParams = data.selectedTagSlugs.map((slug): [string, string] => ['tag', slug])
  $: searchItems = songs.map(song => ({ id: song.id, label: song.title }))
  $: filteredSongs = songs.filter(song =>
    !query.trim() || song.title.toLowerCase().includes(query.trim().toLowerCase()),
  )
</script>

<svelte:head>
  <title>Songs to sign and sing • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Songs to sign and sing' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Songs</h1>
  <p class='mb-3'>Here are some songs to sign and sing:</p>

  <TagFilter tags={data.tags} selectedTagSlugs={data.selectedTagSlugs} />

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
      {#if songs.length === 0 && data.selectedTagSlugs.length > 0}
        No songs match the selected tags.
      {:else if songs.length === 0}
        No songs found.
      {:else}
        No songs match your search.
      {/if}
    </p>
  {/if}

  <ul
    class='align-center mb-3 grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'
  >
    {#if filteredSongs && filteredSongs.length > 0}
      {#each filteredSongs as song (song.id)}
        <li>
          <NavCard href='/songs/{song.slug}' label={song.title} />
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
