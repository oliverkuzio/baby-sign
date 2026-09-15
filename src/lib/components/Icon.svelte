<script lang='ts'>
  import type { Snippet } from 'svelte'

  interface Props {
    color: 'primary' | 'secondary' | 'accent' | 'neutral'
    children?: Snippet
  }

  const {
    color,
    children,
  }: Props = $props()

</script>
<div class={`bg-${color}/10 text-${color} flex size-28 items-center justify-center rounded-full sm:size-32`}>
  {@render children?.()}
</div>
