import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql'
import * as schema from './schema'

export function createLibSqlClient(url: string): LibSQLDatabase<typeof schema> {
  const client = createClient({ url })
  return drizzleLibSql(client, { schema })
}

export function createD1Client(database: D1Database): DrizzleD1Database<typeof schema> {
  return drizzleD1(database, { schema })
}

export type DrizzleClient
  = | ReturnType<typeof createLibSqlClient>
    | ReturnType<typeof createD1Client>
