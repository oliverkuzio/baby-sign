import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { tagsToPhrases } from './tagsToPhrases'
import { wordsToPhrases } from './wordsToPhrases'

export const phrase = sqliteTable('phrase', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  phrase: text('phrase').notNull(),
})

export const phraseRelations = relations(phrase, ({ many }) => ({
  words: many(wordsToPhrases),
  tags: many(tagsToPhrases),
}))

export type Phrase = typeof phrase.$inferSelect
