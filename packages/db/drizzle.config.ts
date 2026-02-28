import { config } from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

// Load .env from root or packages/db (pnpm filter may set cwd to either)
config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '../../.env') })

const databaseUrl = (process.env.DATABASE_URL ?? './local.db').trim()
const isTurso =
  databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('https://')

const authToken = (
  process.env.TURSO_AUTH_TOKEN ??
  process.env.TURSO_DB_AUTH_TOKEN ??
  process.env.DATABASE_AUTH_TOKEN ??
  ''
).trim()

export default defineConfig({
  dialect: isTurso ? 'turso' : 'sqlite',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: isTurso
    ? {
        url: databaseUrl,
        authToken,
      }
    : { url: databaseUrl },
})
