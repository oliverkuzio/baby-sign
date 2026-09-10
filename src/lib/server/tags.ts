import type { DrizzleClient } from './db'
import { eq } from 'drizzle-orm'
import { tag } from './db/schema'
import { slugify } from './slugify'

/**
 * Resolves a form submission's tag selection into a final list of tag IDs:
 * existing tag IDs picked from the list, plus any newly typed tag names —
 * created if they don't exist yet, or reused (matched by slug) if they do.
 */
export async function resolveTagIds(
  db: DrizzleClient,
  existingTagIds: string[],
  newTagNames: string[],
): Promise<string[]> {
  const names = [...new Set(newTagNames.map(name => name.trim()).filter(Boolean))]
  const resolvedIds: string[] = []

  for (const name of names) {
    const slug = slugify(name)
    if (!slug)
      continue

    const existing = await db.query.tag.findFirst({ where: eq(tag.slug, slug) })
    if (existing) {
      resolvedIds.push(String(existing.id))
      continue
    }

    const [created] = await db.insert(tag).values({ name, slug }).returning()
    resolvedIds.push(String(created.id))
  }

  return [...new Set([...existingTagIds, ...resolvedIds])]
}
