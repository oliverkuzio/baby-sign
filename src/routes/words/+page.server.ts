import type { Actions, PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { tag, tagsToWords, word } from '$lib/server/db/schema'
import { getFavouritedWordIds, toggleWordFavourite } from '$lib/server/favourites'
import { resolvePagination } from '$lib/server/pagination'
import { fail } from '@sveltejs/kit'
import { asc, count, eq, inArray } from 'drizzle-orm'

const PAGE_SIZE = 80

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = requireUser(locals)

  const selectedTagSlugs = url.searchParams.getAll('tag')
  const favouritesOnly = url.searchParams.get('favourite') === '1'

  const tags = await locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] })
  const favouritedWordIds = await getFavouritedWordIds(locals.db, user.id)

  let matchingIds: number[] | undefined
  if (selectedTagSlugs.length > 0) {
    const rows = await locals.db
      .selectDistinct({ id: tagsToWords.wordId })
      .from(tagsToWords)
      .innerJoin(tag, eq(tag.id, tagsToWords.tagId))
      .where(inArray(tag.slug, selectedTagSlugs))
    matchingIds = rows.map(row => Number(row.id))
  }

  if (favouritesOnly) {
    matchingIds = matchingIds
      ? matchingIds.filter(id => favouritedWordIds.has(id))
      : [...favouritedWordIds]
  }

  const totalItems = matchingIds
    ? matchingIds.length
    : (await locals.db.select({ value: count() }).from(word))[0].value

  const pagination = resolvePagination(url, totalItems, PAGE_SIZE)

  const words = matchingIds?.length === 0
    ? []
    : await locals.db.query.word.findMany({
        where: matchingIds ? inArray(word.id, matchingIds) : undefined,
        orderBy: [asc(word.id)],
        limit: pagination.pageSize,
        offset: pagination.offset,
        with: {
          tags: { with: { tag: true } },
        },
      })

  return {
    words,
    tags,
    selectedTagSlugs,
    favouritesOnly,
    favouritedWordIds,
    pagination,
  }
}

export const actions: Actions = {
  toggleFavourite: async ({ request, locals }) => {
    const user = requireUser(locals)

    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!Number.isInteger(id)) {
      return fail(400, { error: 'Invalid word id.' })
    }

    const favourited = await toggleWordFavourite(locals.db, user.id, id)
    return { favourited }
  },
}
