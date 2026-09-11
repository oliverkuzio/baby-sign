<script lang='ts'>
  import type { Tag } from '../server/db/schema'

  interface Props {
    /** All tags available to filter by. */
    tags: Tag[]
    /** Slugs of the tags currently applied as filters (from the URL). */
    selectedTagSlugs: string[]
    /** Whether the "favourites only" filter is currently applied. */
    favouritesOnly?: boolean
  }

  const { tags, selectedTagSlugs, favouritesOnly = false }: Props = $props()

  function hrefFor(next: string[], nextFavouritesOnly: boolean) {
    const params = next.map(slug => `tag=${encodeURIComponent(slug)}`)
    if (nextFavouritesOnly)
      params.push('favourite=1')

    return params.length > 0 ? `?${params.join('&')}` : '?'
  }

  function hrefForTag(tag: Tag) {
    const next = selectedTagSlugs.includes(tag.slug)
      ? selectedTagSlugs.filter(slug => slug !== tag.slug)
      : [...selectedTagSlugs, tag.slug]

    return hrefFor(next, favouritesOnly)
  }

  function hrefForFavouritesToggle() {
    return hrefFor(selectedTagSlugs, !favouritesOnly)
  }
</script>

<div class='mb-4 flex flex-wrap items-center gap-2'>
  <a
    href={hrefForFavouritesToggle()}
    class='badge badge-lg'
    class:badge-primary={favouritesOnly}
    aria-current={favouritesOnly}
  >
    ★ Favourites
  </a>
  {#each tags as tag (tag.id)}
    <a
      href={hrefForTag(tag)}
      class='badge badge-lg'
      class:badge-primary={selectedTagSlugs.includes(tag.slug)}
    >
      {tag.name}
    </a>
  {/each}
  {#if selectedTagSlugs.length > 0 || favouritesOnly}
    <a href='?' class='badge badge-lg badge-ghost'>Clear filters ✕</a>
  {/if}
</div>
