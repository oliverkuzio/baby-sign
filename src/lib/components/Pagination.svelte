<script lang='ts'>
  interface Props {
    page: number
    totalPages: number
    /** Extra query params (e.g. active tag filters) to preserve across page links. */
    extraParams?: [string, string][]
  }

  const { page, totalPages, extraParams = [] }: Props = $props()

  function hrefFor(targetPage: number) {
    const parts = extraParams.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    if (targetPage > 1)
      parts.push(`page=${targetPage}`)
    return parts.length > 0 ? `?${parts.join('&')}` : '?'
  }

  const atStart = $derived(page <= 1)
  const atEnd = $derived(page >= totalPages)
</script>

{#if totalPages > 1}
  <div class='join my-4' role='navigation' aria-label='Pagination'>
    <a
      href={hrefFor(1)}
      class='btn join-item'
      class:btn-disabled={atStart}
      aria-disabled={atStart}
      aria-label='First page'
    >
      « Start
    </a>
    <a
      href={hrefFor(page - 1)}
      class='btn join-item'
      class:btn-disabled={atStart}
      aria-disabled={atStart}
      aria-label='Previous page'
    >
      ‹ Prev
    </a>
    <span class='btn join-item btn-disabled'>Page {page} of {totalPages}</span>
    <a
      href={hrefFor(page + 1)}
      class='btn join-item'
      class:btn-disabled={atEnd}
      aria-disabled={atEnd}
      aria-label='Next page'
    >
      Next ›
    </a>
    <a
      href={hrefFor(totalPages)}
      class='btn join-item'
      class:btn-disabled={atEnd}
      aria-disabled={atEnd}
      aria-label='Last page'
    >
      End »
    </a>
  </div>
{/if}
