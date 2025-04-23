import type { PageServerLoad } from './$types.js';
import { song } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { slug } = params;
	const res = await locals.db.query.song.findFirst({
		where: eq(song.slug, slug)
	});

	if (res === null) {
		throw new Error(`Song with slug "${slug}" not found`);
	}

	return {
		song: res
	};
};
