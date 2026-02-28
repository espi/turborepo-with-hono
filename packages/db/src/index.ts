import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultPath = path.resolve(__dirname, '..', 'local.db')
const url = process.env.DATABASE_URL?.replace(/^file:/, '') ?? defaultPath

const client = new Database(url)
export const db = drizzle(client, { schema })
export * from './schema.js'
