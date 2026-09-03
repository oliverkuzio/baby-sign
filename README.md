# Baby Sign app

## Initial setup

Install dependencies:

```bash
pnpm install
```

The app uses [Cloudflare D1](https://developers.cloudflare.com/d1/) as its database, configured as the `DB` binding in [wrangler.jsonc](wrangler.jsonc). Apply migrations to a local D1 database (emulated on disk by Wrangler under `.wrangler/`):

```bash
pnpm db:migrate
```

### Authentication

The app uses [Better Auth](https://www.better-auth.com/) with GitHub as a social sign-on provider (see [src/lib/server/auth.ts](src/lib/server/auth.ts)). It's configured with Wrangler-style secrets rather than `.env`, so they're proxied into `platform.env` the same way the `DB` binding is:

```bash
cp .dev.vars.example .dev.vars
```

Then fill in `.dev.vars`:

- `BETTER_AUTH_SECRET` — any random string, e.g. `openssl rand -base64 32`.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — from a [GitHub OAuth App](https://github.com/settings/developers). Set its callback URL to `http://localhost:5173/api/auth/callback/github` for local dev (use the deployed origin in production).

For production, set the same three as Worker secrets instead of committing them:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

Once signed in, a "Add word/phrase/song +" link appears on each list page and an edit icon appears on each entry — creating, editing, and deleting words, phrases, and songs (`/dictionary/new`, `/dictionary/[slug]/edit`, and the equivalent `/phrases` and `/songs` routes) all require a signed-in user, enforced server-side in each route's `load`/`actions` via `requireUser` (see [src/lib/server/auth.ts](src/lib/server/auth.ts)), not just hidden in the UI.

### Sign images

Word/phrase/song sign images are served from a Cloudinary CDN, pinned via the non-secret `PUBLIC_IMAGE_URL` var in [wrangler.jsonc](wrangler.jsonc) (same pattern as `BETTER_AUTH_URL`) and read from `platform.env` in [+layout.server.ts](src/routes/+layout.server.ts) — no local setup needed.

## Developing

- `/src/lib` contains the database schema and components

- `/src/routes` contains the application files

- `/drizzle` contains the generated SQL migrations

Start development server (Vite dev — SvelteKit's Cloudflare adapter transparently proxies Cloudflare bindings, including the local D1 database, during `vite dev`):

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

### Changing the database schema

After editing a file under `src/lib/server/db/schema/`, generate a migration and apply it locally:

```bash
pnpm db:generate
pnpm db:migrate
```

Apply migrations to the production D1 database with:

```bash
pnpm db:migrate:remote
```

## Building

Create production version of app:

```bash
pnpm run build
```

Run the built worker locally with Wrangler against the local D1 database:

```bash
pnpm run preview
```
