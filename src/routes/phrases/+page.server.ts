import type { PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { phrase, tag, tagsToPhrases } from '$lib/server/db/schema'
import { resolvePagination } from '$lib/server/pagination'
import { asc, count, eq, inArray } from 'drizzle-orm'

const PAGE_SIZE = 20

export const load: PageServerLoad = async ({ locals, url }) => {
  requireUser(locals)

  const selectedTagSlugs = url.searchParams.getAll('tag')

  const tags = await locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] })

  let matchingIds: number[] | undefined
  if (selectedTagSlugs.length > 0) {
    const rows = await locals.db
      .selectDistinct({ id: tagsToPhrases.phraseId })
      .from(tagsToPhrases)
      .innerJoin(tag, eq(tag.id, tagsToPhrases.tagId))
      .where(inArray(tag.slug, selectedTagSlugs))
    matchingIds = rows.map(row => Number(row.id))
  }

  const totalItems = matchingIds
    ? matchingIds.length
    : (await locals.db.select({ value: count() }).from(phrase))[0].value

  const pagination = resolvePagination(url, totalItems, PAGE_SIZE)

  const phrases = matchingIds?.length === 0
    ? []
    : await locals.db.query.phrase.findMany({
        where: matchingIds ? inArray(phrase.id, matchingIds) : undefined,
        orderBy: [asc(phrase.title)],
        limit: pagination.pageSize,
        offset: pagination.offset,
        with: {
          tags: { with: { tag: true } },
        },
      })

  return {
    phrases,
    tags,
    selectedTagSlugs,
    pagination,
  }
}
