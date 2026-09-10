<script lang='ts'>
  import Content from '$lib/components/Content.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
</script>

<svelte:head>
  <title>Welcome to the Baby Sign app! • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Sign, sing and play!' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Baby Sign</h1>
  <p class='mb-3'>Welcome to the Baby Sign app!</p>
  <nav>
    <ul class='align-center grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
      <li>
        <NavCard
          href='/words'
          label='Dictionary'
          description='See the full list of words to sign!'
        />
      </li>
      <li>
        <NavCard
          href='/phrases'
          label='Phrasebook'
          description='See some common phrases to learn and sign!'
        />
      </li>
      <li>
        <NavCard href='/songs' label='Songbook' description='See some songs to sing and sign!' />
      </li>
    </ul>
  </nav>
</Content>
