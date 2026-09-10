import type { PageServerLoad } from './$types.js'
import { requireUser } from '$lib/server/auth'

export const load: PageServerLoad = ({ locals }) => {
  requireUser(locals)
}
