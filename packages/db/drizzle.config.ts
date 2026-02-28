import { config } from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '../../.env') })

// Use unpooled URL for migrations (push, migrate, generate, studio) - required for schema changes
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or DATABASE_URL_UNPOOLED is required')

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: { url: databaseUrl },
})
