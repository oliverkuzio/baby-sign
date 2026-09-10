import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { tag, tagsToWords, word } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { resolveTagIds } from '$lib/server/tags'
import { error, fail, redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireAdmin(locals)

  const [res, tags] = await Promise.all([
    locals.db.query.word.findFirst({
      where: eq(word.slug, params.slug),
      with: {
        phrases: true,
        songs: true,
        tags: { columns: { tagId: true } },
      },
    }),
    locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] }),
  ])

  if (!res) {
    error(404, `Word "${params.slug}" not found.`)
  }

  return {
    word: res,
    tags,
    selectedTagIds: res.tags.map(t => t.tagId),
  }
}

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const wordText = String(data.get('word') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const slug = slugify(slugInput)
    const tagIds = data.getAll('tagIds').map(String)
    const newTagNames = data.getAll('newTagNames').map(String)

    if (!wordText || !slug) {
      return fail(400, { error: 'A word and slug are required.', word: wordText, slug: slugInput, tagIds, newTagNames })
    }

    let updatedId: number
    try {
      const [updated] = await locals.db
        .update(word)
        .set({ word: wordText, slug })
        .where(eq(word.slug, params.slug))
        .returning()

      if (!updated) {
        error(404, `Word "${params.slug}" not found.`)
      }
      updatedId = updated.id
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.`, word: wordText, slug: slugInput, tagIds, newTagNames })
    }

    const resolvedTagIds = await resolveTagIds(locals.db, tagIds, newTagNames)
    await locals.db.delete(tagsToWords).where(eq(tagsToWords.wordId, String(updatedId)))
    if (resolvedTagIds.length > 0) {
      await locals.db
        .insert(tagsToWords)
        .values(resolvedTagIds.map(tagId => ({ tagId, wordId: String(updatedId) })))
    }

    redirect(303, `/words/${slug}`)
  },

  delete: async ({ locals, params }) => {
    requireAdmin(locals)

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

    await locals.db.delete(tagsToWords).where(eq(tagsToWords.wordId, String(existing.id)))
    await locals.db.delete(word).where(eq(word.slug, params.slug))

    redirect(303, '/words')
  },
}
