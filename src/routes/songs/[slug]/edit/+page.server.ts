import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { song, tag, tagsToSongs, word, wordsToSongs } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { resolveTagIds } from '$lib/server/tags'
import { error, fail, redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals, params }) => {
  requireAdmin(locals)

  const [existing, words, tags] = await Promise.all([
    locals.db.query.song.findFirst({
      where: eq(song.slug, params.slug),
      with: {
        words: { columns: { wordId: true } },
        tags: { columns: { tagId: true } },
      },
    }),
    locals.db.query.word.findMany({ orderBy: [asc(word.word)] }),
    locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] }),
  ])

  if (!existing) {
    error(404, `Song "${params.slug}" not found.`)
  }

  return {
    song: existing,
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
    const lyrics = String(data.get('lyrics') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const wordIds = data.getAll('wordIds').map(String)
    const tagIds = data.getAll('tagIds').map(String)
    const newTagNames = data.getAll('newTagNames').map(String)
    const slug = slugify(slugInput)

    if (!title || !lyrics || !slug) {
      return fail(400, {
        error: 'A title, lyrics, and slug are required.',
        title,
        lyrics,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    let songId: number
    try {
      const [updated] = await locals.db
        .update(song)
        .set({ title, lyrics, slug })
        .where(eq(song.slug, params.slug))
        .returning()

      if (!updated) {
        error(404, `Song "${params.slug}" not found.`)
      }
      songId = updated.id
    }
    catch {
      return fail(400, {
        error: `The slug "${slug}" is already in use.`,
        title,
        lyrics,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    await locals.db.delete(wordsToSongs).where(eq(wordsToSongs.songId, String(songId)))
    if (wordIds.length > 0) {
      await locals.db
        .insert(wordsToSongs)
        .values(wordIds.map(wordId => ({ wordId, songId: String(songId) })))
    }

    const resolvedTagIds = await resolveTagIds(locals.db, tagIds, newTagNames)
    await locals.db.delete(tagsToSongs).where(eq(tagsToSongs.songId, String(songId)))
    if (resolvedTagIds.length > 0) {
      await locals.db
        .insert(tagsToSongs)
        .values(resolvedTagIds.map(tagId => ({ tagId, songId: String(songId) })))
    }

    redirect(303, `/songs/${slug}`)
  },

  delete: async ({ locals, params }) => {
    requireAdmin(locals)

    const existing = await locals.db.query.song.findFirst({ where: eq(song.slug, params.slug) })
    if (!existing) {
      error(404, `Song "${params.slug}" not found.`)
    }

    await locals.db.delete(wordsToSongs).where(eq(wordsToSongs.songId, String(existing.id)))
    await locals.db.delete(tagsToSongs).where(eq(tagsToSongs.songId, String(existing.id)))
    await locals.db.delete(song).where(eq(song.slug, params.slug))

    redirect(303, '/songs')
  },
}
