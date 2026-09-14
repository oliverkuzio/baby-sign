/**
 * Builds a short preview of `text`, roughly `maxLength` characters long.
 * Never cuts a word in half — if the cutoff falls mid-word, the snippet is
 * extended to the end of that word — and only appends an ellipsis when
 * there's more text left afterwards.
 */
export function snippet(text: string, maxLength = 50): string {
  const collapsed = text.trim().replace(/\s+/g, ' ')
  if (collapsed.length <= maxLength) {
    return collapsed
  }

  const wordBoundary = collapsed.indexOf(' ', maxLength)
  const end = wordBoundary === -1 ? collapsed.length : wordBoundary

  return end < collapsed.length ? `${collapsed.slice(0, end)}…` : collapsed
}
