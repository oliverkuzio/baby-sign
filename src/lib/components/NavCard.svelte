<script lang='ts'>
  interface Props {
    /** Where should this nav item direct to? */
    href: string
    /** Link text */
    label: string
    /** Link description */
    description?: string
  }

  const { href, label, description = '' }: Props = $props()
</script>

<article class='overflow-hidden rounded bg-white/10 shadow-lg'>
  <a {href} class='block'>
    <div class='px-6 py-4'>
      <h2 class='text-lg font-bold'>{label}</h2>
      {#if description}
        <p class='text-sm text-gray-500'>{description}</p>
      {/if}
    </div>
  </a>
</article>
