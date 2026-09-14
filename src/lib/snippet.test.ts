import { describe, expect, it } from 'vitest'
import { snippet } from './snippet'

describe('snippet', () => {
  it('returns short text unchanged, with no ellipsis', () => {
    expect(snippet('Twinkle twinkle little star', 50)).toBe('Twinkle twinkle little star')
  })

  it('returns text that is exactly maxLength unchanged', () => {
    const text = 'a'.repeat(50)
    expect(snippet(text, 50)).toBe(text)
  })

  it('extends to the end of the word straddling the cutoff, then adds an ellipsis', () => {
    const text = 'Twinkle twinkle little star, how I wonder what you are. Up above the world so high.'
    const result = snippet(text, 50)

    expect(result).toBe('Twinkle twinkle little star, how I wonder what you…')
    expect(result.endsWith('…')).toBe(true)
    // The word straddling position 50 ("you") is completed, not cut off.
    expect(result).not.toMatch(/\byo…$/)
  })

  it('omits the ellipsis when the cutoff word is also the last word', () => {
    const text = `${'a'.repeat(48)} bc`
    expect(snippet(text, 50)).toBe(text)
  })

  it('collapses newlines and repeated whitespace into single spaces', () => {
    expect(snippet('Line one,\n  line two.', 50)).toBe('Line one, line two.')
  })

  it('returns an empty string for empty input', () => {
    expect(snippet('', 50)).toBe('')
  })
})
