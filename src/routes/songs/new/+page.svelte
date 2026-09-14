<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'
  import TagPicker from '$lib/components/TagPicker.svelte'
  import WordAutocomplete from '$lib/components/WordAutocomplete.svelte'
  import { isValidYouTubeUrl } from '$lib/youtube'
  import { untrack } from 'svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  let selectedWordIds = $state(untrack(() => (form?.wordIds ?? []).map(String)))
  let selectedTagIds = $state(untrack(() => (form?.tagIds ?? []).map(String)))
  let newTagNames = $state(untrack(() => form?.newTagNames ?? []))

  function validateVideoUrl(event: Event & { currentTarget: HTMLInputElement }) {
    const value = event.currentTarget.value.trim()
    event.currentTarget.setCustomValidity(
      value && !isValidYouTubeUrl(value) ? 'Enter a valid YouTube video link.' : '',
    )
  }
</script>

<svelte:head>
  <title>Add a song • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a song</h1>

  <form method='POST' use:enhance class='ml-auto mr-auto flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Title</span>
      <input name='title' required value={form?.title ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Lyrics <span class='opacity-60'>(optional if a video URL is set)</span></span>
      <textarea name='lyrics' rows='6' class='textarea w-full'>{form?.lyrics ?? ''}</textarea>
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Video URL <span class='opacity-60'>(optional — a YouTube link)</span></span>
      <input
        name='videoUrl'
        type='url'
        value={form?.videoUrl ?? ''}
        oninput={validateVideoUrl}
        placeholder='https://www.youtube.com/watch?v=...'
        class='input w-full'
      />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Slug <span class='opacity-60'>(optional — derived from the title if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
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

    <button type='submit' class='btn btn-primary self-center'>Add song</button>
  </form>
</Content>
