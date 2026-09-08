import type { PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { word } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireUser(locals)

  const { slug } = params
  const res = await locals.db.query.word.findFirst({
    where: eq(word.slug, slug),
    with: {
      phrases: {
        columns: {},
        with: {
          phrase: true,
        },
      },
      songs: {
        columns: {},
        with: {
          song: true,
        },
      },
    },
  })

  if (res === null) {
    throw new Error(`Word with slug "${slug}" not found`)
  }

  return {
    word: res,
  }
}
