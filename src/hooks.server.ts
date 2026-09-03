import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'
import { createAuth } from '$lib/server/auth'
import { createD1Client } from '$lib/server/db'
import { svelteKitHandler } from 'better-auth/svelte-kit'

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.platform?.env.DB) {
    throw new Error('No database found.')
  }

  event.locals.db = createD1Client(event.platform.env.DB)
  event.locals.auth = createAuth(event.locals.db, event.platform.env)

  const session = await event.locals.auth.api.getSession({ headers: event.request.headers })
  event.locals.session = session?.session
  event.locals.user = session?.user

  return svelteKitHandler({ event, resolve, auth: event.locals.auth, building })
}
