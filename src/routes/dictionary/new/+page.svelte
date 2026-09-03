<script lang='ts'>
  import type { ActionData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { form }: { form: ActionData } = $props()
</script>

<svelte:head>
  <title>Add a word • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Add a word</h1>

  <form method='POST' use:enhance class='flex max-w-md flex-col gap-4'>
    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label'>Word</span>
      <input name='word' required value={form?.word ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label'>Slug <span class='opacity-60'>(optional — derived from the word if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
    </label>

    <button type='submit' class='btn btn-primary self-start'>Add word</button>
  </form>
</Content>
