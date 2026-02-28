import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { CONSTANT } from '@repo/constants'
import { db, usersTable } from '@repo/db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../../.env') })

const app = new Hono()

app.get('/', (c) => {
  const message = process.env.HOMEPAGE_MESSAGE ?? CONSTANT
  return c.text(message)
})

app.get('/users', async (c) => {
  const users = await db.select().from(usersTable)
  return c.json(users)
})

serve(app)
export default app
