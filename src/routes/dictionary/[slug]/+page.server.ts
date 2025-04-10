import type { PageServerLoad } from './$types.js';
import type { Word } from '$lib/server/db/schema.js';

import { db } from '$lib/server/db/index.js';
import { word } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const result = await db.select().from(word).where(eq(word.slug, slug)).limit(1);

	if (result.length === 0) {
		throw new Error(`Word with slug "${slug}" not found`);
	}

	return {
		word: result[0]
	};
};
