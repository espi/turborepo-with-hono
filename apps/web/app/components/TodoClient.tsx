'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from '../page.module.css'

type Todo = {
  id: number
  title: string
  completed: boolean
}

export function TodoClient({ apiUrl }: { apiUrl: string }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')

  const fetchTodos = useCallback(async () => {
    const res = await fetch(`${apiUrl}/todos`)
    const data = await res.json()
    setTodos(data)
  }, [apiUrl])

  useEffect(() => {
    fetchTodos().finally(() => setLoading(false))
  }, [fetchTodos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const res = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: inputValue.trim() }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      alert(err.error ?? 'Failed to add todo')
      return
    }
    setInputValue('')
    await fetchTodos()
  }

  const handleToggle = async (todo: Todo) => {
    await fetch(`${apiUrl}/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    await fetchTodos()
  }

  const handleDelete = async (id: number) => {
    await fetch(`${apiUrl}/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
  }

  return (
    <div className={styles.main}>
      <h1>Todos</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a todo..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(var(--gray-rgb), 0.2)',
            fontFamily: 'var(--font-geist-sans)',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 20px',
            background: 'var(--foreground)',
            color: 'var(--background)',
            border: 'none',
            borderRadius: 128,
            fontFamily: 'var(--font-geist-sans)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </form>
      <div className={styles.result}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(var(--gray-rgb), 0.1)',
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.6 : 1,
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  className={styles.secondary}
                  style={{ padding: '4px 12px', fontSize: 14 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
