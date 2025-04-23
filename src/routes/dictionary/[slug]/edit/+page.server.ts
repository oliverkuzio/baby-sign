import type { PageServerLoad } from './$types';
import { word } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { slug } = params;
	const res = await locals.db.query.word.findFirst({
		where: eq(word.slug, params.slug)
	});

	if (res === null) {
		throw new Error(`Word with slug "${slug}" not found`);
	}

	return {
		word: res
	};
};
