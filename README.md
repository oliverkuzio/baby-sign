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

## Releases

The app is versioned with [semantic versioning](https://semver.org) (`MAJOR.MINOR.PATCH`) using [Changesets](https://changesets.dev). Release notes for every version are in [CHANGELOG.md](CHANGELOG.md) and on the [GitHub Releases](https://github.com/oliverkuzio/baby-sign/releases) page.

**Never edit `version` in `package.json` or `CHANGELOG.md` by hand.** Both are written by the release workflow from the changesets in each PR.

### Choosing the version bump

| Bump | When | Example |
| --- | --- | --- |
| `patch` (1.0.0 → 1.0.1) | Bug fixes and small tweaks that add no new functionality | Fixing a broken tag filter link, correcting a typo in the UI |
| `minor` (1.0.0 → 1.1.0) | New features or user-visible additions that don't break anything existing | A new search page, a new field on songs |
| `major` (1.0.0 → 2.0.0) | Breaking changes: removing or renaming routes or features, or changes that invalidate existing links, data or installed PWAs | Moving `/words` to a new URL, dropping favourites |
| empty (no release) | Nothing user-facing | Docs, CI, dependency bumps with no visible effect, internal refactors |

If a release contains several changesets, the version moves by the largest bump among them. For example, three `patch` changesets and one `minor` changeset give 1.0.0 → 1.1.0.

### 1. Add a changeset to every PR

On your feature or fix branch, before opening the PR:

```bash
pnpm changeset          # choose patch / minor / major, then write the changelog entry
pnpm changeset --empty  # for PRs with nothing user-facing (docs, CI, refactors)
```

This creates a file like `.changeset/brave-dogs-sing.md`. Commit it with the rest of your changes:

```md
---
"baby-sign": minor
---

Add a search page for finding words, phrases and songs by name.
```

- Write the description for the people using the app, not for developers. It's copied into `CHANGELOG.md` and the GitHub Release word for word, with a link to the PR and its author.
- You can edit the file afterwards, or add more than one changeset to a PR if it contains separate changes worth listing separately.
- The **Lint** workflow fails any PR without a changeset (`pnpm changeset status --since=origin/main`). The bot's own Version Packages PR is exempt.

### 2. Merge PRs into `main`

On every push to `main`, the **Release** workflow ([.github/workflows/release.yml](.github/workflows/release.yml)) runs and opens or updates a PR titled **"Version Packages"** (branch `changeset-release/main`). That PR:

- bumps `version` in `package.json` to the next version,
- adds the new version's entries at the top of `CHANGELOG.md`,
- deletes the changeset files it has used.

The PR updates itself as more PRs are merged, so you can merge several PRs and release them together. Empty changesets don't open a Version Packages PR on their own.

### 3. Release by merging the Version Packages PR

When you're ready to ship, review the Version Packages PR: check that the version number is the one you expect and that the changelog reads well. To change the wording, edit `CHANGELOG.md` on the `changeset-release/main` branch, or edit the original changeset on `main`. The bot rebuilds the PR either way.

Merge it. The Release workflow then runs `pnpm changeset publish`, which (because the package is private) publishes nothing to npm. Instead it:

- creates and pushes the git tag `vX.Y.Z`,
- creates a GitHub Release for that tag, with the changelog entries as its notes.

Check that it worked:

```bash
git checkout main && git pull
gh release view vX.Y.Z
```

### 4. Deploy

Releasing doesn't deploy anything. Deploy from an up-to-date `main`:

```bash
git checkout main && git pull
pnpm db:migrate:remote   # only if the release includes new migrations in drizzle/
pnpm deploy
```

Then open the live site and check that the footer shows the new version. The same version is reported to Sentry as the release (`baby-sign@X.Y.Z`), so errors can be traced back to the version that caused them.

### Urgent fixes

Hotfixes follow the same steps with a `patch` changeset: open the fix PR into `main`, merge it, merge the Version Packages PR straight away, then deploy. If other unreleased changes are already waiting in the Version Packages PR, they ship in the same release.

### Troubleshooting

- **No Version Packages PR appears:** check that the merged PR included a non-empty changeset, and that *Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"* is turned on.
- **Version PR merged but no tag or GitHub Release:** look at the Release workflow run's "Version PR or tag release" step. The step only tags when no changesets at all are left on `main` (not even empty ones) and `publish-script` is set in [.github/workflows/release.yml](.github/workflows/release.yml). `pnpm changeset publish-plan` shows locally which version would be tagged.
