import type { Actions, PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { song, word, wordsToSongs } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { fail, redirect } from '@sveltejs/kit'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireUser(locals)

  const words = await locals.db.query.word.findMany({ orderBy: [asc(word.word)] })

  return { words }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requireUser(locals)

    const data = await request.formData()
    const title = String(data.get('title') ?? '').trim()
    const lyrics = String(data.get('lyrics') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const wordIds = data.getAll('wordIds').map(String)

    if (!title || !lyrics) {
      return fail(400, {
        error: 'A title and lyrics are required.',
        title,
        lyrics,
        slug: slugInput,
        wordIds,
      })
    }

    const slug = slugInput ? slugify(slugInput) : slugify(title)
    if (!slug) {
      return fail(400, {
        error: 'Could not derive a slug from that title — set one explicitly.',
        title,
        lyrics,
        slug: slugInput,
        wordIds,
      })
    }

    let createdId: number
    try {
      const [created] = await locals.db.insert(song).values({ title, lyrics, slug }).returning()
      createdId = created.id
    }
    catch {
      return fail(400, {
        error: `The slug "${slug}" is already in use.`,
        title,
        lyrics,
        slug: slugInput,
        wordIds,
      })
    }

    if (wordIds.length > 0) {
      await locals.db
        .insert(wordsToSongs)
        .values(wordIds.map(wordId => ({ wordId, songId: String(createdId) })))
    }

    redirect(303, `/songs/${slug}`)
  },
}
