/// <reference types="./worker-configuration" />
/// <reference types="unplugin-icons/types/svelte" />
import type { Auth } from '$lib/server/auth'
import type { DrizzleClient } from '$lib/server/db'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
  /** The app's semver version from package.json, injected at build time by vite.config.ts. */
  const __APP_VERSION__: string

  namespace App {
    interface Platform {
      env: Env
      cf: CfProperties
      ctx: ExecutionContext
    }
    interface Locals {
      db: DrizzleClient
      auth: Auth
      session: Auth['$Infer']['Session']['session'] | undefined
      user: Auth['$Infer']['Session']['user'] | undefined
    }
  }
}

export {}
