import type { LayoutServerLoad } from './$types'
import { building } from '$app/environment'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = ({ locals, platform }) => {
  // Prerendering has no bindings to read (see hooks.server.ts).
  if (building) {
    return { user: undefined, imageUrl: '' }
  }

  if (!platform) {
    error(500, 'No platform found.')
  }

  return {
    user: locals.user,
    imageUrl: platform.env.PUBLIC_IMAGE_URL,
  }
}
