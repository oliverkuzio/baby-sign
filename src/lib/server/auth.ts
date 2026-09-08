import type { DrizzleClient } from './db'
import { getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
// `better-auth/minimal` skips the built-in Kysely SQL dialects (Bun/Node/D1
// sqlite, Postgres, MySQL) that `better-auth` bundles for its own DB layer —
// unneeded here since drizzleAdapter above handles the D1 connection, and
// worth trimming from a Cloudflare Worker's bundle.
import { betterAuth } from 'better-auth/minimal'
import { admin } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit'
import * as schema from './db/schema'

export function createAuth(db: DrizzleClient, env: Env) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    plugins: [
      admin(),
      // Lets server-side calls to `auth.api.*` (outside the /api/auth handler,
      // e.g. from a form action) still set the session cookie on the response.
      // Must come last so it can observe the cookies set by other plugins.
      sveltekitCookies(getRequestEvent),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>

/**
 * Guards a `load` function or form action: throws a 401 unless a user is
 * signed in. Use at the top of any load/action that reads content.
 */
export function requireUser(locals: App.Locals) {
  if (!locals.user) {
    error(401, 'You must be signed in to do that.')
  }

  return locals.user
}

/**
 * Guards a `load` function or form action: throws a 401 unless a user is
 * signed in, and a 403 unless that user has the `admin` role granted by the
 * Better Auth `admin` plugin. Use at the top of any load/action that
 * creates, edits, or deletes content.
 */
export function requireAdmin(locals: App.Locals) {
  const user = requireUser(locals)

  if (user.role !== 'admin') {
    error(403, 'You must be an admin to do that.')
  }

  return user
}
