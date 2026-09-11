import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth'
import { phrase } from './phrase'

export const usersToPhrases = sqliteTable(
  'users_to_phrases',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    phraseId: text('phrase_id')
      .notNull()
      .references(() => phrase.id),
  },
  t => [primaryKey({ columns: [t.userId, t.phraseId] })],
)

export const usersToPhrasesRelations = relations(usersToPhrases, ({ one }) => ({
  user: one(user, {
    fields: [usersToPhrases.userId],
    references: [user.id],
  }),
  phrase: one(phrase, {
    fields: [usersToPhrases.phraseId],
    references: [phrase.id],
  }),
}))

export type UsersToPhrases = typeof usersToPhrases.$inferSelect
