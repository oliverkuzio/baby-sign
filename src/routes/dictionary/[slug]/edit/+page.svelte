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
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label'>Word</span>
      <input name='word' required value={form?.word ?? data.word.word} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label'>Slug</span>
      <input name='slug' required value={form?.slug ?? data.word.slug} class='input w-full' />
    </label>

    <button type='submit' class='btn btn-primary self-start'>Save changes</button>
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
    <button type='submit' class='btn btn-error'>Delete word</button>
  </form>
</Content>
