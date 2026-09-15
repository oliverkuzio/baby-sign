<script lang='ts'>
  import type { Snippet } from 'svelte'

  interface Props {
    children?: Snippet
  }

  const {
    children,
  }: Props = $props()

</script>
<div class='bg-primary/10 flex size-28 items-center justify-center rounded-full sm:size-32'>
  {@render children?.()}
</div>
