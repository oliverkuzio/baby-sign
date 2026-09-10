import type { PageServerLoad } from './$types.js'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(303, '/dashboard')
  }
}
