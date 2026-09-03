import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { phrase } from './phrase'
import { word } from './word'

export const wordsToPhrases = sqliteTable(
  'words_to_phrases',
  {
    wordId: text('word_id')
      .notNull()
      .references(() => word.id),
    phraseId: text('phrase_id')
      .notNull()
      .references(() => phrase.id),
  },
  t => [primaryKey({ columns: [t.wordId, t.phraseId] })],
)

export const wordsToPhrasesRelations = relations(wordsToPhrases, ({ one }) => ({
  word: one(word, {
    fields: [wordsToPhrases.wordId],
    references: [word.id],
  }),
  phrase: one(phrase, {
    fields: [wordsToPhrases.phraseId],
    references: [phrase.id],
  }),
}))

export type WordsToPhrases = typeof wordsToPhrases.$inferSelect
