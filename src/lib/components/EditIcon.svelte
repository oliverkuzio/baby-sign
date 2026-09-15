<script lang='ts'>
  import MingcuteEdit3Fill from '~icons/mingcute/edit-3-fill'

  interface Props {
    href: string
    size?: 'small' | 'large'
    inset?: boolean
  }

  const { href, size = 'small', inset = false }: Props = $props()
</script>

<a
  {href}
  class='btn btn-accent btn-circle absolute'
  class:btn-sm={size === 'small'}
  class:btn-md={size === 'large'}
  class:top-0={!inset}
  class:top-2={inset && size === 'small'}
  class:top-4={inset && size === 'large'}
  class:right-0={!inset}
  class:right-2={inset && size === 'small'}
  class:right-4={inset && size === 'large'}
  aria-label='Edit'
>
  <MingcuteEdit3Fill width={16} height={16} />
</a>
