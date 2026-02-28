import styles from './page.module.css'
import { TodoClient } from './components/TodoClient'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.VERCEL ? '' : 'http://localhost:3000')
)
  .trim()
  .replace(/\/$/, '') // remove trailing slash to avoid // when appending paths

export default async function Home() {
  const homepageMessage = API_URL
    ? await fetch(API_URL)
        .then((res) => res.text())
        .catch(() => null)
    : null

  return (
    <div className={styles.page}>
      {homepageMessage && (
        <p className={styles.result} style={{ marginBottom: 16 }}>
          {homepageMessage}
        </p>
      )}
      {API_URL ? (
        <TodoClient apiUrl={API_URL} />
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>
          Set <code>NEXT_PUBLIC_API_URL</code> in your Vercel project to connect
          to the API.
        </p>
      )}
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
