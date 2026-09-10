import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { tagsToSongs } from './tagsToSongs'
import { wordsToSongs } from './wordsToSongs'

export const song = sqliteTable('song', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  lyrics: text('lyrics').notNull(),
})

export const songRelations = relations(song, ({ many }) => ({
  words: many(wordsToSongs),
  tags: many(tagsToSongs),
}))

export type Song = typeof song.$inferSelect
