import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

export default function About() {
  return (
    <div style={{ maxWidth: 660 }}>
      <BackBar />
      <h1 style={{ marginBottom: '1rem' }}>About UtilTools</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        UtilTools is a collection of small, focused utilities for everyday text and developer tasks.
        No accounts, no ads, no tracking — just tools that work.
      </p>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        Every tool runs 100% in your browser. Nothing you type or paste is ever sent to a server.
      </p>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        If there's a tool you'd like to see added, use the{' '}
        <Link to="/suggest">suggestion form</Link> — ideas do get built.
      </p>
      <Link to="/" className="btn">Browse all tools</Link>
    </div>
  )
}
