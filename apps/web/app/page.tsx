import styles from './page.module.css'
import { TodoClient } from './components/TodoClient'

const API_URL = process.env.VERCEL
  ? 'https://hono-turborepo-api-demo.vercel.app'
  : 'http://localhost:3000'

export default async function Home() {
  const homepageMessage = await fetch(API_URL)
    .then((res) => res.text())
    .catch(() => null)

  return (
    <div className={styles.page}>
      {homepageMessage && (
        <p className={styles.result} style={{ marginBottom: 16 }}>
          {homepageMessage}
        </p>
      )}
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
