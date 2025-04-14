import type { PageServerLoad } from './$types.js';

import { db } from '$lib/server/db/index.js';
import { word } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const result = await db.query.word.findFirst({
		where: eq(word.slug, slug),
		with: {
			phrases: {
				columns: {},
				with: {
					phrase: true
				}
			},
			songs: {
				columns: {},
				with: {
					song: true
				}
			}
		}
	});

	if (result.length === 0) {
		throw new Error(`Word with slug "${slug}" not found`);
	}

	return {
		word: result
	};
};
