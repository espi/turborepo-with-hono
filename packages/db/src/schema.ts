import { pgTable, serial, text, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const todoTypeEnum = pgEnum('todo_type', ['work', 'personal'])

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: todoTypeEnum('type').notNull().default('personal'),
  completed: boolean('completed').default(false),
})
