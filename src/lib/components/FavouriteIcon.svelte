<script lang='ts'>
  import { enhance } from '$app/forms'

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
  class:top-1={inset && size === 'small'}
  class:top-4={inset && size === 'large'}
  class:right-8={!inset && size === 'small'}
  class:right-12={!inset && size === 'large'}
  class:right-9={inset && size === 'small'}
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
    class='favourite-btn btn btn-circle'
    class:btn-xs={size === 'small'}
    class:btn-md={size === 'large'}
    class:is-favourited={favourited}
    aria-pressed={favourited}
    aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
  >
    {#if favourited}
      <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' class='bi bi-star-fill' viewBox='0 0 16 16'>
        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
      </svg>
    {:else}
      <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' class='bi bi-star' viewBox='0 0 16 16'>
        <path d='M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z' />
      </svg>
    {/if}
  </button>
</form>

<style>
  .favourite-btn {
    border-width: 2px;
  }
  .favourite-btn.is-favourited {
    background-color: var(--color-favourite);
    color: var(--color-favourite-content);
    border-color: transparent;
  }
  .favourite-btn:not(.is-favourited) {
    background-color: transparent;
    color: var(--color-favourite-muted);
    border-color: var(--color-favourite-content);
  }
</style>
