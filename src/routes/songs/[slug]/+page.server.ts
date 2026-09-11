import type { Actions, PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'
import { song } from '$lib/server/db/schema'
import { isSongFavourited, toggleSongFavourite } from '$lib/server/favourites'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  const user = requireUser(locals)

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
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  })

  if (res === null) {
    throw new Error(`Song with slug "${slug}" not found`)
  }

  const favourited = await isSongFavourited(locals.db, user.id, res.id)

  return {
    song: res,
    favourited,
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
