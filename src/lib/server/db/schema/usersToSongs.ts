import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth'
import { song } from './song'

export const usersToSongs = sqliteTable(
  'users_to_songs',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    songId: text('song_id')
      .notNull()
      .references(() => song.id),
  },
  t => [primaryKey({ columns: [t.userId, t.songId] })],
)

export const usersToSongsRelations = relations(usersToSongs, ({ one }) => ({
  user: one(user, {
    fields: [usersToSongs.userId],
    references: [user.id],
  }),
  song: one(song, {
    fields: [usersToSongs.songId],
    references: [song.id],
  }),
}))

export type UsersToSongs = typeof usersToSongs.$inferSelect
