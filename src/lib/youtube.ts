const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{11}$/

/**
 * Extracts the 11-character video ID from any of the common YouTube URL
 * formats, e.g.:
 * - https://youtu.be/VIDEO_ID?list=...
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=...
 * - https://www.youtube.com/embed/VIDEO_ID?list=...
 *
 * Returns null if `url` isn't a recognisable YouTube video link.
 */
export function extractYouTubeVideoId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  }
  catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null
  }

  const host = parsed.hostname.replace(/^www\.|^m\./, '')

  let id: string | null = null
  if (host === 'youtu.be') {
    id = parsed.pathname.split('/').filter(Boolean)[0] ?? null
  }
  else if (host === 'youtube.com') {
    if (parsed.pathname === '/watch') {
      id = parsed.searchParams.get('v')
    }
    else if (parsed.pathname.startsWith('/embed/')) {
      id = parsed.pathname.slice('/embed/'.length).split('/')[0]
    }
  }

  return id && YOUTUBE_VIDEO_ID_PATTERN.test(id) ? id : null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

/** Forces any recognised YouTube URL format into the embeddable form. */
export function toYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
