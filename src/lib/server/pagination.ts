export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  offset: number
}

/**
 * Reads `?page=` off the URL and clamps it against the item count, returning
 * everything a listing `load` needs to fetch one page and everything a
 * `<Pagination>` control needs to render.
 */
export function resolvePagination(url: URL, totalItems: number, pageSize: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const requested = Number.parseInt(url.searchParams.get('page') ?? '1', 10)
  const page = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), totalPages) : 1

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    offset: (page - 1) * pageSize,
  }
}
