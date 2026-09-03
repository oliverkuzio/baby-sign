<script lang='ts'>
  import type { ActionData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { form }: { form: ActionData } = $props()
</script>

<svelte:head>
  <title>Add a word • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a word</h1>

  <form method='POST' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='rounded bg-red-900/50 px-3 py-2 text-red-200'>{form.error}</p>
    {/if}

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Word</span>
      <input
        name='word'
        required
        value={form?.word ?? ''}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Slug <span class='text-gray-500'>(optional — derived from the word if left blank)</span></span>
      <input
        name='slug'
        value={form?.slug ?? ''}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    <button
      type='submit'
      class='self-start rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-700'
    >
      Add word
    </button>
  </form>
</Content>
