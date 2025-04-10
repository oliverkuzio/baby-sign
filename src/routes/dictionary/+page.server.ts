import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index';
import { word as wordTable } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const words = await db.query.word.findMany({
		orderBy: [asc(wordTable.id)],
		limit: -1,
		offset: 0
	});

	return {
		words: words
	};
};
