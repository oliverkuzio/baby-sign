<script lang='ts'>
  import type { Word } from '../server/db/schema'
  import { PUBLIC_IMAGE_URL } from '$env/static/public'
  import EditIcon from './EditIcon.svelte'

  interface Props {
    word: Word
    size?: 'small' | 'large'
    showEdit?: boolean
  }

  const { word, size = 'small', showEdit = false }: Props = $props()
</script>

<article
  class='relative aspect-square max-w-96 rounded-lg bg-white/10 shadow-md transition-shadow duration-300 hover:shadow-lg'
>
  <a href='/dictionary/{word.slug}/' class='block flex aspect-square flex-col p-4'>
    {#if word.slug}
      <img class='mt-auto mb-3' src={`${PUBLIC_IMAGE_URL}/${word.slug}.svg`} alt={word.word} />
    {/if}
    <p
      class='mt-auto text-center font-bold uppercase'
      class:text-xl={size === 'small'}
      class:text-2xl={size === 'large'}
    >
      {word.word}
    </p>
  </a>
  {#if showEdit}
    <EditIcon href='/dictionary/{word.slug}/edit' size='large' inset={true} />
  {/if}
</article>
