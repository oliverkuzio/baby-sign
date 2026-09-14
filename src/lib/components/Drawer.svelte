<script lang='ts'>
  import type { Snippet } from 'svelte'

  interface Props {
    items?: { href: string, label: string }[]
    children?: Snippet
  }

  const { items = [], children }: Props = $props()

  let drawerOpen = $state(false)
</script>

<div class='drawer'>
  <input id='nav-drawer' type='checkbox' class='drawer-toggle' bind:checked={drawerOpen} />

  <div class='drawer-content bg-base-100 text-base-content flex min-h-screen flex-col'>
    {@render children?.()}
  </div>

  <div class='drawer-side z-50'>
    <label for='nav-drawer' aria-label='Close menu' class='drawer-overlay'></label>
    <ul class='menu bg-base-200 text-base-content min-h-full w-72 p-4'>
      {#each items as item (item.label)}
        <li><a href={item.href} onclick={() => (drawerOpen = false)}>{item.label}</a></li>
      {/each}
    </ul>
  </div>
</div>
