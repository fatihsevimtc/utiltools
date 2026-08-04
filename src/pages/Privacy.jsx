import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

export default function Privacy() {
  return (
    <div style={{ maxWidth: 660 }}>
      <BackBar />
      <h1 style={{ marginBottom: '1rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        <strong style={{ color: 'var(--text)' }}>We never upload your data.</strong> All text,
        files and inputs you provide are processed entirely inside your browser using JavaScript.
        Nothing is sent to any server.
      </p>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        UtilTools does not use cookies, does not collect analytics, and does not store anything
        about your session. There are no accounts and no login.
      </p>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        The only network requests made are to load the initial page assets (HTML, CSS, JS) from
        the hosting CDN. After that, the app is fully offline-capable.
      </p>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Last updated: August 2026
      </p>
      <Link to="/" className="btn btn-ghost">Back to tools</Link>
    </div>
  )
}
