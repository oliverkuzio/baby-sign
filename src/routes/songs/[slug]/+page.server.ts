import type { PageServerLoad } from './$types.js';

import { db } from '$lib/server/db/index.js';
import { song } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const result = await db.query.song.findFirst({
		where: eq(song.slug, slug),
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
		throw new Error(`Song with slug "${slug}" not found`);
	}

	return {
		song: result
	};
};
