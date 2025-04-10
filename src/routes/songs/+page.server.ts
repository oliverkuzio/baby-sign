import type { PageServerLoad } from './$types';
import type { Song } from '$lib/server/db/schema';
import { db } from '$lib/server/db/index';
import { song as songTable } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const songs: Song[] = await db.query.song.findMany({
		orderBy: [asc(songTable.title)],
		limit: 20,
		offset: 0
	});

	return {
		songs: songs
	};
};
