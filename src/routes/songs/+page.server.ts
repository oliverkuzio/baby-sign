import type { Actions, PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { song, tag, tagsToSongs } from '$lib/server/db/schema'
import { getFavouritedSongIds, toggleSongFavourite } from '$lib/server/favourites'
import { resolvePagination } from '$lib/server/pagination'
import { fail } from '@sveltejs/kit'
import { asc, count, eq, inArray } from 'drizzle-orm'

const PAGE_SIZE = 20

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = requireUser(locals)

  const selectedTagSlugs = url.searchParams.getAll('tag')
  const favouritesOnly = url.searchParams.get('favourite') === '1'

  const tags = await locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] })
  const favouritedSongIds = await getFavouritedSongIds(locals.db, user.id)

  let matchingIds: number[] | undefined
  if (selectedTagSlugs.length > 0) {
    const rows = await locals.db
      .selectDistinct({ id: tagsToSongs.songId })
      .from(tagsToSongs)
      .innerJoin(tag, eq(tag.id, tagsToSongs.tagId))
      .where(inArray(tag.slug, selectedTagSlugs))
    matchingIds = rows.map(row => Number(row.id))
  }

  if (favouritesOnly) {
    matchingIds = matchingIds
      ? matchingIds.filter(id => favouritedSongIds.has(id))
      : [...favouritedSongIds]
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
          words: { with: { word: true } },
        },
      })

  return {
    songs,
    tags,
    selectedTagSlugs,
    favouritesOnly,
    favouritedSongIds,
    pagination,
  }
}

export const actions: Actions = {
  toggleFavourite: async ({ request, locals }) => {
    const user = requireUser(locals)

    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!Number.isInteger(id)) {
      return fail(400, { error: 'Invalid song id.' })
    }

    const favourited = await toggleSongFavourite(locals.db, user.id, id)
    return { favourited }
  },
}
