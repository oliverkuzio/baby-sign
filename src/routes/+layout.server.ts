import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = ({ locals, platform }) => {
  if (!platform) {
    error(500, 'No platform found.')
  }

  return {
    user: locals.user,
    imageUrl: platform.env.PUBLIC_IMAGE_URL,
  }
}
