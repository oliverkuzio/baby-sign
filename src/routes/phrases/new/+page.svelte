<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'
  import TagPicker from '$lib/components/TagPicker.svelte'
  import WordAutocomplete from '$lib/components/WordAutocomplete.svelte'
  import { untrack } from 'svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  let selectedWordIds = $state(untrack(() => (form?.wordIds ?? []).map(String)))
  let selectedTagIds = $state(untrack(() => (form?.tagIds ?? []).map(String)))
  let newTagNames = $state(untrack(() => form?.newTagNames ?? []))
</script>

<svelte:head>
  <title>Add a phrase • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a phrase</h1>

  <form method='POST' use:enhance class='flex max-w-md flex-col ml-auto mr-auto gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Title</span>
      <input name='title' required value={form?.title ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Phrase</span>
      <textarea name='phrase' required rows='3' class='textarea w-full'>{form?.phrase ?? ''}</textarea>
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Slug <span class='opacity-60'>(optional — derived from the title if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
    </label>

    {#if data.words.length > 0}
      <WordAutocomplete
        words={data.words}
        imageUrl={data.imageUrl}
        legend='Words in this phrase'
        bind:selectedWordIds
      />
    {/if}

    <TagPicker tags={data.tags} legend='Tags' bind:selectedTagIds bind:newTagNames />

    <button type='submit' class='btn btn-primary self-center'>Add phrase</button>
  </form>
</Content>
