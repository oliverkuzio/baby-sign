<script lang='ts'>
  import type { Tag } from '../server/db/schema'

  interface Props {
    /** All existing tags available to choose from. */
    tags: Tag[]
    /** IDs (as strings, to match the `tags_to_*` join tables) of the currently assigned tags. */
    selectedTagIds?: string[]
    /** Names of tags typed that don't exist yet — created on submit. */
    newTagNames?: string[]
    legend?: string
    placeholder?: string
  }

  const MAX_RESULTS = 8

  let {
    tags,
    selectedTagIds = $bindable([]),
    newTagNames = $bindable([]),
    legend,
    placeholder = 'Search or create a tag…',
  }: Props = $props()

  let query = $state('')
  let open = $state(false)
  let activeIndex = $state(0)
  let container: HTMLDivElement | undefined = $state()
  let inputEl: HTMLInputElement | undefined = $state()

  const selectedTags = $derived(
    selectedTagIds
      .map(id => tags.find(t => String(t.id) === id))
      .filter((t): t is Tag => !!t),
  )

  const normalizedQuery = $derived(query.trim().toLowerCase())

  const matches = $derived.by(() => {
    const available = tags.filter(t => !selectedTagIds.includes(String(t.id)))
    const filtered = normalizedQuery
      ? available.filter(t => t.name.toLowerCase().includes(normalizedQuery))
      : available
    return filtered.slice(0, MAX_RESULTS)
  })

  // Whether the typed text is a genuinely new tag name (not an existing tag,
  // and not already picked or pending as a new tag).
  const canCreate = $derived.by(() => {
    if (!normalizedQuery)
      return false
    if (tags.some(t => t.name.toLowerCase() === normalizedQuery))
      return false
    if (newTagNames.some(name => name.toLowerCase() === normalizedQuery))
      return false
    return true
  })

  // Options are the matched existing tags, plus a trailing "create" option.
  const optionCount = $derived(matches.length + (canCreate ? 1 : 0))

  $effect(() => {
    if (activeIndex >= optionCount)
      activeIndex = 0
  })

  function addTag(tag: Tag) {
    selectedTagIds = [...selectedTagIds, String(tag.id)]
    query = ''
    activeIndex = 0
    inputEl?.focus()
  }

  function createTag(name: string) {
    const trimmed = name.trim()
    if (!trimmed)
      return
    newTagNames = [...newTagNames, trimmed]
    query = ''
    activeIndex = 0
    inputEl?.focus()
  }

  function removeTag(id: string) {
    selectedTagIds = selectedTagIds.filter(tagId => tagId !== id)
  }

  function removeNewTag(name: string) {
    newTagNames = newTagNames.filter(n => n !== name)
  }

  function selectOption(index: number) {
    if (index < matches.length)
      addTag(matches[index])
    else if (canCreate)
      createTag(query)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      open = true
      if (optionCount > 0)
        activeIndex = (activeIndex + 1) % optionCount
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (optionCount > 0)
        activeIndex = (activeIndex - 1 + optionCount) % optionCount
    }
    else if (event.key === 'Enter') {
      if (open && optionCount > 0) {
        event.preventDefault()
        selectOption(activeIndex)
      }
    }
    else if (event.key === 'Escape') {
      open = false
    }
  }

  function handleWindowClick(event: MouseEvent) {
    if (open && container && event.target instanceof Node && !container.contains(event.target))
      open = false
  }
</script>

<svelte:window onclick={handleWindowClick} />

<fieldset class='fieldset'>
  {#if legend}
    <legend class='fieldset-legend'>{legend}</legend>
  {/if}

  <div class='relative' bind:this={container}>
    <input
      bind:this={inputEl}
      type='text'
      role='combobox'
      aria-expanded={open}
      aria-autocomplete='list'
      aria-controls='tag-picker-list'
      autocomplete='off'
      class='input w-full'
      {placeholder}
      bind:value={query}
      onfocus={() => (open = true)}
      oninput={() => (open = true)}
      onkeydown={handleKeydown}
    />

    {#if open && optionCount > 0}
      <ul
        id='tag-picker-list'
        role='listbox'
        class='menu bg-base-100 rounded-box absolute z-10 mt-1 max-h-72 w-full flex-nowrap overflow-y-auto p-2 shadow-lg'
      >
        {#each matches as tag, index (tag.id)}
          <li role='presentation'>
            <button
              type='button'
              role='option'
              aria-selected={index === activeIndex}
              class:active={index === activeIndex}
              onclick={() => addTag(tag)}
              onmouseenter={() => (activeIndex = index)}
            >
              {tag.name}
            </button>
          </li>
        {/each}
        {#if canCreate}
          <li role='presentation'>
            <button
              type='button'
              role='option'
              aria-selected={matches.length === activeIndex}
              class:active={matches.length === activeIndex}
              onclick={() => createTag(query)}
              onmouseenter={() => (activeIndex = matches.length)}
            >
              Create tag "{query.trim()}"
            </button>
          </li>
        {/if}
      </ul>
    {:else if open && query.trim()}
      <div class='bg-base-100 rounded-box absolute z-10 mt-1 w-full p-3 text-sm opacity-60 shadow-lg'>
        No matching tags.
      </div>
    {/if}
  </div>

  {#if selectedTags.length > 0 || newTagNames.length > 0}
    <div class='mt-2 flex flex-wrap gap-2'>
      {#each selectedTags as tag (tag.id)}
        <span class='badge badge-lg gap-2'>
          {tag.name}
          <button
            type='button'
            class='btn btn-ghost btn-xs btn-circle'
            onclick={() => removeTag(String(tag.id))}
            aria-label={`Remove ${tag.name}`}
          >
            ✕
          </button>
        </span>
      {/each}
      {#each newTagNames as name (name)}
        <span class='badge badge-lg badge-outline gap-2'>
          {name}
          <span class='opacity-60'>(new)</span>
          <button
            type='button'
            class='btn btn-ghost btn-xs btn-circle'
            onclick={() => removeNewTag(name)}
            aria-label={`Remove ${name}`}
          >
            ✕
          </button>
        </span>
      {/each}
    </div>
  {/if}

  {#each selectedTagIds as id (id)}
    <input type='hidden' name='tagIds' value={id} />
  {/each}
  {#each newTagNames as name (name)}
    <input type='hidden' name='newTagNames' value={name} />
  {/each}
</fieldset>
