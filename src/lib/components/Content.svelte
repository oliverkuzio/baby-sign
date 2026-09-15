<script lang='ts'>
  import type { Snippet } from 'svelte'

  interface Props {
    justify?: 'start' | 'center' | 'end'
    children?: Snippet
  }

  const {
    justify = 'start',
    children,
  }: Props = $props()
</script>

<section
  class='px-4 py-10 text-center'
  class:mt-auto={justify === 'center'}
  class:mb-auto={justify === 'center'}
>
  {@render children?.()}
</section>
