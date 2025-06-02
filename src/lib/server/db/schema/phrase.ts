import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { wordsToPhrases } from './wordsToPhrases';

export const phrase = sqliteTable('phrase', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	phrase: text('phrase').notNull()
});

export const phraseRelations = relations(phrase, ({ many }) => ({
	words: many(wordsToPhrases)
}));

export type Phrase = typeof phrase.$inferSelect;
