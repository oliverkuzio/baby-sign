<script lang='ts'>
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import Content from '$lib/components/Content.svelte'
  import Hero from '$lib/components/Hero.svelte'
</script>

<svelte:head>
  <title>{page.status} • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <Hero
    title={browser && !navigator.onLine ? 'Offline' : String(page.status)}
    message={page.error?.message ?? 'Something went wrong.'}
  >
    <a href='/' class='btn btn-primary btn-lg'>Back to Baby Sign</a>
  </Hero>
</Content>
