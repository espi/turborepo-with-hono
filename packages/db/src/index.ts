import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as schema from './schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../../.env') })
config() // also load cwd .env (e.g. apps/api/.env)

const databaseUrl = process.env.DATABASE_URL
const isRemote =
  databaseUrl?.startsWith('libsql://') || databaseUrl?.startsWith('https://')

let db

if (isRemote && databaseUrl) {
  const { drizzle } = await import('drizzle-orm/libsql')
  db = drizzle({
    connection: {
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN,
    },
    schema,
  })
} else {
  const { drizzle } = await import('drizzle-orm/better-sqlite3')
  const Database = (await import('better-sqlite3')).default
  const defaultPath = path.resolve(__dirname, '..', 'local.db')
  const filePath = databaseUrl?.replace(/^file:/, '') ?? defaultPath
  const client = new Database(filePath)
  db = drizzle(client, { schema })
}

export { db }
export * from './schema.js'
