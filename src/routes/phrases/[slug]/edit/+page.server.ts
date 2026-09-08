import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { phrase, word, wordsToPhrases } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { error, fail, redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireAdmin(locals)

  const [existing, words] = await Promise.all([
    locals.db.query.phrase.findFirst({
      where: eq(phrase.slug, params.slug),
      with: {
        words: { columns: { wordId: true } },
      },
    }),
    locals.db.query.word.findMany({ orderBy: [asc(word.word)] }),
  ])

  if (!existing) {
    error(404, `Phrase "${params.slug}" not found.`)
  }

  return {
    phrase: existing,
    words,
    selectedWordIds: existing.words.map(w => w.wordId),
  }
}

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const title = String(data.get('title') ?? '').trim()
    const phraseText = String(data.get('phrase') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const wordIds = data.getAll('wordIds').map(String)
    const slug = slugify(slugInput)

    if (!title || !phraseText || !slug) {
      return fail(400, {
        error: 'A title, phrase, and slug are required.',
        title,
        phrase: phraseText,
        slug: slugInput,
        wordIds,
      })
    }

    let phraseId: number
    try {
      const [updated] = await locals.db
        .update(phrase)
        .set({ title, phrase: phraseText, slug })
        .where(eq(phrase.slug, params.slug))
        .returning()

      if (!updated) {
        error(404, `Phrase "${params.slug}" not found.`)
      }
      phraseId = updated.id
    }
    catch {
      return fail(400, {
        error: `The slug "${slug}" is already in use.`,
        title,
        phrase: phraseText,
        slug: slugInput,
        wordIds,
      })
    }

    await locals.db.delete(wordsToPhrases).where(eq(wordsToPhrases.phraseId, String(phraseId)))
    if (wordIds.length > 0) {
      await locals.db
        .insert(wordsToPhrases)
        .values(wordIds.map(wordId => ({ wordId, phraseId: String(phraseId) })))
    }

    redirect(303, `/phrases/${slug}`)
  },

  delete: async ({ locals, params }) => {
    requireAdmin(locals)

    const existing = await locals.db.query.phrase.findFirst({ where: eq(phrase.slug, params.slug) })
    if (!existing) {
      error(404, `Phrase "${params.slug}" not found.`)
    }

    await locals.db.delete(wordsToPhrases).where(eq(wordsToPhrases.phraseId, String(existing.id)))
    await locals.db.delete(phrase).where(eq(phrase.slug, params.slug))

    redirect(303, '/phrases')
  },
}
