<script lang='ts'>
  import type { Word } from '../server/db/schema'
  import HorizontalScroller from './HorizontalScroller.svelte'
  import WordCard from './WordCard.svelte'

  interface Props {
    words: {
      word: Word
    }[]
    imageUrl: string
  }

  const { words = [], imageUrl }: Props = $props()
</script>

<HorizontalScroller>
  {#each words as word (word.word.id)}
    <div class='shrink-0 grow-0 basis-[40vw] md:basis-[25vw] lg:basis-[20vw] xl:basis-[15vw]'>
      <WordCard word={word.word} {imageUrl} />
    </div>
  {/each}
</HorizontalScroller>
