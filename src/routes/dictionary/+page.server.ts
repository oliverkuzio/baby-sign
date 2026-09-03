import type { PageServerLoad } from './$types'
import { word } from '$lib/server/db/schema'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  const res = await locals.db.query.word.findMany({
    orderBy: [asc(word.id)],
    limit: -1,
    offset: 0,
  })

  return {
    words: res,
  }
}
