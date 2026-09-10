<script lang='ts'>
  import type { Word } from '../server/db/schema'

  interface Props {
    /** All words available to choose from. */
    words: Word[]
    imageUrl: string
    /** IDs (as strings, to match the `words_to_*` join tables) of the currently assigned words. */
    selectedWordIds?: string[]
    /** Form field name each selected word is submitted under. */
    name?: string
    legend?: string
    placeholder?: string
    /**
     * When true (the default), picking a word adds it to `selectedWordIds`, shows it as a
     * removable pill, and submits it via a hidden input. When false, the component is a plain
     * search box — picking a word (or just typing) only updates `query`, which the caller can
     * bind to and use to filter its own list. No pills, no hidden inputs, no form submission.
     */
    selectable?: boolean
    query?: string
  }

  const MAX_RESULTS = 8

  let {
    words,
    imageUrl,
    selectedWordIds = $bindable([]),
    name = 'wordIds',
    legend,
    placeholder = 'Search for a word…',
    selectable = true,
    query = $bindable(''),
  }: Props = $props()

  let open = $state(false)
  let activeIndex = $state(0)
  let container: HTMLDivElement | undefined = $state()
  let inputEl: HTMLInputElement | undefined = $state()

  const selectedWords = $derived(
    selectedWordIds
      .map(id => words.find(w => String(w.id) === id))
      .filter((w): w is Word => !!w),
  )

  const matches = $derived.by(() => {
    const available = selectable
      ? words.filter(w => !selectedWordIds.includes(String(w.id)))
      : words
    const q = query.trim().toLowerCase()
    const filtered = q ? available.filter(w => w.word.toLowerCase().includes(q)) : available
    return filtered.slice(0, MAX_RESULTS)
  })

  $effect(() => {
    if (activeIndex >= matches.length)
      activeIndex = 0
  })

  function previewUrl(word: Word) {
    return `${imageUrl}/${word.slug}-preview-webp.webp`
  }

  function addWord(word: Word) {
    if (selectable) {
      selectedWordIds = [...selectedWordIds, String(word.id)]
      query = ''
    }
    else {
      query = word.word
      open = false
    }
    activeIndex = 0
    inputEl?.focus()
  }

  function removeWord(id: string) {
    selectedWordIds = selectedWordIds.filter(wordId => wordId !== id)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      open = true
      if (matches.length > 0)
        activeIndex = (activeIndex + 1) % matches.length
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (matches.length > 0)
        activeIndex = (activeIndex - 1 + matches.length) % matches.length
    }
    else if (event.key === 'Enter') {
      if (open && matches[activeIndex]) {
        event.preventDefault()
        addWord(matches[activeIndex])
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
      aria-controls='word-autocomplete-list'
      autocomplete='off'
      class='input w-full'
      {placeholder}
      bind:value={query}
      onfocus={() => (open = true)}
      oninput={() => (open = true)}
      onkeydown={handleKeydown}
    />

    {#if open && matches.length > 0}
      <ul
        id='word-autocomplete-list'
        role='listbox'
        class='menu bg-base-100 rounded-box absolute z-10 mt-1 max-h-72 w-full flex-nowrap overflow-y-auto p-2 shadow-lg'
      >
        {#each matches as word, index (word.id)}
          <li role='presentation'>
            <button
              type='button'
              role='option'
              aria-selected={index === activeIndex}
              class='flex items-center gap-2'
              class:active={index === activeIndex}
              onclick={() => addWord(word)}
              onmouseenter={() => (activeIndex = index)}
            >
              <img src={previewUrl(word)} alt='' class='size-8 shrink-0 rounded object-cover' />
              <span>{word.word}</span>
            </button>
          </li>
        {/each}
      </ul>
    {:else if open && query.trim()}
      <div class='bg-base-100 rounded-box absolute z-10 mt-1 w-full p-3 text-sm opacity-60 shadow-lg'>
        No matching words.
      </div>
    {/if}
  </div>

  {#if selectable}
    {#if selectedWords.length > 0}
      <div class='mt-2 flex flex-wrap gap-2'>
        {#each selectedWords as word (word.id)}
          <span class='badge badge-lg gap-2 py-4 pl-1'>
            <img src={previewUrl(word)} alt='' class='size-6 shrink-0 rounded-full object-cover' />
            {word.word}
            <button
              type='button'
              class='btn btn-ghost btn-xs btn-circle'
              onclick={() => removeWord(String(word.id))}
              aria-label={`Remove ${word.word}`}
            >
              ✕
            </button>
          </span>
        {/each}
      </div>
    {/if}

    {#each selectedWordIds as id (id)}
      <input type='hidden' {name} value={id} />
    {/each}
  {/if}
</fieldset>
