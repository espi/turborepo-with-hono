import styles from './page.module.css'
import { TodoClient } from './components/TodoClient'

const API_URL = process.env.VERCEL
  ? 'https://hono-turborepo-api-demo.vercel.app'
  : 'http://localhost:3000'

export default function Home() {
  return (
    <div className={styles.page}>
      <TodoClient apiUrl={API_URL} />
      <footer className={styles.footer}>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  )
}
