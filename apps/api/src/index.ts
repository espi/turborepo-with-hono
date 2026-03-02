import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { Effect } from 'effect'
import { effectValidator } from '@hono/effect-validator'
import { CONSTANT } from '@repo/constants'
import { db, todosTable, usersTable } from '@repo/db'
import { CreateTodoBody, UpdateTodoBody } from './schemas.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../../.env') })

function parseIdParam(id: string): number | null {
  const n = Number.parseInt(id, 10)
  return Number.isNaN(n) || n < 1 ? null : n
}

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
  const program = Effect.tryPromise({
    try: () => db.select().from(usersTable),
    catch: (e) => new Error(String(e)),
  })
  const users = await Effect.runPromise(program)
  return c.json(users)
})

app.get('/todos', async (c) => {
  const program = Effect.tryPromise({
    try: () => db.select().from(todosTable),
    catch: (e) => new Error(String(e)),
  })
  const todos = await Effect.runPromise(program)
  return c.json(todos)
})

app.post('/todos', effectValidator('json', CreateTodoBody), async (c) => {
  const body = c.req.valid('json')
  const program = Effect.tryPromise({
    try: () => db.insert(todosTable).values({ title: body.title }).returning(),
    catch: (e) => new Error(String(e)),
  })
  const result = await Effect.runPromise(program)
  const todo = result[0]
  if (!todo) {
    return c.json({ error: 'Insert failed' }, 500)
  }
  return c.json(todo)
})

app.patch('/todos/:id', effectValidator('json', UpdateTodoBody), async (c) => {
  const id = parseIdParam(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid id' }, 400)
  }
  const body = c.req.valid('json')
  const program = Effect.tryPromise({
    try: () =>
      db
        .update(todosTable)
        .set({ completed: body.completed ?? false })
        .where(eq(todosTable.id, id))
        .returning(),
    catch: (e) => new Error(String(e)),
  })
  const [todo] = await Effect.runPromise(program)
  if (!todo) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json(todo)
})

app.delete('/todos/:id', async (c) => {
  const id = parseIdParam(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid id' }, 400)
  }
  const program = Effect.tryPromise({
    try: () => db.delete(todosTable).where(eq(todosTable.id, id)),
    catch: (e) => new Error(String(e)),
  })
  await Effect.runPromise(program)
  return c.json({ ok: true })
})

serve(app)
export default app
