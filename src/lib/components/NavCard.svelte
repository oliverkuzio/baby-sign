<script lang='ts'>
  interface Props {
    /** Where should this nav item direct to? */
    href: string
    /** Link text */
    label: string
    /** Link description */
    description?: string
    /** Title size */
    shape?: 'auto' | 'square'
    /** Title size */
    size?: 'small' | 'large'
  }

  const { href, label, description = '', shape = 'auto', size = 'small' }: Props = $props()
</script>

<a
  {href}
  class='card w-full bg-base-200 border-base-300 border-4'
  class:aspect-square={shape === 'square'}
  class:items-center={shape === 'square'}
>
  <div
    class='card-body p-6'
    class:justify-center={shape === 'square'}
  >
    <h2
      class='card-title self-center'
      class:text-lg={size === 'small'}
      class:text-2xl={size === 'large'}
      class:uppercase={size === 'large'}
    >
      {label}
    </h2>
    {#if description}
      <p class='grow-0 text-sm opacity-60'>{description}</p>
    {/if}
  </div>
</a>
