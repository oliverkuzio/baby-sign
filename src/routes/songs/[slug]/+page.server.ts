import type { PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { song } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireUser(locals)

  const { slug } = params
  const res = await locals.db.query.song.findFirst({
    where: eq(song.slug, slug),
    with: {
      words: {
        columns: {},
        with: {
          word: true,
        },
      },
    },
  })

  if (res === null) {
    throw new Error(`Song with slug "${slug}" not found`)
  }

  return {
    song: res,
  }
}
