<script lang='ts'>
  import { enhance } from '$app/forms'
  import StarFillIcon from '~icons/mingcute/star-fill'
  import StarLineIcon from '~icons/mingcute/star-line'

  interface Props {
    id: number
    favourited: boolean
    size?: 'small' | 'large'
    inset?: boolean
  }

  let { id, favourited = $bindable(false), size = 'small', inset = false }: Props = $props()

  let pending = $state(false)
</script>

<form
  method='POST'
  action='?/toggleFavourite'
  class='absolute'
  class:top-0={!inset}
  class:top-2={inset && size === 'small'}
  class:top-4={inset && size === 'large'}
  class:right-8={!inset && size === 'small'}
  class:right-12={(!inset && size === 'large') || (inset && size === 'small')}
  class:right-16={inset && size === 'large'}
  use:enhance={() => {
    const previous = favourited
    favourited = !previous
    pending = true

    return async ({ result }) => {
      pending = false
      if (result.type === 'failure' || result.type === 'error') {
        favourited = previous
        return
      }
      if (result.type === 'success' && result.data && 'favourited' in result.data) {
        favourited = Boolean(result.data.favourited)
      }
    // Deliberately no `update()`/invalidate/redirect here — this is an
      // optimistic, in-place toggle; a full reload would be jarring on a
      // listing page with dozens of cards.
    }
  }}
>
  <input type='hidden' name='id' value={id} />
  <button
    type='submit'
    disabled={pending}
    class='btn btn-circle bg-secondary border-secondary text-secondary-content'
    class:btn-sm={size === 'small'}
    class:btn-md={size === 'large'}
    aria-pressed={favourited}
    aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
  >
    {#if favourited}
      <StarFillIcon width={16} height={16} />
    {:else}
      <StarLineIcon width={16} height={16} />
    {/if}
  </button>
</form>
