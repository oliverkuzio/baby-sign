import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { word } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { fail, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = ({ locals }) => {
  requireAdmin(locals)
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const wordText = String(data.get('word') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()

    if (!wordText) {
      return fail(400, { error: 'A word is required.', word: wordText, slug: slugInput })
    }

    const slug = slugInput ? slugify(slugInput) : slugify(wordText)
    if (!slug) {
      return fail(400, { error: 'Could not derive a slug from that word — set one explicitly.', word: wordText, slug: slugInput })
    }

    try {
      await locals.db.insert(word).values({ word: wordText, slug })
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.`, word: wordText, slug: slugInput })
    }

    redirect(303, `/dictionary/${slug}`)
  },
}
