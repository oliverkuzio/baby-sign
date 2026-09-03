<script lang='ts'>
  interface Props {
    /** Is this the principal call to action on the page? */
    primary?: boolean
    /** How large should the button be? */
    size?: 'small' | 'medium' | 'large'
    /** Button contents */
    label: string
    /** The onclick event handler */
    onClick?: () => void
  }

  const { primary = false, size = 'medium', label, onClick }: Props = $props()
</script>

<button
  type='button'
  class='btn {primary ? 'btn-primary' : 'btn-neutral'} {size === 'small'
    ? 'btn-sm'
    : size === 'large'
    ? 'btn-lg'
    : ''}'
  onclick={onClick}
>
  {label}
</button>
