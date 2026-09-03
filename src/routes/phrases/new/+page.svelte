<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  const selectedWordIds = new Set((form?.wordIds ?? []).map(String))
</script>

<svelte:head>
  <title>Add a phrase • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a phrase</h1>

  <form method='POST' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='rounded bg-red-900/50 px-3 py-2 text-red-200'>{form.error}</p>
    {/if}

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Title</span>
      <input
        name='title'
        required
        value={form?.title ?? ''}
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
      >{form?.phrase ?? ''}</textarea>
    </label>

    <label class='flex flex-col gap-1'>
      <span class='text-sm text-gray-300'>Slug <span class='text-gray-500'>(optional — derived from the title if left blank)</span></span>
      <input
        name='slug'
        value={form?.slug ?? ''}
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
      Add phrase
    </button>
  </form>
</Content>
