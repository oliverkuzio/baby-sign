<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'
  import TagPicker from '$lib/components/TagPicker.svelte'
  import { untrack } from 'svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  let selectedTagIds = $state(untrack(() => (form?.tagIds ?? []).map(String)))
  let newTagNames = $state(untrack(() => form?.newTagNames ?? []))
</script>

<svelte:head>
  <title>Add a word • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a word</h1>

  <form method='POST' use:enhance class='flex max-w-md ml-auto mr-auto flex-col gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Word</span>
      <input name='word' required value={form?.word ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Slug <span class='opacity-60'>(optional — derived from the word if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Description</span>
      <textarea name='description' rows='4' class='textarea w-full'>{form?.description ?? ''}</textarea>
    </label>

    <TagPicker tags={data.tags} legend='Tags' bind:selectedTagIds bind:newTagNames />

    <button type='submit' class='btn btn-primary self-center'>Add word</button>
  </form>
</Content>
