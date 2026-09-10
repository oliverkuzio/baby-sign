import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { phrase } from './phrase'
import { tag } from './tag'

export const tagsToPhrases = sqliteTable(
  'tags_to_phrases',
  {
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id),
    phraseId: text('phrase_id')
      .notNull()
      .references(() => phrase.id),
  },
  t => [primaryKey({ columns: [t.tagId, t.phraseId] })],
)

export const tagsToPhrasesRelations = relations(tagsToPhrases, ({ one }) => ({
  tag: one(tag, {
    fields: [tagsToPhrases.tagId],
    references: [tag.id],
  }),
  phrase: one(phrase, {
    fields: [tagsToPhrases.phraseId],
    references: [phrase.id],
  }),
}))

export type TagsToPhrases = typeof tagsToPhrases.$inferSelect
