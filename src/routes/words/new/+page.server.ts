import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { tag, tagsToWords, word } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { resolveTagIds } from '$lib/server/tags'
import { fail, redirect } from '@sveltejs/kit'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireAdmin(locals)

  const tags = await locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] })

  return { tags }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const wordText = String(data.get('word') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    const tagIds = data.getAll('tagIds').map(String)
    const newTagNames = data.getAll('newTagNames').map(String)

    if (!wordText) {
      return fail(400, { error: 'A word is required.', word: wordText, slug: slugInput, description, tagIds, newTagNames })
    }

    const slug = slugInput ? slugify(slugInput) : slugify(wordText)
    if (!slug) {
      return fail(400, { error: 'Could not derive a slug from that word — set one explicitly.', word: wordText, slug: slugInput, description, tagIds, newTagNames })
    }

    let createdId: number
    try {
      const [created] = await locals.db.insert(word).values({ word: wordText, slug, description: description || null }).returning()
      createdId = created.id
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.`, word: wordText, slug: slugInput, description, tagIds, newTagNames })
    }

    const resolvedTagIds = await resolveTagIds(locals.db, tagIds, newTagNames)
    if (resolvedTagIds.length > 0) {
      await locals.db
        .insert(tagsToWords)
        .values(resolvedTagIds.map(tagId => ({ tagId, wordId: String(createdId) })))
    }

    redirect(303, `/words/${slug}`)
  },
}
