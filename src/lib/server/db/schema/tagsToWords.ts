import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { tag } from './tag'
import { word } from './word'

export const tagsToWords = sqliteTable(
  'tags_to_words',
  {
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id),
    wordId: text('word_id')
      .notNull()
      .references(() => word.id),
  },
  t => [primaryKey({ columns: [t.tagId, t.wordId] })],
)

export const tagsToWordsRelations = relations(tagsToWords, ({ one }) => ({
  tag: one(tag, {
    fields: [tagsToWords.tagId],
    references: [tag.id],
  }),
  word: one(word, {
    fields: [tagsToWords.wordId],
    references: [word.id],
  }),
}))

export type TagsToWords = typeof tagsToWords.$inferSelect
