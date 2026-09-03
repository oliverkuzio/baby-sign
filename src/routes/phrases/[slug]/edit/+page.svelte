<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  const selectedWordIds = new Set((form?.wordIds ?? data.selectedWordIds).map(String))
</script>

<svelte:head>
  <title>Edit '{data.phrase.title}' • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Edit phrase</h1>

  <form method='POST' action='?/update' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='rounded bg-red-900/50 px-3 py-2 text-red-200'>{form.error}</p>
    {/if}

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Title</span>
      <input
        name='title'
        required
        value={form?.title ?? data.phrase.title}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Phrase</span>
      <textarea
        name='phrase'
        required
        rows='3'
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      >{form?.phrase ?? data.phrase.phrase}</textarea>
    </label>

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Slug</span>
      <input
        name='slug'
        required
        value={form?.slug ?? data.phrase.slug}
        class='rounded bg-white/10 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none'
      />
    </label>

    {#if data.words.length > 0}
      <fieldset class='flex flex-col gap-1'>
        <legend class='mb-1 text-sm text-gray-300'>Words in this phrase</legend>
        <div class='grid max-h-48 grid-cols-2 gap-1 overflow-y-auto rounded bg-white/5 p-2'>
          {#each data.words as w (w.id)}
            <label class='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                name='wordIds'
                value={w.id}
                checked={selectedWordIds.has(String(w.id))}
              />
              {w.word}
            </label>
          {/each}
        </div>
      </fieldset>
    {/if}

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
      if (!confirm(`Delete the phrase "${data.phrase.title}"? This can't be undone.`)) {
        event.preventDefault()
      }
    }}
  >
    <button type='submit' class='rounded bg-red-900 px-4 py-2 font-semibold text-red-100 hover:bg-red-800'>
      Delete phrase
    </button>
  </form>
</Content>
