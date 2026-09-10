import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { phrase, tag, tagsToPhrases, word, wordsToPhrases } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { resolveTagIds } from '$lib/server/tags'
import { error, fail, redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireAdmin(locals)

  const [existing, words, tags] = await Promise.all([
    locals.db.query.phrase.findFirst({
      where: eq(phrase.slug, params.slug),
      with: {
        words: { columns: { wordId: true } },
        tags: { columns: { tagId: true } },
      },
    }),
    locals.db.query.word.findMany({ orderBy: [asc(word.word)] }),
    locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] }),
  ])

  if (!existing) {
    error(404, `Phrase "${params.slug}" not found.`)
  }

  return {
    phrase: existing,
    words,
    tags,
    selectedWordIds: existing.words.map(w => w.wordId),
    selectedTagIds: existing.tags.map(t => t.tagId),
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
    const tagIds = data.getAll('tagIds').map(String)
    const newTagNames = data.getAll('newTagNames').map(String)
    const slug = slugify(slugInput)

    if (!title || !phraseText || !slug) {
      return fail(400, {
        error: 'A title, phrase, and slug are required.',
        title,
        phrase: phraseText,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
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
        tagIds,
        newTagNames,
      })
    }

    await locals.db.delete(wordsToPhrases).where(eq(wordsToPhrases.phraseId, String(phraseId)))
    if (wordIds.length > 0) {
      await locals.db
        .insert(wordsToPhrases)
        .values(wordIds.map(wordId => ({ wordId, phraseId: String(phraseId) })))
    }

    const resolvedTagIds = await resolveTagIds(locals.db, tagIds, newTagNames)
    await locals.db.delete(tagsToPhrases).where(eq(tagsToPhrases.phraseId, String(phraseId)))
    if (resolvedTagIds.length > 0) {
      await locals.db
        .insert(tagsToPhrases)
        .values(resolvedTagIds.map(tagId => ({ tagId, phraseId: String(phraseId) })))
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
    await locals.db.delete(tagsToPhrases).where(eq(tagsToPhrases.phraseId, String(existing.id)))
    await locals.db.delete(phrase).where(eq(phrase.slug, params.slug))

    redirect(303, '/phrases')
  },
}
