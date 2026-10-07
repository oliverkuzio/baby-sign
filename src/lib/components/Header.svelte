<script lang='ts'>
  import type { NavItem } from '$lib/nav'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { authClient } from '$lib/auth-client'
  import { isActive } from '$lib/nav'
  import Logo from './Logo.svelte'
  import ThemeToggle from './ThemeToggle.svelte'

  interface Props {
    items?: NavItem[]
    user?: { name: string } | null
  }

  const { items = [], user }: Props = $props()

  function signIn() {
    authClient.signIn.social({ provider: 'github', callbackURL: '/dashboard' })
  }

  function signOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => goto('/', { invalidateAll: true }),
      },
    })
  }
</script>

<header class='navbar bg-base-100 text-base-content sticky top-0 z-50'>
  <div class='navbar-start'>
    <a href='/' class='btn btn-ghost text-base-content px-2 text-lg normal-case'>
      <Logo size={28} />
      <span>Baby Sign</span>
    </a>
  </div>

  <div class='navbar-center hidden lg:flex'>
    <ul class='menu menu-horizontal px-1'>
      {#each items as item (item.label)}
        {@const active = isActive(page.url.pathname, item.href)}
        <li>
          <a href={item.href} class:menu-active={active} aria-current={active ? 'page' : undefined}>
            <item.icon class='size-5' />
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>

  <div class='navbar-end gap-2'>
    <ThemeToggle />
    <div>
      {#if user}
        <span class='hidden text-sm sm:inline'>Signed in as {user.name}.</span>
        <button type='button' class='btn btn-sm' onclick={signOut}>Sign out</button>
      {:else}
        <button type='button' class='btn btn-sm btn-primary' onclick={signIn}>
          Sign in with GitHub
        </button>
      {/if}
    </div>
  </div>
</header>
