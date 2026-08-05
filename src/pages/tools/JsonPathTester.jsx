import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

/**
 * Minimal JSONPath evaluator supporting:
 *   $.key, $.a.b.c, $.array[0], $.array[*], $..key (deep)
 */
function jsonPath(obj, path) {
  if (path === '$' || path === '') return [obj]

  const steps = tokenize(path)
  let current = [obj]

  for (const step of steps) {
    const next = []
    for (const node of current) {
      if (step.type === 'key') {
        if (node && typeof node === 'object' && !Array.isArray(node) && step.value in node) {
          next.push(node[step.value])
        }
      } else if (step.type === 'index') {
        if (Array.isArray(node)) {
          const idx = step.value === '*' ? null : parseInt(step.value)
          if (idx === null) {
            next.push(...node)
          } else if (idx >= 0 && idx < node.length) {
            next.push(node[idx])
          }
        }
      } else if (step.type === 'wild') {
        if (node && typeof node === 'object') {
          next.push(...Object.values(node))
        }
      } else if (step.type === 'deep') {
        // Depth-first collect all matching keys
        deepCollect(node, step.value, next)
      }
    }
    current = next
  }

  return current
}

function deepCollect(node, key, results) {
  if (node === null || typeof node !== 'object') return
  if (key === '*') {
    results.push(...Object.values(node))
  } else if (key in node) {
    results.push(node[key])
  }
  for (const child of Object.values(node)) {
    deepCollect(child, key, results)
  }
}

function tokenize(path) {
  const steps = []
  // Remove leading $
  let p = path.replace(/^\$\.?/, '')
  while (p.length > 0) {
    // Deep scan ..key
    if (p.startsWith('..')) {
      p = p.slice(2)
      const m = p.match(/^([^.[]+)/)
      if (m) { steps.push({ type: 'deep', value: m[1] }); p = p.slice(m[1].length) }
      continue
    }
    // Wildcard *
    if (p.startsWith('*.') || p === '*') {
      steps.push({ type: 'wild' }); p = p.slice(1).replace(/^\./, ''); continue
    }
    // Array index [0] or [*]
    if (p.startsWith('[')) {
      const m = p.match(/^\[([^\]]+)\]/)
      if (m) { steps.push({ type: 'index', value: m[1] }); p = p.slice(m[0].length).replace(/^\./, ''); continue }
    }
    // Dot-key
    const m = p.match(/^([^.[*]+)/)
    if (m) {
      steps.push({ type: 'key', value: m[1] })
      p = p.slice(m[1].length).replace(/^\./, '')
    } else {
      break
    }
  }
  return steps
}

const SAMPLE = `{
  "store": {
    "books": [
      {"title": "Clean Code", "author": "Martin", "price": 29.99},
      {"title": "DDIA", "author": "Kleppmann", "price": 49.99},
      {"title": "SICP", "author": "Abelson", "price": 34.99}
    ],
    "name": "Tech Books"
  }
}`

export default function JsonPathTester() {
  const [json, setJson] = useState(SAMPLE)
  const [path, setPath] = useState('$.store.books[*].title')
  const [parseError, setParseError] = useState('')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json)
      setParseError('')
      return jsonPath(parsed, path.trim())
    } catch (e) {
      setParseError(e.message)
      return []
    }
  }, [json, path])

  const output = JSON.stringify(result, null, 2)

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON Path Tester</h1>
      <p className="tool-description">Query JSON using JSONPath expressions — supports dot notation, array indexing, wildcards, and deep scan.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="jp-json">JSON</label>
          <textarea
            id="jp-json"
            value={json}
            onChange={e => setJson(e.target.value)}
            style={{ minHeight: 240, fontFamily: 'monospace', fontSize: '0.82rem' }}
          />
          {parseError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠ {parseError}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="jp-path">JSONPath expression</label>
          <input
            id="jp-path"
            type="text"
            value={path}
            onChange={e => setPath(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>
              Result <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>({result.length} match{result.length !== 1 ? 'es' : ''})</span>
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '0.82rem' }}>{output}</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
        <strong>Syntax:</strong> <code>$</code> root &nbsp;·&nbsp; <code>.key</code> child &nbsp;·&nbsp; <code>[0]</code> index &nbsp;·&nbsp; <code>[*]</code> all items &nbsp;·&nbsp; <code>..key</code> deep scan
      </div>
    </div>
  )
}
