/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker'

const sw = globalThis as unknown as ServiceWorkerGlobalScope

// App shell (hashed JS/CSS, static files, the prerendered /offline page) and
// visited pages are tied to a deploy: an old page's HTML/`__data.json`
// references chunks and route nodes the next deploy no longer has, so both
// are dropped when a new worker activates. Sign images are keyed by slug and
// survive deploys.
const ASSETS = `assets-${version}`
const PAGES = `pages-${version}`
const IMAGES = 'images'
const MAX_IMAGES = 300

const OFFLINE_PAGE = '/offline'
const PRECACHE = [...build, ...files, ...prerendered]
const precached = new Set(PRECACHE)

// Admin forms and auth must always hit the network.
const NEVER_CACHE = /^\/api\/auth\/|\/(?:new|edit)(?:\/|$)/

const INVALIDATED_PARAM = 'x-sveltekit-invalidated'

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSETS)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => sw.skipWaiting()),
  )
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== ASSETS && key !== PAGES && key !== IMAGES)
          .map(key => caches.delete(key)),
      ))
      .then(() => sw.clients.claim()),
  )
})

// Cached pages and images belong to whoever was signed in; the sign-out
// handler asks for them to be dropped so the next user can't see them.
sw.addEventListener('message', (event) => {
  if (event.data?.type === 'clear-user-cache') {
    event.waitUntil(Promise.all([caches.delete(PAGES), caches.delete(IMAGES)]))
  }
})

sw.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET')
    return

  const url = new URL(request.url)

  if (url.hostname === 'res.cloudinary.com' && request.destination === 'image') {
    event.respondWith(signImage(event, request))
    return
  }

  if (url.origin !== sw.location.origin || NEVER_CACHE.test(url.pathname))
    return

  if (precached.has(url.pathname)) {
    event.respondWith(precachedAsset(request))
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(page(event, request))
    return
  }

  if (url.pathname.endsWith('/__data.json'))
    event.respondWith(pageData(event, request, url))
})

async function precachedAsset(request: Request): Promise<Response> {
  const cached = await caches.match(request, { cacheName: ASSETS })
  return cached ?? fetch(request)
}

/** Network-first; falls back to the last copy of this page, then the offline page. */
async function page(event: FetchEvent, request: Request): Promise<Response> {
  try {
    const response = await fetch(request)
    cachePage(event, request, response)
    return response
  }
  catch {
    const cached = await caches.match(request, { cacheName: PAGES })
    const offline = await caches.match(OFFLINE_PAGE, { cacheName: ASSETS })
    return cached ?? offline ?? Response.error()
  }
}

/**
 * Network-first, like `page`, for the data SvelteKit fetches on client-side
 * navigation. The `x-sveltekit-invalidated` param varies with where the
 * navigation started from, so on a miss we also try the variant that asked
 * for every node — a superset of whatever this request needs.
 */
async function pageData(event: FetchEvent, request: Request, url: URL): Promise<Response> {
  try {
    const response = await fetch(request)
    cachePage(event, request, response)
    return response
  }
  catch {
    const cached = await caches.match(request, { cacheName: PAGES })
    if (cached)
      return cached

    const invalidated = url.searchParams.get(INVALIDATED_PARAM)
    if (invalidated) {
      const full = new URL(url)
      full.searchParams.set(INVALIDATED_PARAM, '1'.repeat(invalidated.length))
      const fallback = await caches.match(full.href, { cacheName: PAGES })
      if (fallback)
        return fallback
    }

    // Rendered by +error.svelte, which shows this message.
    return Response.json(
      'You\'re offline, and this page hasn\'t been saved for offline use yet.',
      { status: 503 },
    )
  }
}

function cachePage(event: FetchEvent, request: Request, response: Response) {
  // Redirected responses can't be replayed for a navigation, and anything
  // other than a 200 (401s when signed out, errors) isn't worth keeping.
  if (response.status !== 200 || response.redirected)
    return

  const copy = response.clone()
  event.waitUntil(caches.open(PAGES).then(cache => cache.put(request, copy)))
}

/**
 * Stale-while-revalidate. Cloudinary sends `Access-Control-Allow-Origin: *`,
 * so images are fetched in CORS mode: an opaque `no-cors` response would be
 * padded to several MB each against the storage quota.
 */
async function signImage(event: FetchEvent, request: Request): Promise<Response> {
  const cache = await caches.open(IMAGES)
  const cached = await cache.match(request.url)

  const network = fetch(request.url, { mode: 'cors', credentials: 'omit' })
    .then((response) => {
      if (response.ok) {
        const copy = response.clone()
        event.waitUntil(cache.put(request.url, copy).then(() => trim(cache, MAX_IMAGES)))
      }
      return response
    })

  if (cached) {
    event.waitUntil(network.catch(() => {}))
    return cached
  }

  return network.catch(() => fetch(request))
}

/** Drop the oldest entries (keys come back in insertion order). */
async function trim(cache: Cache, max: number) {
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map(key => cache.delete(key)))
}
