import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { wordsToPhrases } from './wordsToPhrases';
import { wordsToSongs } from './wordsToSongs';

export const word = sqliteTable('word', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	word: text('word').notNull()
});

export const wordRelations = relations(word, ({ many }) => ({
	phrases: many(wordsToPhrases),
	songs: many(wordsToSongs)
}));

export type Word = typeof word.$inferSelect;
