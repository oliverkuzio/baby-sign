import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),

    // An installed PWA can stay open for days; poll for new deploys so the
    // next navigation does a full reload (and picks up the new service worker).
    version: {
      pollInterval: 60_000,
    },

    // The service worker serves the prerendered /offline page in place of
    // any uncached URL, so its asset links must not be relative to /offline.
    paths: {
      relative: false,
    },

    experimental: {
      tracing: {
        server: true,
      },

      instrumentation: {
        server: true,
      },
    },
  },
}

export default config
