<script lang='ts'>
  import type { PageData } from './$types.js'
  import Content from '$lib/components/Content.svelte'
  import NavCard from '$lib/components/NavCard.svelte'

  export let data: PageData

  const phrases = data.phrases
</script>

<svelte:head>
  <title>Phrases to learn and sign • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Phrases to learn and sign' />
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Phrases</h1>
  <p class='mb-3'>Here are some phrases to learn and sign:</p>

  {#if phrases && phrases.length > 0}
    <ul class='align-center grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {#each phrases as phrase (phrase.id)}
        <li class='shrink-0 grow-0 basis-full'>
          <NavCard
            href='/phrases/{phrase.slug}'
            label={phrase.title}
            description='“{phrase.phrase}”'
          />
        </li>
      {/each}
      {#if data.user}
        <li class='shrink-0 grow-0 basis-full'>
          <NavCard href='/phrases/new' label='Add phrase +' />
        </li>
      {/if}
    </ul>
  {:else}
    <p>No phrases found.</p>
  {/if}
</Content>
