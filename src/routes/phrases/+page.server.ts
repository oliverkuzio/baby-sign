import type { PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { phrase } from '$lib/server/db/schema'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireUser(locals)

  const res = await locals.db.query.phrase.findMany({
    orderBy: [asc(phrase.title)],
    limit: 20,
    offset: 0,
  })

  return {
    phrases: res,
  }
}
