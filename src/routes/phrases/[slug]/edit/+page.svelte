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
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label'>Title</span>
      <input name='title' required value={form?.title ?? data.phrase.title} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label'>Phrase</span>
      <textarea name='phrase' required rows='3' class='textarea w-full'>{form?.phrase ?? data.phrase.phrase}</textarea>
    </label>

    <label class='fieldset'>
      <span class='label'>Slug</span>
      <input name='slug' required value={form?.slug ?? data.phrase.slug} class='input w-full' />
    </label>

    {#if data.words.length > 0}
      <fieldset class='fieldset'>
        <legend class='fieldset-legend'>Words in this phrase</legend>
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

    <button type='submit' class='btn btn-primary self-start'>Save changes</button>
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
    <button type='submit' class='btn btn-error'>Delete phrase</button>
  </form>
</Content>
