# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** (not npm/yarn) and **Wrangler** (Cloudflare's CLI) for anything touching the D1 database or the deployed Worker.

```bash
pnpm dev                    # vite dev — Cloudflare bindings (incl. local D1) are proxied in automatically
pnpm build                  # production build
pnpm preview                # build, then run the built worker locally with `wrangler dev`
pnpm deploy                 # build, then `wrangler deploy`

pnpm check                  # svelte-kit sync + svelte-check (type checking)
pnpm lint                   # eslint .
pnpm format                 # eslint . --fix

pnpm test                   # vitest --run (both projects, see below)
pnpm vitest run <path>      # run a single test file
pnpm vitest run <path> -t "<name>"   # run a single test by name

pnpm db:generate            # drizzle-kit generate — after editing src/lib/server/db/schema/*
pnpm db:migrate             # wrangler d1 migrations apply DB --local
pnpm db:migrate:remote      # apply migrations to the production D1 database
pnpm db:studio              # drizzle-kit studio

pnpm changeset              # record a version bump + changelog entry for the current branch
```

Vitest runs two projects defined in `vite.config.ts`: `client` (jsdom + `@testing-library/svelte`, for `*.svelte.{test,spec}.ts`) and `server` (node, for every other `*.{test,spec}.ts`, excluding `src/lib/server/**`). `pnpm test` runs both.

## Architecture

SvelteKit 5 app deployed to Cloudflare Workers (`@sveltejs/adapter-cloudflare`), with Cloudflare D1 (via `drizzle-orm/d1`) as the database and Better Auth for GitHub OAuth + role-based admin access.

### Request-scoped bindings

`src/hooks.server.ts` reads `event.platform.env.DB` (the D1 binding, only present under Wrangler/the Cloudflare adapter — not plain `vite dev` without it) and attaches `locals.db` (Drizzle client) and `locals.auth` (Better Auth instance) per-request, then resolves the session into `locals.session`/`locals.user`. `App.Locals` is declared in `src/app.d.ts`. Non-secret runtime config (`PUBLIC_IMAGE_URL`, `BETTER_AUTH_URL`) lives in `wrangler.jsonc` under `vars` and is read from `platform.env` (see `+layout.server.ts`), not `$env/static/*` — this is what makes it available identically under `vite dev` and the deployed Worker.

### Auth model

