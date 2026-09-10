<script lang='ts'>
  interface Item {
    id: number | string
    label: string
  }

  interface Props {
    /** All items available to search — matched against `label` as you type. */
    items: Item[]
    placeholder?: string
    /** Shown when the query has no matches. */
    emptyLabel?: string
    query?: string
  }

  const MAX_RESULTS = 8

  let {
    items,
    placeholder = 'Search…',
    emptyLabel = 'No matches.',
    query = $bindable(''),
  }: Props = $props()

  let open = $state(false)
  let activeIndex = $state(0)
  let container: HTMLDivElement | undefined = $state()
  let inputEl: HTMLInputElement | undefined = $state()

  const matches = $derived.by(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? items.filter(item => item.label.toLowerCase().includes(q)) : items
    return filtered.slice(0, MAX_RESULTS)
  })

  $effect(() => {
    if (activeIndex >= matches.length)
      activeIndex = 0
  })

  function selectItem(item: Item) {
    query = item.label
    open = false
    activeIndex = 0
    inputEl?.focus()
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
        selectItem(matches[activeIndex])
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

<div class='relative' bind:this={container}>
  <input
    bind:this={inputEl}
    type='text'
    role='combobox'
    aria-expanded={open}
    aria-autocomplete='list'
    aria-controls='search-autocomplete-list'
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
      id='search-autocomplete-list'
      role='listbox'
      class='menu bg-base-100 rounded-box absolute z-10 mt-1 max-h-72 w-full flex-nowrap overflow-y-auto p-2 shadow-lg'
    >
      {#each matches as item, index (item.id)}
        <li role='presentation'>
          <button
            type='button'
            role='option'
            aria-selected={index === activeIndex}
            class:active={index === activeIndex}
            onclick={() => selectItem(item)}
            onmouseenter={() => (activeIndex = index)}
          >
            {item.label}
          </button>
        </li>
      {/each}
    </ul>
  {:else if open && query.trim()}
    <div class='bg-base-100 rounded-box absolute z-10 mt-1 w-full p-3 text-sm opacity-60 shadow-lg'>
      {emptyLabel}
    </div>
  {/if}
</div>
