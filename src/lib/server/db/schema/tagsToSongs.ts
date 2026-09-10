import { relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { song } from './song'
import { tag } from './tag'

export const tagsToSongs = sqliteTable(
  'tags_to_songs',
  {
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id),
    songId: text('song_id')
      .notNull()
      .references(() => song.id),
  },
  t => [primaryKey({ columns: [t.tagId, t.songId] })],
)

export const tagsToSongsRelations = relations(tagsToSongs, ({ one }) => ({
  tag: one(tag, {
    fields: [tagsToSongs.tagId],
    references: [tag.id],
  }),
  song: one(song, {
    fields: [tagsToSongs.songId],
    references: [song.id],
  }),
}))

export type TagsToSongs = typeof tagsToSongs.$inferSelect
