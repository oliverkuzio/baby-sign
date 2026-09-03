<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()
</script>

<svelte:head>
  <title>Edit '{data.word.word}' • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Edit word</h1>

  <form method='POST' action='?/update' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='rounded bg-red-900/50 px-3 py-2 text-red-200'>{form.error}</p>
    {/if}

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Word</span>
      <input
        name='word'
        required
        value={form?.word ?? data.word.word}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Slug</span>
      <input
        name='slug'
        required
        value={form?.slug ?? data.word.slug}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    <button
      type='submit'
      class='self-start rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-700'
    >
      Save changes
    </button>
  </form>

  <form
    method='POST'
    action='?/delete'
    use:enhance
    class='mt-8'
    onsubmit={(event) => {
      // eslint-disable-next-line no-alert -- native confirm is the simplest guard against an accidental delete click
      if (!confirm(`Delete the word "${data.word.word}"? This can't be undone.`)) {
        event.preventDefault()
      }
    }}
  >
    <button type='submit' class='rounded bg-red-900 px-4 py-2 font-semibold text-red-100 hover:bg-red-800'>
      Delete word
    </button>
  </form>
</Content>
