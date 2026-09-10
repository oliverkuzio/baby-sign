<script lang='ts'>
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import '../app.css'

  const { children, data } = $props()

  const items = $derived([
    { href: '/dictionary', label: 'Dictionary' },
    { href: '/phrases', label: 'Phrases' },
    { href: '/songs', label: 'Songs' },
    ...(data.user?.role === 'admin' ? [{ href: '/tags', label: 'Tags' }] : []),
  ])
</script>

<Header {items} user={data.user}>
  <main class='relative flex grow flex-col items-stretch'>
    {@render children?.()}
  </main>
  <Footer />
</Header>
