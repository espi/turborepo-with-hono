import { Schema } from 'effect'

export const TodoTypeSchema = Schema.Literal('work', 'personal')

export const CreateTodoBody = Schema.Struct({
  title: Schema.NonEmptyTrimmedString,
  type: Schema.optional(TodoTypeSchema, { default: () => 'personal' as const }),
})

export const UpdateTodoBody = Schema.Struct({
  completed: Schema.optional(Schema.Boolean),
  type: Schema.optional(TodoTypeSchema),
})
