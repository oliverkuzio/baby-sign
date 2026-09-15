<script lang='ts'>
  import Drawer from '$lib/components/Drawer.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import '../app.css'

  const { children, data } = $props()

  const items = $derived(
    data.user
      ? [
        { href: '/words', label: 'Dictionary' },
        { href: '/phrases', label: 'Phrasebook' },
        { href: '/songs', label: 'Songbook' },
        ...(data.user.role === 'admin' ? [{ href: '/tags', label: 'Tags' }] : []),
      ]
      : [],
  )
</script>

<Drawer {items} user={data.user}>
  <Header {items} user={data.user} />
  <main class='relative flex grow flex-col items-stretch'>
    {@render children?.()}
  </main>
  <Footer />
</Drawer>
