import type { PageServerLoad } from './$types.js';
import { phrase } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { slug } = params;
	const res = await locals.db.query.phrase.findFirst({
		where: eq(phrase.slug, params.slug)
	});

	if (res === null) {
		throw new Error(`Phrase with slug "${slug}" not found`);
	}

	return {
		phrase: res
	};
};
