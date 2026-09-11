import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth'
import { word } from './word'

export const usersToWords = sqliteTable(
  'users_to_words',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    wordId: text('word_id')
      .notNull()
      .references(() => word.id),
  },
  t => [primaryKey({ columns: [t.userId, t.wordId] })],
)

export const usersToWordsRelations = relations(usersToWords, ({ one }) => ({
  user: one(user, {
    fields: [usersToWords.userId],
    references: [user.id],
  }),
  word: one(word, {
    fields: [usersToWords.wordId],
    references: [word.id],
  }),
}))

export type UsersToWords = typeof usersToWords.$inferSelect
