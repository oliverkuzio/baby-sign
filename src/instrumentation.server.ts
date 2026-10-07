import { PUBLIC_SENTRY_DSN } from '$env/static/public'

import * as Sentry from '@sentry/sveltekit'

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  release: `baby-sign@${__APP_VERSION__}`,

  tracesSampleRate: 1.0,
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
})
