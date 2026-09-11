import type { Actions, PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { phrase } from '$lib/server/db/schema'
import { isPhraseFavourited, togglePhraseFavourite } from '$lib/server/favourites'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  const user = requireUser(locals)

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
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  })

  if (res === null) {
    throw new Error(`Phrase with slug "${slug}" not found`)
  }

  const favourited = await isPhraseFavourited(locals.db, user.id, res.id)

  return {
    phrase: res,
    favourited,
  }
}

export const actions: Actions = {
  toggleFavourite: async ({ request, locals }) => {
    const user = requireUser(locals)

    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!Number.isInteger(id)) {
      return fail(400, { error: 'Invalid phrase id.' })
    }

    const favourited = await togglePhraseFavourite(locals.db, user.id, id)
    return { favourited }
  },
}
