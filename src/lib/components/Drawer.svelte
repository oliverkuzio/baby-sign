<script lang='ts'>
  import type { Snippet } from 'svelte'
  import { goto } from '$app/navigation'
  import { authClient } from '$lib/auth-client'

  interface Props {
    items?: { href: string, label: string }[]
    user?: { name: string } | null
    children?: Snippet
  }

  const { items = [], user, children }: Props = $props()

  let drawerOpen = $state(false)

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

<div class='drawer drawer-end'>
  <input id='nav-drawer' type='checkbox' class='drawer-toggle' bind:checked={drawerOpen} />

  <div
    class='drawer-content bg-base-100 text-base-content flex min-h-screen flex-col'
  >
    {@render children?.()}
  </div>

  <div class='drawer-side z-50'>
    <label for='nav-drawer' aria-label='Close menu' class='drawer-overlay'></label>

    <ul class='menu bg-base-200 text-base-content min-h-full w-72 p-4 pt-8'>
      {#if user}
        <li>Signed in as {user.name}.</li>
        <li><button type='button' class='btn btn-sm' onclick={signOut}>Sign out</button></li>
      {:else}
        <li>You are not signed in.</li>
        <li><button type='button' class='btn btn-sm btn-primary' onclick={signIn}>Sign in with GitHub</button></li>
      {/if}

      {#each items as item (item.label)}
        <li><a href={item.href} onclick={() => (drawerOpen = false)}>{item.label}</a></li>
      {/each}
    </ul>
  </div>
</div>
