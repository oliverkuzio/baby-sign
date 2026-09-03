import type { Actions, PageServerLoad } from './$types'
import { requireUser } from '$lib/server/auth'
import { word } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { error, fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireUser(locals)

  const res = await locals.db.query.word.findFirst({
    where: eq(word.slug, params.slug),
    with: {
      phrases: true,
      songs: true,
    },
  })

  if (!res) {
    error(404, `Word "${params.slug}" not found.`)
  }

  return { word: res }
}

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    requireUser(locals)

    const data = await request.formData()
    const wordText = String(data.get('word') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const slug = slugify(slugInput)

    if (!wordText || !slug) {
      return fail(400, { error: 'A word and slug are required.', word: wordText, slug: slugInput })
    }

    try {
      const [updated] = await locals.db
        .update(word)
        .set({ word: wordText, slug })
        .where(eq(word.slug, params.slug))
        .returning()

      if (!updated) {
        error(404, `Word "${params.slug}" not found.`)
      }
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.`, word: wordText, slug: slugInput })
    }

    redirect(303, `/dictionary/${slug}`)
  },

  delete: async ({ locals, params }) => {
    requireUser(locals)

    const existing = await locals.db.query.word.findFirst({
      where: eq(word.slug, params.slug),
      with: {
        phrases: true,
        songs: true,
      },
    })

    if (!existing) {
      error(404, `Word "${params.slug}" not found.`)
    }

    if (existing.phrases.length > 0 || existing.songs.length > 0) {
      return fail(400, {
        error: 'This word is still used in a phrase or song — remove those associations first.',
      })
    }

    await locals.db.delete(word).where(eq(word.slug, params.slug))

    redirect(303, '/dictionary')
  },
}
