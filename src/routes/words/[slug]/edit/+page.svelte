<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'
  import TagPicker from '$lib/components/TagPicker.svelte'
  import { untrack } from 'svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  let selectedTagIds = $state(untrack(() => (form?.tagIds ?? data.selectedTagIds).map(String)))
  let newTagNames = $state(untrack(() => form?.newTagNames ?? []))
</script>

<svelte:head>
  <title>Edit '{data.word.word}' • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Edit word</h1>

  <form method='POST' action='?/update' use:enhance class='flex max-w-md flex-col ml-auto mr-auto gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Word</span>
      <input name='word' required value={form?.word ?? data.word.word} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Slug</span>
      <input name='slug' required value={form?.slug ?? data.word.slug} class='input w-full' />
    </label>

    <TagPicker tags={data.tags} legend='Tags' bind:selectedTagIds bind:newTagNames />

    <button type='submit' class='btn btn-primary self-center'>Save changes</button>
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
