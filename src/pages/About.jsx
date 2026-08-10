import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

export default function About() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <BackBar />
      <h1 style={{ marginBottom: '0.75rem' }}>About UtilTools</h1>

      <p style={{ color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.7 }}>
        UtilTools is a growing collection of small, focused utilities for developers, writers, and
        creators. No accounts, no ads, no tracking — just tools that work.
      </p>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Every tool runs <strong>100% in your browser</strong>. Nothing you type, paste, or upload
        is ever sent to a server. Your data stays on your device.
      </p>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          ['179+', 'Tools available'],
          ['10', 'Categories'],
          ['0', 'Server requests'],
          ['Free', 'Always'],
        ].map(([val, label]) => (
          <div key={label} style={{ flex: '1 1 120px', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Open source */}
      <div style={{ padding: '1.25rem 1.4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>🌐 Open Source</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '0.85rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
          UtilTools is open source and welcomes contributions. Whether you want to add a new tool,
          fix a bug, improve an existing tool, or suggest an idea — all contributions are welcome.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/fatihsevimtc/utiltools"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            ⭐ Star on GitHub
          </a>
          <a
            href="https://github.com/fatihsevimtc/utiltools/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            🍴 Fork the repo
          </a>
        </div>
      </div>

      {/* How to contribute */}
      <div style={{ padding: '1.25rem 1.4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>🛠️ How to contribute a tool</h2>
        <ol style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 2, fontSize: '0.9rem' }}>
          <li>Fork the repository and clone it locally</li>
          <li>Create <code style={{ background: 'var(--bg)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.82rem' }}>src/pages/tools/YourTool.jsx</code> — use <code style={{ background: 'var(--bg)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.82rem' }}>WordCounter.jsx</code> as a template</li>
          <li>Register the route in <code style={{ background: 'var(--bg)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.82rem' }}>src/App.jsx</code></li>
          <li>Add it to <code style={{ background: 'var(--bg)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.82rem' }}>src/toolCategories.js</code> and <code style={{ background: 'var(--bg)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.82rem' }}>src/pages/Home.jsx</code></li>
          <li>Open a pull request — title format: <em>feat: add [Tool Name]</em></li>
        </ol>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          Full contributing guide: <a href="https://github.com/fatihsevimtc/utiltools/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>CONTRIBUTING.md</a>
        </p>
      </div>

      {/* Ground rules */}
      <div style={{ padding: '1.25rem 1.4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>📋 Contribution guidelines</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 2, fontSize: '0.9rem' }}>
          <li>Tools must run <strong>100% in the browser</strong> — no sending user data to external servers</li>
          <li>Keep dependencies minimal — prefer native browser APIs (Web Crypto, Canvas, Web Audio)</li>
          <li>One tool per pull request to keep review fast and focused</li>
          <li>Use CSS variables for theming — no hardcoded hex colours</li>
          <li>Plain JSX only — no TypeScript</li>
        </ul>
      </div>

      {/* Suggest / contact */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <Link to="/suggest" className="btn">💡 Suggest a tool</Link>
        <Link to="/" className="btn btn-ghost">Browse all tools</Link>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
        Built with React + Vite. Hosted on Netlify. No cookies, no analytics, no third-party scripts.
      </p>
    </div>
  )
}
