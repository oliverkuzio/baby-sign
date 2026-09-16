import type { Actions, PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { word } from '$lib/server/db/schema'
import { isWordFavourited, toggleWordFavourite } from '$lib/server/favourites'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  const user = requireUser(locals)

  const { slug } = params
  const res = await locals.db.query.word.findFirst({
    where: eq(word.slug, slug),
    with: {
      phrases: {
        columns: {},
        with: {
          phrase: {
            with: {
              tags: { with: { tag: true } },
              words: { with: { word: true } },
            },
          },
        },
      },
      songs: {
        columns: {},
        with: {
          song: {
            with: {
              tags: { with: { tag: true } },
              words: { with: { word: true } },
            },
          },
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
    throw new Error(`Word with slug "${slug}" not found`)
  }

  const favourited = await isWordFavourited(locals.db, user.id, res.id)

  return {
    word: res,
    favourited,
  }
}

export const actions: Actions = {
  toggleFavourite: async ({ request, locals }) => {
    const user = requireUser(locals)

    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!Number.isInteger(id)) {
      return fail(400, { error: 'Invalid word id.' })
    }

    const favourited = await toggleWordFavourite(locals.db, user.id, id)
    return { favourited }
  },
}
