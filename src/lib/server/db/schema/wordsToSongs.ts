import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { word } from './word';
import { song } from './song';

export const wordsToSongs = sqliteTable(
	'words_to_songs',
	{
		wordId: text('word_id')
			.notNull()
			.references(() => word.id),
		songId: text('song_id')
			.notNull()
			.references(() => song.id)
	},
	(t) => [primaryKey({ columns: [t.wordId, t.songId] })]
);
export const wordsToSongsRelations = relations(wordsToSongs, ({ one }) => ({
	word: one(word, {
		fields: [wordsToSongs.wordId],
		references: [word.id]
	}),
	song: one(song, {
		fields: [wordsToSongs.songId],
		references: [song.id]
	})
}));

export type WordsToSongs = typeof wordsToSongs.$inferSelect;
