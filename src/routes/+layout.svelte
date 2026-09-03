<script lang='ts'>
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import '../app.css'

  const { children, data } = $props()

  const items = [
    { href: '/', label: 'Home' },
    { href: '/dictionary', label: 'Dictionary' },
    { href: '/phrases', label: 'Phrases' },
    { href: '/songs', label: 'Songs' },
  ]
</script>

<Header {items} user={data.user}>
  <main class='relative flex grow flex-col items-stretch'>
    {@render children?.()}
  </main>
  <Footer />
</Header>
