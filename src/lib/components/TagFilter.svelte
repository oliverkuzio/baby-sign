<script lang='ts'>
  import type { Tag } from '../server/db/schema'

  interface Props {
    /** All tags available to filter by. */
    tags: Tag[]
    /** Slugs of the tags currently applied as filters (from the URL). */
    selectedTagSlugs: string[]
  }

  const { tags, selectedTagSlugs }: Props = $props()

  function hrefFor(tag: Tag) {
    const next = selectedTagSlugs.includes(tag.slug)
      ? selectedTagSlugs.filter(slug => slug !== tag.slug)
      : [...selectedTagSlugs, tag.slug]

    if (next.length === 0)
      return '?'

    return `?${next.map(slug => `tag=${encodeURIComponent(slug)}`).join('&')}`
  }
</script>

{#if tags.length > 0}
  <div class='mb-4 flex flex-wrap items-center gap-2'>
    {#each tags as tag (tag.id)}
      <a
        href={hrefFor(tag)}
        class='badge badge-lg'
        class:badge-primary={selectedTagSlugs.includes(tag.slug)}
      >
        {tag.name}
      </a>
    {/each}
    {#if selectedTagSlugs.length > 0}
      <a href='?' class='badge badge-lg badge-ghost'>Clear filters ✕</a>
    {/if}
  </div>
{/if}
