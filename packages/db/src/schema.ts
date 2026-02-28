import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

export const todosTable = sqliteTable('todos', {
  id: int('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: int('completed', { mode: 'boolean' }).default(false),
})
