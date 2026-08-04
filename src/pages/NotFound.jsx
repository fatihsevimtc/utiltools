import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p style={{ fontSize: '4rem' }}>🔍</p>
      <h1 style={{ margin: '1rem 0 0.5rem' }}>404 — Page not found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        That page doesn't exist.
      </p>
      <Link to="/" className="btn">Back to tools</Link>
    </div>
  )
}
