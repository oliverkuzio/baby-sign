<script lang='ts'>
  import Content from '$lib/components/Content.svelte'
  import Hero from '$lib/components/Hero.svelte'
</script>

<svelte:head>
  <title>Offline • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content justify='center'>
  <Hero
    title="You're offline"
    message="Pages you've opened before are still available. Reconnect to see everything else."
  >
    <a href='/dashboard' class='btn btn-primary btn-lg'>Go to dashboard</a>
  </Hero>
</Content>
