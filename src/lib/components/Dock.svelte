<script lang='ts'>
  import type { NavItem } from '$lib/nav'
  import { page } from '$app/state'
  import { isActive } from '$lib/nav'

  interface Props {
    items?: NavItem[]
  }

  const { items = [] }: Props = $props()
</script>

<nav class='dock bg-base-200 text-base-content z-50 lg:hidden' aria-label='Main'>
  {#each items as item (item.label)}
    {@const active = isActive(page.url.pathname, item.href)}
    <a href={item.href} class:dock-active={active} aria-current={active ? 'page' : undefined}>
      <item.icon class='size-6' />
      <span class='dock-label'>{item.label}</span>
    </a>
  {/each}
</nav>
