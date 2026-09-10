import type { PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { song, tag, tagsToSongs } from '$lib/server/db/schema'
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
      .selectDistinct({ id: tagsToSongs.songId })
      .from(tagsToSongs)
      .innerJoin(tag, eq(tag.id, tagsToSongs.tagId))
      .where(inArray(tag.slug, selectedTagSlugs))
    matchingIds = rows.map(row => Number(row.id))
  }

  const totalItems = matchingIds
    ? matchingIds.length
    : (await locals.db.select({ value: count() }).from(song))[0].value

  const pagination = resolvePagination(url, totalItems, PAGE_SIZE)

  const songs = matchingIds?.length === 0
    ? []
    : await locals.db.query.song.findMany({
        where: matchingIds ? inArray(song.id, matchingIds) : undefined,
        orderBy: [asc(song.title)],
        limit: pagination.pageSize,
        offset: pagination.offset,
        with: {
          tags: { with: { tag: true } },
        },
      })

  return {
    songs,
    tags,
    selectedTagSlugs,
    pagination,
  }
}
