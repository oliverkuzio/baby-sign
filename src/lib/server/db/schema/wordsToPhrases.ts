import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { word } from './word';
import { phrase } from './phrase';

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

export type WordsToPhrases = typeof wordsToPhrases.$inferSelect;
