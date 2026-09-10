<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'
  import TagPicker from '$lib/components/TagPicker.svelte'
  import WordAutocomplete from '$lib/components/WordAutocomplete.svelte'
  import { untrack } from 'svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  let selectedWordIds = $state(untrack(() => (form?.wordIds ?? data.selectedWordIds).map(String)))
  let selectedTagIds = $state(untrack(() => (form?.tagIds ?? data.selectedTagIds).map(String)))
  let newTagNames = $state(untrack(() => form?.newTagNames ?? []))
</script>

<svelte:head>
  <title>Edit '{data.song.title}' • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Edit song</h1>

  <form method='POST' action='?/update' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label'>Title</span>
      <input name='title' required value={form?.title ?? data.song.title} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label'>Lyrics</span>
      <textarea name='lyrics' required rows='6' class='textarea w-full'>{form?.lyrics ?? data.song.lyrics}</textarea>
    </label>

    <label class='fieldset'>
      <span class='label'>Slug</span>
      <input name='slug' required value={form?.slug ?? data.song.slug} class='input w-full' />
    </label>

    {#if data.words.length > 0}
      <WordAutocomplete
        words={data.words}
        imageUrl={data.imageUrl}
        legend='Words in this song'
        bind:selectedWordIds
      />
    {/if}

    <TagPicker tags={data.tags} legend='Tags' bind:selectedTagIds bind:newTagNames />

    <button type='submit' class='btn btn-primary self-start'>Save changes</button>
  </form>

  <form
    method='POST'
    action='?/delete'
    use:enhance
    class='mt-8'
    onsubmit={(event) => {
      // eslint-disable-next-line no-alert -- native confirm is the simplest guard against an accidental delete click
      if (!confirm(`Delete the song "${data.song.title}"? This can't be undone.`)) {
        event.preventDefault()
      }
    }}
  >
    <button type='submit' class='btn btn-error'>Delete song</button>
  </form>
</Content>
