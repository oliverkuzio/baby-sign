import type { PageServerLoad } from './$types.js';

import { db } from '$lib/server/db/index.js';
import { phrase } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const result = await db.query.phrase.findFirst({
		where: eq(phrase.slug, slug),
		with: {
			words: {
				columns: {},
				with: {
					word: true
				}
			}
		}
	});

	if (result.length === 0) {
		throw new Error(`Phrase with slug "${slug}" not found`);
	}

	return {
		phrase: result
	};
};
