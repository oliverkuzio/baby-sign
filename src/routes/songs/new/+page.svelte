<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  const selectedWordIds = new Set((form?.wordIds ?? []).map(String))
</script>

<svelte:head>
  <title>Add a song • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a song</h1>

  <form method='POST' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label'>Title</span>
      <input name='title' required value={form?.title ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label'>Lyrics</span>
      <textarea name='lyrics' required rows='6' class='textarea w-full'>{form?.lyrics ?? ''}</textarea>
    </label>

    <label class='fieldset'>
      <span class='label'>Slug <span class='opacity-60'>(optional — derived from the title if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
    </label>

    {#if data.words.length > 0}
      <fieldset class='fieldset'>
        <legend class='fieldset-legend'>Words in this song</legend>
        <div class='bg-base-200 grid max-h-48 grid-cols-2 gap-1 overflow-y-auto rounded-box p-2'>
          {#each data.words as w (w.id)}
            <label class='label gap-2'>
              <input
                type='checkbox'
                name='wordIds'
                value={w.id}
                checked={selectedWordIds.has(String(w.id))}
                class='checkbox checkbox-sm'
              />
              {w.word}
            </label>
          {/each}
        </div>
      </fieldset>
    {/if}

    <button type='submit' class='btn btn-primary self-start'>Add song</button>
  </form>
</Content>
