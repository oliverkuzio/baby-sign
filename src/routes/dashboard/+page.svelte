<script lang='ts'>
  import Content from '$lib/components/Content.svelte'
  import Hero from '$lib/components/Hero.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import NavCard from '$lib/components/NavCard.svelte'
  import BlockquoteFillIcon from '~icons/mingcute/blockquote-fill'
  import MingcuteBook6Line from '~icons/mingcute/book-6-line'
  import MusicFillIcon from '~icons/mingcute/music-fill'
</script>

<svelte:head>
  <title>Welcome to the Baby Sign app! • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Sign, sing and play!' />
</svelte:head>

<Content justify='center'>
  <Hero title='Baby Sign' message='Sign, sing and play — learn baby sign language together.' />
  <nav class='mt-10'>
    <ul class='align-center grid grid-cols-1 justify-center gap-4 max-w-7xl ml-auto mr-auto md:grid-cols-3'>
      <li class='flex justify-center items-center'>
        <NavCard
          href='/words'
          label='Dictionary'
          description='See the full list of words to sign!'
          shape='square'
          size='large'
        >
          {#snippet icon()}
            <Icon>
              <MingcuteBook6Line width={64} height={64} />
            </Icon>
          {/snippet}
        </NavCard>
      </li>
      <li class='flex justify-center items-center'>
        <NavCard
          href='/phrases'
          label='Phrasebook'
          description='See some common phrases to learn and sign!'
          shape='square'
          size='large'
        >
          {#snippet icon()}
            <Icon>
              <BlockquoteFillIcon width={64} height={64} />
            </Icon>
          {/snippet}
        </NavCard>
      </li>
      <li class='flex justify-center items-center'>
        <NavCard
          href='/songs'
          label='Songbook'
          description='See some songs to sing and sign!'
          shape='square'
          size='large'
        >
          {#snippet icon()}
            <Icon>
              <MusicFillIcon width={64} height={64} />
            </Icon>
          {/snippet}
        </NavCard>
      </li>
    </ul>
  </nav>
</Content>
