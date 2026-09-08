import type { PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { song } from '$lib/server/db/schema'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireUser(locals)

  const res = await locals.db.query.song.findMany({
    orderBy: [asc(song.title)],
    limit: 20,
    offset: 0,
  })

  return {
    songs: res,
  }
}
