import type { PageServerLoad } from './$types.js';
import type { Phrase } from '$lib/server/db/schema';
import { db } from '$lib/server/db/index';
import { phrase as phraseTable } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const phrases: Phrase[] = await db.query.phrase.findMany({
		orderBy: [asc(phraseTable.title)],
		limit: 20,
		offset: 0
	});

	return {
		phrases: phrases
	};
};
