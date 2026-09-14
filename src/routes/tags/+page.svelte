<script lang='ts'>
  import type { ActionData, PageData } from './$types'
  import { enhance } from '$app/forms'
  import Content from '$lib/components/Content.svelte'

  const { data, form }: { data: PageData, form: ActionData } = $props()

  function usageFor(tag: PageData['tags'][number]) {
    const count = tag.words.length + tag.phrases.length + tag.songs.length
    return count === 0 ? 'Not used yet' : `Used ${count} time${count === 1 ? '' : 's'}`
  }
</script>

<svelte:head>
  <title>Manage tags • Baby Sign • Kuzio Apps</title>
</svelte:head>

<Content>
  <h1 class='mb-3 text-2xl leading-none font-extrabold'>Tags</h1>
  <p class='mb-6'>Create, rename, and remove the tags that can be applied to words, phrases, and songs.</p>

  <form method='POST' action='?/create' use:enhance class='mb-8 flex max-w-md flex-col ml-auto mr-auto gap-4'>
    <h2 class='text-lg font-semibold'>Add a tag</h2>

    {#if form?.error}
      <p class='alert alert-error'>{form.error}</p>
    {/if}

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Name</span>
      <input name='name' required value={form?.name ?? ''} class='input w-full' />
    </label>

    <label class='fieldset'>
      <span class='label font-semibold text-base-content'>Slug <span class='opacity-60'>(optional — derived from the name if left blank)</span></span>
      <input name='slug' value={form?.slug ?? ''} class='input w-full' />
    </label>

    <button type='submit' class='btn btn-primary self-center'>Add tag</button>
  </form>

  <h2 class='mb-3 text-lg font-semibold'>All tags</h2>

  {#if data.tags.length === 0}
    <p>No tags yet.</p>
  {:else}
    <ul class='flex max-w-4xl flex-col ml-auto mr-auto gap-3'>
      {#each data.tags as tag (tag.id)}
        <li class='flex card bg-base-200 border-4 border-base-300'>
          <div class='card-body flex-row flex-wrap items-end p-4'>
            <form method='POST' action='?/update' use:enhance class='flex flex-row flex-wrap items-end grow gap-3 p-4'>
              <input type='hidden' name='id' value={tag.id} />

              <label class='fieldset grow'>
                <span class='label font-semibold text-base-content'>Name</span>
                <input name='name' required value={tag.name} class='input input-sm w-full' />
              </label>

              <label class='fieldset grow'>
                <span class='label font-semibold text-base-content'>Slug</span>
                <input name='slug' required value={tag.slug} class='input input-sm w-full' />
              </label>

              <span class='mb-2 text-sm opacity-60'>{usageFor(tag)}</span>

              <button type='submit' class='btn btn-sm btn-primary'>Save</button>
            </form>

            <form
              method='POST'
              action='?/delete'
              use:enhance
              class='p-4'
              onsubmit={(event) => {
                // eslint-disable-next-line no-alert -- native confirm is the simplest guard against an accidental delete click
                if (!confirm(`Delete the tag "${tag.name}"? This can't be undone.`)) {
                  event.preventDefault()
                }
              }}
            >
              <input type='hidden' name='id' value={tag.id} />
              <button type='submit' class='btn btn-sm btn-error'>
                Delete
              </button>
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</Content>
