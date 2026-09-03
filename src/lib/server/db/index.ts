import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import * as schema from './schema'

export function createD1Client(database: D1Database): DrizzleD1Database<typeof schema> {
  return drizzleD1(database, { schema })
}

export type DrizzleClient = ReturnType<typeof createD1Client>
