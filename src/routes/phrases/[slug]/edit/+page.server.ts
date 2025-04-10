import type { PageServerLoad } from './$types.js';
import type { Phrase } from '$lib/server/db/schema.js';

import { db } from '$lib/server/db/index.js';
import { phrase } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const result = await db.select().from(phrase).where(eq(phrase.slug, slug)).limit(1);

	if (result.length === 0) {
		throw new Error(`Phrase with slug "${slug}" not found`);
	}

	return {
		phrase: result[0]
	};
};
