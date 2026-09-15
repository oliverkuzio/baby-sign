<script lang='ts'>
  import { goto } from '$app/navigation'
  import { authClient } from '$lib/auth-client'
  import MenuFillIcon from '~icons/mingcute/menu-fill'
  import Logo from './Logo.svelte'
  import ThemeToggle from './ThemeToggle.svelte'

  interface Props {
    items?: { href: string, label: string }[]
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
        <li><a href={item.href}>{item.label}</a></li>
      {/each}
    </ul>
  </div>

  <div class='navbar-end gap-2'>
    <ThemeToggle />
    <div class='hidden sm:block'>
      {#if user}
        <span class='text-sm'>Signed in as {user.name}.</span>
        <button type='button' class='btn btn-sm' onclick={signOut}>Sign out</button>
      {:else}
        <button type='button' class='btn btn-sm btn-primary' onclick={signIn}>
          Sign in with GitHub
        </button>
      {/if}
    </div>
    <label for='nav-drawer' aria-label='Open menu' class='btn btn-square btn-ghost lg:hidden'>
      <MenuFillIcon class='size-6' />
    </label>
  </div>
</header>
