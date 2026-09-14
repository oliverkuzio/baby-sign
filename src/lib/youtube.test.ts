import { describe, expect, it } from 'vitest'
import { extractYouTubeVideoId, isValidYouTubeUrl, toYouTubeEmbedUrl } from './youtube'

describe('extractYouTubeVideoId', () => {
  it('extracts the id from a youtu.be link', () => {
    expect(extractYouTubeVideoId('https://youtu.be/pZw9veQ76fo?list=RDpZw9veQ76fo')).toBe('pZw9veQ76fo')
  })

  it('extracts the id from a watch link', () => {
    expect(
      extractYouTubeVideoId('https://www.youtube.com/watch?v=pZw9veQ76fo&list=RDpZw9veQ76fo&start_radio=1'),
    ).toBe('pZw9veQ76fo')
  })

  it('extracts the id from an embed link', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/pZw9veQ76fo?list=RDpZw9veQ76fo')).toBe(
      'pZw9veQ76fo',
    )
  })

  it('handles the bare m.youtube.com and no-www hosts', () => {
    expect(extractYouTubeVideoId('https://m.youtube.com/watch?v=pZw9veQ76fo')).toBe('pZw9veQ76fo')
    expect(extractYouTubeVideoId('https://youtube.com/watch?v=pZw9veQ76fo')).toBe('pZw9veQ76fo')
  })

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeVideoId('https://vimeo.com/12345')).toBeNull()
  })

  it('returns null for a YouTube URL with no video', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/')).toBeNull()
  })

  it('returns null for garbage input', () => {
    expect(extractYouTubeVideoId('not a url')).toBeNull()
    expect(extractYouTubeVideoId('')).toBeNull()
  })
})

describe('isValidYouTubeUrl', () => {
  it('mirrors extractYouTubeVideoId', () => {
    expect(isValidYouTubeUrl('https://youtu.be/pZw9veQ76fo')).toBe(true)
    expect(isValidYouTubeUrl('https://example.com')).toBe(false)
  })
})

describe('toYouTubeEmbedUrl', () => {
  it('forces every format into the embed form', () => {
    expect(toYouTubeEmbedUrl('https://youtu.be/pZw9veQ76fo?list=RDpZw9veQ76fo')).toBe(
      'https://www.youtube.com/embed/pZw9veQ76fo',
    )
    expect(
      toYouTubeEmbedUrl('https://www.youtube.com/watch?v=pZw9veQ76fo&list=RDpZw9veQ76fo&start_radio=1'),
    ).toBe('https://www.youtube.com/embed/pZw9veQ76fo')
  })

  it('returns null when there is no valid video id', () => {
    expect(toYouTubeEmbedUrl('https://example.com')).toBeNull()
  })
})
