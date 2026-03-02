import { Schema } from 'effect'

export const CreateTodoBody = Schema.Struct({
  title: Schema.NonEmptyTrimmedString,
})

export const UpdateTodoBody = Schema.Struct({
  completed: Schema.optional(Schema.Boolean),
})
