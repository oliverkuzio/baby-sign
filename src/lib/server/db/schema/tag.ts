import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { tagsToPhrases } from './tagsToPhrases'
import { tagsToSongs } from './tagsToSongs'
import { tagsToWords } from './tagsToWords'

export const tag = sqliteTable('tag', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
})

export const tagRelations = relations(tag, ({ many }) => ({
  words: many(tagsToWords),
  phrases: many(tagsToPhrases),
  songs: many(tagsToSongs),
}))

export type Tag = typeof tag.$inferSelect
