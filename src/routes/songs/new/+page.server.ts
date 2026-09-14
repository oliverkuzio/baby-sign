import type { Actions, PageServerLoad } from './$types'
import { requireAdmin } from '$lib/server/auth'
import { song, tag, tagsToSongs, word, wordsToSongs } from '$lib/server/db/schema'
import { slugify } from '$lib/server/slugify'
import { resolveTagIds } from '$lib/server/tags'
import { isValidYouTubeUrl } from '$lib/youtube'
import { fail, redirect } from '@sveltejs/kit'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  requireAdmin(locals)

  const [words, tags] = await Promise.all([
    locals.db.query.word.findMany({ orderBy: [asc(word.word)] }),
    locals.db.query.tag.findMany({ orderBy: [asc(tag.name)] }),
  ])

  return { words, tags }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requireAdmin(locals)

    const data = await request.formData()
    const title = String(data.get('title') ?? '').trim()
    const lyrics = String(data.get('lyrics') ?? '').trim()
    const videoUrl = String(data.get('videoUrl') ?? '').trim()
    const slugInput = String(data.get('slug') ?? '').trim()
    const wordIds = data.getAll('wordIds').map(String)
    const tagIds = data.getAll('tagIds').map(String)
    const newTagNames = data.getAll('newTagNames').map(String)

    if (!title || (!lyrics && !videoUrl)) {
      return fail(400, {
        error: 'A title is required, along with lyrics, a video URL, or both.',
        title,
        lyrics,
        videoUrl,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
      return fail(400, {
        error: 'That doesn\'t look like a valid YouTube video link.',
        title,
        lyrics,
        videoUrl,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    const slug = slugInput ? slugify(slugInput) : slugify(title)
    if (!slug) {
      return fail(400, {
        error: 'Could not derive a slug from that title — set one explicitly.',
        title,
        lyrics,
        videoUrl,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    let createdId: number
    try {
      const [created] = await locals.db
        .insert(song)
        .values({ title, lyrics, videoUrl: videoUrl || null, slug })
        .returning()
      createdId = created.id
    }
    catch {
      return fail(400, {
        error: `The slug "${slug}" is already in use.`,
        title,
        lyrics,
        videoUrl,
        slug: slugInput,
        wordIds,
        tagIds,
        newTagNames,
      })
    }

    if (wordIds.length > 0) {
      await locals.db
        .insert(wordsToSongs)
        .values(wordIds.map(wordId => ({ wordId, songId: String(createdId) })))
    }

    const resolvedTagIds = await resolveTagIds(locals.db, tagIds, newTagNames)
    if (resolvedTagIds.length > 0) {
      await locals.db
        .insert(tagsToSongs)
        .values(resolvedTagIds.map(tagId => ({ tagId, songId: String(createdId) })))
    }

    redirect(303, `/songs/${slug}`)
  },
}
