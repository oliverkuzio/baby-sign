<script lang='ts'>
  import type { Tag, Word } from '$lib/server/db/schema'
  import EditIcon from './EditIcon.svelte'
  import FavouriteIcon from './FavouriteIcon.svelte'

  interface Props {
    /** Entry's numeric id — needed for the favourite toggle's hidden input. */
    id: number
    /** Where the title links to. */
    href: string
    /** Where the edit pencil links to. */
    editHref: string
    /** Entry title. */
    title: string
    /** Short description/quote shown under the title. */
    description?: string
    /** Tags applied to the entry, shown as filter links under the description. */
    tags?: { tag: Tag }[]
    /** Base listing href tag links filter against, e.g. '/phrases' or '/songs'. */
    tagFilterHref?: string
    /** Words used in the entry, shown as up to four circular preview icons. */
    words?: { word: Word }[]
    imageUrl: string
    showEdit?: boolean
    showFavourite?: boolean
    favourited?: boolean
  }

  const {
    id,
    href,
    editHref,
    title,
    description = '',
    tags = [],
    tagFilterHref = '',
    words = [],
    imageUrl,
    showEdit = false,
    showFavourite = false,
    favourited = false,
  }: Props = $props()

  const hasMoreWords = $derived(words.length > 4)
  const previewWords = $derived(words.slice(0, hasMoreWords ? 3 : 4).map(({ word }) => word))
</script>

<div class='card bg-base-200 border-base-300 border-4 relative text-left'>
  {#if tags.length > 0}
    <div class='absolute top-2 left-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1'>
      {#each tags as { tag } (tag.id)}
        <a href='{tagFilterHref}?tag={tag.slug}' class='badge badge-primary'>{tag.name}</a>
      {/each}
    </div>
  {/if}
  <a href={href} class='card-body flex flex-col gap-3 p-4 pt-12 md:flex-row md:items-center md:justify-between'>
    <div>
      <h2 class='card-title text-lg'>{title}</h2>
      {#if description}
        <p class='text-sm opacity-60'>{description}</p>
      {/if}
    </div>

    {#if previewWords.length > 0}
      <div class='flex shrink-0 items-center gap-2 md:justify-end'>
        {#each previewWords as word (word.id)}
          <img
            src={`${imageUrl}/${word.slug}-preview-webp.webp`}
            alt={word.word}
            class='size-12 rounded-full object-cover'
          />
        {/each}
        {#if hasMoreWords}
          <div class='bg-base-300 flex size-12 shrink-0 items-center justify-center rounded-full'>
            <span class='text-2xl leading-none font-bold' aria-hidden='true'>+</span>
          </div>
        {/if}
      </div>
    {/if}
  </a>
  {#if showFavourite}
    <FavouriteIcon {id} {favourited} size='small' inset={true} />
  {/if}
  {#if showEdit}
    <EditIcon href={editHref} size='small' inset={true} />
  {/if}
</div>
