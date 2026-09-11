import type { DrizzleClient } from './db'
import { and, eq } from 'drizzle-orm'
import { usersToPhrases, usersToSongs, usersToWords } from './db/schema'

/** Whether `userId` has favourited the word `wordId`. */
export async function isWordFavourited(db: DrizzleClient, userId: string, wordId: number): Promise<boolean> {
  const row = await db.query.usersToWords.findFirst({
    where: and(eq(usersToWords.userId, userId), eq(usersToWords.wordId, String(wordId))),
  })
  return row !== undefined
}

/** Whether `userId` has favourited the phrase `phraseId`. */
export async function isPhraseFavourited(db: DrizzleClient, userId: string, phraseId: number): Promise<boolean> {
  const row = await db.query.usersToPhrases.findFirst({
    where: and(eq(usersToPhrases.userId, userId), eq(usersToPhrases.phraseId, String(phraseId))),
  })
  return row !== undefined
}

/** Whether `userId` has favourited the song `songId`. */
export async function isSongFavourited(db: DrizzleClient, userId: string, songId: number): Promise<boolean> {
  const row = await db.query.usersToSongs.findFirst({
    where: and(eq(usersToSongs.userId, userId), eq(usersToSongs.songId, String(songId))),
  })
  return row !== undefined
}

/**
 * All word ids `userId` has favourited, as a Set — one query, reused both to
 * mark favourited cards on a listing page and to power the "favourites
 * only" filter, rather than a per-row check.
 */
export async function getFavouritedWordIds(db: DrizzleClient, userId: string): Promise<Set<number>> {
  const rows = await db.select({ wordId: usersToWords.wordId }).from(usersToWords).where(eq(usersToWords.userId, userId))
  return new Set(rows.map(row => Number(row.wordId)))
}

/** Same as {@link getFavouritedWordIds}, for phrases. */
export async function getFavouritedPhraseIds(db: DrizzleClient, userId: string): Promise<Set<number>> {
  const rows = await db.select({ phraseId: usersToPhrases.phraseId }).from(usersToPhrases).where(eq(usersToPhrases.userId, userId))
  return new Set(rows.map(row => Number(row.phraseId)))
}

/** Same as {@link getFavouritedWordIds}, for songs. */
export async function getFavouritedSongIds(db: DrizzleClient, userId: string): Promise<Set<number>> {
  const rows = await db.select({ songId: usersToSongs.songId }).from(usersToSongs).where(eq(usersToSongs.userId, userId))
  return new Set(rows.map(row => Number(row.songId)))
}

/**
 * Toggles whether `userId` has favourited the word `wordId`, inserting or
 * deleting the join row as needed. Returns the resulting favourited state.
 */
export async function toggleWordFavourite(db: DrizzleClient, userId: string, wordId: number): Promise<boolean> {
  const favourited = await isWordFavourited(db, userId, wordId)
  if (favourited) {
    await db.delete(usersToWords).where(and(eq(usersToWords.userId, userId), eq(usersToWords.wordId, String(wordId))))
    return false
  }
  await db.insert(usersToWords).values({ userId, wordId: String(wordId) })
  return true
}

/** Same as {@link toggleWordFavourite}, for phrases. */
export async function togglePhraseFavourite(db: DrizzleClient, userId: string, phraseId: number): Promise<boolean> {
  const favourited = await isPhraseFavourited(db, userId, phraseId)
  if (favourited) {
    await db.delete(usersToPhrases).where(and(eq(usersToPhrases.userId, userId), eq(usersToPhrases.phraseId, String(phraseId))))
    return false
  }
  await db.insert(usersToPhrases).values({ userId, phraseId: String(phraseId) })
  return true
}

/** Same as {@link toggleWordFavourite}, for songs. */
export async function toggleSongFavourite(db: DrizzleClient, userId: string, songId: number): Promise<boolean> {
  const favourited = await isSongFavourited(db, userId, songId)
  if (favourited) {
    await db.delete(usersToSongs).where(and(eq(usersToSongs.userId, userId), eq(usersToSongs.songId, String(songId))))
    return false
  }
  await db.insert(usersToSongs).values({ userId, songId: String(songId) })
  return true
}
