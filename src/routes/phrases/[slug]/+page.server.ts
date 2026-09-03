import type { PageServerLoad } from './$types.js'
import { phrase } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  const { slug } = params
  const res = await locals.db.query.phrase.findFirst({
    where: eq(phrase.slug, slug),
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
    throw new Error(`Phrase with slug "${slug}" not found`)
  }

  return {
    phrase: res,
  }
}
