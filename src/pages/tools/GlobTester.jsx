import { useState } from 'react'
import BackBar from '../../components/BackBar'

function globToRegex(glob) {
  // Handle {a,b} alternatives
  let pattern = glob.replace(/\{([^}]+)\}/g, (_, alts) => `(${alts.split(',').map(escLiteral).join('|')})`)
  // Now handle ** before * to avoid double-processing
  const parts = pattern.split('**')
  const processed = parts.map(part =>
    part
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape special chars (already handled {})
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
  ).join('.*')
  return new RegExp(`^${processed}$`)
}

function escLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchGlob(path, glob) {
  try {
    return globToRegex(glob).test(path)
  } catch {
    return false
  }
}

export default function GlobTester() {
  const [paths, setPaths] = useState('')
  const [glob, setGlob] = useState('')

  const lines = paths.split('\n').map(l => l.trim()).filter(Boolean)
  const results = glob ? lines.map(p => ({ path: p, match: matchGlob(p, glob) })) : []

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Glob Tester</h1>
      <p className="tool-description">Test glob patterns against file path lists — supports *, **, ?, and {'{'}a,b{'}'} syntax.</p>

      <label htmlFor="glob-pattern">Glob pattern</label>
      <input
        id="glob-pattern"
        type="text"
        value={glob}
        onChange={e => setGlob(e.target.value)}
        placeholder="src/**/*.{js,jsx}"
        style={{ fontFamily: 'monospace', fontSize: '1rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
      />

      <label htmlFor="glob-paths">File paths (one per line)</label>
      <textarea
        id="glob-paths"
        value={paths}
        onChange={e => setPaths(e.target.value)}
        placeholder={'src/index.js\nsrc/app.jsx\nlib/utils.ts\nREADME.md'}
        style={{ minHeight: 140, fontFamily: 'monospace' }}
      />

      {results.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <label>Results</label>
          <div className="code-block" style={{ whiteSpace: 'pre', lineHeight: 1.8 }}>
            {results.map(r => `${r.match ? '✓' : '✗'} ${r.path}`).join('\n')}
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
            {results.filter(r => r.match).length} / {results.length} paths matched
          </p>
        </div>
      )}
    </div>
  )
}
