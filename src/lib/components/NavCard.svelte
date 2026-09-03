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

<a {href} class='card bg-base-200 shadow-lg'>
  <div class='card-body p-6'>
    <h2 class='card-title text-lg'>{label}</h2>
    {#if description}
      <p class='text-sm opacity-60'>{description}</p>
    {/if}
  </div>
</a>
