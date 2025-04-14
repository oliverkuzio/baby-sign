import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const word = sqliteTable('word', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	word: text('word').notNull()
});

export const wordRelations = relations(word, ({ many }) => ({
	phrases: many(wordsToPhrases),
	songs: many(wordsToSongs)
}));

export const phrase = sqliteTable('phrase', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	phrase: text('phrase').notNull()
});

export const phraseRelations = relations(phrase, ({ many }) => ({
	words: many(wordsToPhrases)
}));

export const wordsToPhrases = sqliteTable(
	'words_to_phrases',
	{
		wordId: text('word_id')
			.notNull()
			.references(() => word.id),
		phraseId: text('phrase_id')
			.notNull()
			.references(() => phrase.id)
	},
	(t) => [primaryKey({ columns: [t.wordId, t.phraseId] })]
);

export const wordsToPhrasesRelations = relations(wordsToPhrases, ({ one }) => ({
	word: one(word, {
		fields: [wordsToPhrases.wordId],
		references: [word.id]
	}),
	phrase: one(phrase, {
		fields: [wordsToPhrases.phraseId],
		references: [phrase.id]
	})
}));

export const song = sqliteTable('song', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	lyrics: text('lyrics').notNull()
});

export const songRelations = relations(song, ({ many }) => ({
	words: many(wordsToSongs)
}));

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

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Word = typeof word.$inferSelect;
export type Phrase = typeof phrase.$inferSelect;
export type WordsToPhrases = typeof wordsToPhrases.$inferSelect;
export type Song = typeof song.$inferSelect;
export type WordsToSongs = typeof wordsToSongs.$inferSelect;
