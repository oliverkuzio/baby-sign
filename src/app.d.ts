/// <reference types="./worker-configuration" />
import type { Auth } from '$lib/server/auth'
import type { DrizzleClient } from '$lib/server/db'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
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