Two guard functions in `src/lib/server/auth.ts`, called at the top of every `load`/form `action` that needs them (never relied on as UI-only gating):
- `requireUser(locals)` — 401 unless signed in. Used by every read (`load`) for word/phrase/song/tag content.
- `requireAdmin(locals)` — 401/403 unless `user.role === 'admin'` (role comes from Better Auth's `admin` plugin). Used by every create/update/delete `load`/`action`.

### Database schema

One file per table under `src/lib/server/db/schema/`, each exporting the table, its `relations()`, and an inferred `$select` type; all re-exported through `schema/index.ts` (the single import surface used everywhere else, and the `schema` passed to both the Better Auth Drizzle adapter and `drizzle-orm/d1`). After changing a schema file, run `pnpm db:generate` then `pnpm db:migrate`.

The core content entities — `word`, `phrase`, `song` — and `tag` are all connected by explicit many-to-many join tables (`wordsToPhrases`, `wordsToSongs`, `tagsToWords`, `tagsToPhrases`, `tagsToSongs`) rather than a polymorphic association: composite primary key on the two foreign keys, `text` columns even where they reference an `integer` PK (matching how join rows are built as `String(id)` in the route code), no cascade deletes — routes delete join rows explicitly before deleting the parent.

### The word/phrase/song triad

`/words` (word, labelled "Dictionary" in the UI), `/phrases`, and `/songs` are three parallel implementations of the same route shape — when changing one, the same change almost always needs to land in the other two:
- `+page.server.ts` — paginated, tag-filterable listing (see below)
- `[slug]/+page.server.ts` + `+page.svelte` — public detail view
- `new/+page.server.ts` + `+page.svelte` — admin create form
- `[slug]/edit/+page.server.ts` + `+page.svelte` — admin edit/delete form

Create/update actions read `wordIds`/`tagIds`/`newTagNames` off the submitted `FormData` (via components like `WordAutocomplete.svelte` and `TagPicker.svelte`, which render selections as hidden inputs), resolve new tag names to ids via `resolveTagIds()` (`src/lib/server/tags.ts` — creates a tag or reuses one by slug), then delete-and-reinsert the relevant join table rows. Slugs are produced by `slugify()` (`src/lib/server/slugify.ts`) and rely on a DB-level unique constraint; a failed insert/update is caught and turned into a "slug already in use" `fail()`.

### Listing pagination + tag filtering

Listing loads (`words`, `phrases`, `songs` `+page.server.ts`) filter by tag at the SQL level — `selectDistinct` over the entity's join table joined to `tag`, filtered with `inArray(tag.slug, selectedTagSlugs)` — and only then paginate the parent query with `limit`/`offset`, because filtering must happen before pagination is applied (not after, on an already-limited page). `src/lib/server/pagination.ts#resolvePagination` clamps `?page=` against a total count and returns the `limit`/`offset` to use. `TagFilter.svelte` and `Pagination.svelte` both build plain `?tag=…&page=…` links (progressive-enhancement friendly, no client JS required) and each preserves the other's query params.

Page components read `data.words`/`data.phrases`/`data.songs` reactively (`$: phrases = data.phrases`, not `const`) — SvelteKit reuses the component instance across same-route navigations (e.g. clicking a tag filter or page link), so a non-reactive top-level `const` binding silently goes stale.

### Sign images

Word/phrase/song images are not stored in this repo — they're served from a Cloudinary CDN at `${PUBLIC_IMAGE_URL}/${slug}.svg` (or `-preview-webp.webp` for thumbnails), keyed by the entity's slug.

## Releases & versioning

Semver releases are managed by [Changesets](https://changesets.dev). The full guide for people is the "Releases" section of `README.md`; keep the two in sync when the process changes.

**Rules for any change you make:**
- **Every PR gets a changeset.** Before opening a PR, add `.changeset/<kebab-name>.md` (or run `pnpm changeset`) with the bump and a one-line, user-facing changelog entry:
  ```md
  ---
  "baby-sign": patch
  ---

  Fix tag filter links losing the current page.
  ```
  - `patch`: bug fixes and small tweaks with no new functionality (1.0.0 → 1.0.1)
  - `minor`: new features or user-visible additions (1.0.0 → 1.1.0)
  - `major`: breaking changes, e.g. removing or renaming routes or features, or changes that invalidate existing links, data or installed PWAs (1.0.0 → 2.0.0)
  - Nothing user-facing (docs, CI, refactors, invisible dependency bumps): an empty changeset, i.e. frontmatter `---\n---` only, or `pnpm changeset --empty`.
  - Write the entry for app users, not developers. It is copied verbatim into `CHANGELOG.md` and the GitHub Release. If unsure between two bumps, ask the user.
  The Lint workflow fails PRs without one (`pnpm changeset status --since=origin/main`), except the bot's `changeset-release/main` PR.
- **Never** edit `version` in `package.json` or `CHANGELOG.md` by hand, and never create `v*` tags or GitHub Releases manually. The release workflow owns all of them.

**How a release happens** (`.github/workflows/release.yml`, `changesets/action@v2` on every push to `main`):
1. PRs with changesets merge into `main`. The action opens or updates a bot PR titled "Version Packages" (branch `changeset-release/main`) that runs `changeset version`: it bumps `package.json`, prepends to `CHANGELOG.md` and deletes the used changesets. A release with several changesets takes the largest bump among them.
2. The user merges the Version Packages PR when they want to ship. The action then runs `publish-script: pnpm changeset publish`. Because `package.json` is `private` and `.changeset/config.json` has `privatePackages: { version: true, tag: true }`, this publishes nothing to npm. It only creates the `vX.Y.Z` tag, which the action pushes and turns into a GitHub Release (notes = changelog entries, with PR/author links from `@changesets/changelog-github`).
3. Deploy is manual from an up-to-date `main`: `pnpm db:migrate:remote` if the release has new migrations, then `pnpm deploy`.

**Gotchas:**
- The combined `changesets/action@v2` skips tagging entirely if `publish-script` is unset. It also skips tagging whenever *any* changeset, even an empty one, is present on `main`. So a PR that has to trigger tagging of an already-bumped version must carry **no** changeset (that's why the fix for the 1.0.0 tag, PR #28, had none).
- This project uses **Changesets v3** (`@changesets/cli@3`) with **`changesets/action@v2`**. The v3 CLI renamed `changeset tag` to `changeset git-tag` and has `changeset publish-plan` (shows which versions would be tagged). Older docs/examples for CLI v2 / action v1 don't apply as-is.
- Single-package repo, so tags are `vX.Y.Z` (not `baby-sign@X.Y.Z`).
- Repo setting *Actions → General → "Allow GitHub Actions to create and approve pull requests"* must stay enabled, or the Version Packages PR can't be opened.

**Version in the app:** the version is injected at build time as `__APP_VERSION__` (`vite.config.ts` `define`, declared in `src/app.d.ts`), shown in `Footer.svelte` and used as the Sentry `release` (`baby-sign@X.Y.Z`) in `src/hooks.client.ts` and `src/instrumentation.server.ts`. Don't tie SvelteKit's `kit.version.name` to it: `src/service-worker.ts` keys caches on SvelteKit's per-build `version`, and tying that to semver would stop cache busting on deploys without a version bump.
