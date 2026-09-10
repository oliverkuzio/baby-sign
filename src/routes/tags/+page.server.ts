import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { tag } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { fail, redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireAdmin(locals)

  const tags = await locals.db.query.tag.findMany({
    orderBy: [asc(tag.name)],
    with: {
      words: true,
      phrases: true,
      songs: true,
    },
  })

  return { tags }
}

export const actions: Actions = {
  create: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const name = String(data.get('name') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()

    if (!name) {
      return fail(400, { error: 'A tag name is required.', name, slug: slugInput })
    }

    const slug = slugInput ? slugify(slugInput) : slugify(name)
    if (!slug) {
      return fail(400, { error: 'Could not derive a slug from that name — set one explicitly.', name, slug: slugInput })
    }

    try {
      await locals.db.insert(tag).values({ name, slug })
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.`, name, slug: slugInput })
    }

    redirect(303, '/tags')
  },

  update: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const id = String(data.get('id') ?? '')
    const name = String(data.get('name') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const slug = slugify(slugInput)

    if (!id || !name || !slug) {
      return fail(400, { error: 'A tag name and slug are required.' })
    }

    try {
      const [updated] = await locals.db
        .update(tag)
        .set({ name, slug })
        .where(eq(tag.id, Number(id)))
        .returning()

      if (!updated) {
        return fail(404, { error: 'Tag not found.' })
      }
    }
    catch {
      return fail(400, { error: `The slug "${slug}" is already in use.` })
    }

    redirect(303, '/tags')
  },

  delete: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const id = String(data.get('id') ?? '')

    const existing = await locals.db.query.tag.findFirst({
      where: eq(tag.id, Number(id)),
      with: {
        words: true,
        phrases: true,
        songs: true,
      },
    })

    if (!existing) {
      return fail(404, { error: 'Tag not found.' })
    }

    if (existing.words.length > 0 || existing.phrases.length > 0 || existing.songs.length > 0) {
      return fail(400, {
        error: 'This tag is still applied to a word, phrase, or song — remove it there first.',
      })
    }

    await locals.db.delete(tag).where(eq(tag.id, Number(id)))

    redirect(303, '/tags')
  },
}
