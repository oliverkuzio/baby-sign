<script lang='ts'>
  import type { Tag, Word } from '../server/db/schema'
  import EditIcon from './EditIcon.svelte'
  import FavouriteIcon from './FavouriteIcon.svelte'

  interface Props {
    word: Word
    imageUrl: string
    size?: 'small' | 'large'
    showEdit?: boolean
    showFavourite?: boolean
    favourited?: boolean
    tags?: { tag: Tag }[]
  }

  const {
    word,
    imageUrl,
    size = 'small',
    showEdit = false,
    showFavourite = false,
    favourited = false,
    tags = [],
  }: Props = $props()
</script>

<div class='card bg-base-200 border-base-300 border-4 relative aspect-square max-w-96'>
  {#if tags.length > 0}
    <div class='absolute top-4 left-4 flex max-w-[calc(100%-1rem)] flex-wrap gap-1'>
      {#each tags as { tag } (tag.id)}
        <a href='/words?tag={tag.slug}' class='badge badge-primary badge-sm'>
          {tag.name}
        </a>
      {/each}
    </div>
  {/if}
  <a
    href='/words/{word.slug}/'
    class='card-body flex aspect-square flex-col items-center justify-center p-4 gap-4'
  >
    {#if word.slug}
      <img src={`${imageUrl}/${word.slug}.svg`} alt={word.word} />
    {/if}
    <p
      class='grow-0 text-center font-bold uppercase mb-0'
      class:text-xl={size === 'small'}
      class:text-2xl={size === 'large'}
    >
      {word.word}
    </p>
  </a>
  {#if showFavourite}
    <FavouriteIcon id={word.id} {favourited} size='large' inset={true} />
  {/if}
  {#if showEdit}
    <EditIcon href='/words/{word.slug}/edit' size='large' inset={true} />
  {/if}
</div>
