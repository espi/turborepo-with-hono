import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { CONSTANT } from '@repo/constants'
import { db, todosTable, usersTable } from '@repo/db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../../.env') })

const app = new Hono()
app.use('/*', cors())

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, 500, {
    'Access-Control-Allow-Origin': '*',
  })
})

app.get('/', (c) => {
  const message = process.env.HOMEPAGE_MESSAGE ?? CONSTANT
  return c.text(message)
})

app.get('/users', async (c) => {
  try {
    const users = await db.select().from(usersTable)
    return c.json(users)
  } catch (err) {
    console.error('GET /users error:', err)
    throw err
  }
})

app.get('/todos', async (c) => {
  try {
    const todos = await db.select().from(todosTable)
    return c.json(todos)
  } catch (err) {
    console.error('GET /todos error:', err)
    throw err
  }
})

app.post('/todos', async (c) => {
  try {
    const body = await c.req.json<{ title: string }>()
    if (!body?.title || typeof body.title !== 'string') {
      return c.json({ error: 'title is required' }, 400)
    }
    const result = await db.insert(todosTable).values({ title: body.title }).returning()
    const todo = result[0]
    if (!todo) {
      return c.json({ error: 'Insert failed' }, 500)
    }
    return c.json(todo)
  } catch (err) {
    console.error('POST /todos error:', err)
    return c.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      500
    )
  }
})

app.patch('/todos/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json<{ completed?: boolean }>()
    const [todo] = await db.update(todosTable).set({ completed: body.completed ?? false }).where(eq(todosTable.id, id)).returning()
    return c.json(todo)
  } catch (err) {
    console.error('PATCH /todos error:', err)
    throw err
  }
})

app.delete('/todos/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return c.json({ ok: true })
  } catch (err) {
    console.error('DELETE /todos error:', err)
    throw err
  }
})

serve(app)
export default app
