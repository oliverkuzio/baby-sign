<script lang='ts'>
  import Dock from '$lib/components/Dock.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import { navItemsFor } from '$lib/nav'
  import '../app.css'

  const { children, data } = $props()

  const items = $derived(navItemsFor(data.user))
</script>

<!-- Bottom padding keeps the footer clear of the fixed mobile dock. -->
<div class={['bg-base-100 text-base-content flex min-h-screen flex-col', items.length > 0 && 'pb-16 lg:pb-0']}>
  <Header {items} user={data.user} />
  <main class='relative flex grow flex-col items-stretch'>
    {@render children?.()}
  </main>
  <Footer />
</div>

{#if items.length > 0}
  <Dock {items} />
{/if}
