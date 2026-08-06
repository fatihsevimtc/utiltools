import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

function flattenPaths(obj, prefix = '') {
  const result = {}
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenPaths(val, path))
    } else {
      result[path] = JSON.stringify(val)
    }
  }
  return result
}

export default function JsonDiff() {
  const [left, setLeft]   = useState('')
  const [right, setRight] = useState('')

  const diff = useMemo(() => {
    if (!left.trim() || !right.trim()) return null
    let lObj, rObj
    try { lObj = JSON.parse(left) } catch { return { error: 'Left JSON is invalid' } }
    try { rObj = JSON.parse(right) } catch { return { error: 'Right JSON is invalid' } }

    const lFlat = flattenPaths(lObj)
    const rFlat = flattenPaths(rObj)
    const allKeys = new Set([...Object.keys(lFlat), ...Object.keys(rFlat)])
    const changes = []

    for (const key of [...allKeys].sort()) {
      const lVal = lFlat[key]
      const rVal = rFlat[key]
      if (lVal === undefined) changes.push({ key, type: 'added',   lVal: '', rVal })
      else if (rVal === undefined) changes.push({ key, type: 'removed', lVal, rVal: '' })
      else if (lVal !== rVal) changes.push({ key, type: 'changed', lVal, rVal })
    }

    return { changes }
  }, [left, right])

  const typeColor = { added: 'var(--success)', removed: 'var(--danger)', changed: 'var(--warning)' }
  const typeLabel = { added: '+ Added', removed: '- Removed', changed: '≠ Changed' }

  return (
    <div className="tool-page" style={{ maxWidth: 1000 }}>
      <BackBar />
      <h1>JSON Diff</h1>
      <p className="tool-description">Compare two JSON objects structurally and see exactly which keys were added, removed, or changed.</p>

      <div className="diff-grid" style={{ marginBottom: '1rem' }}>
        <div>
          <label htmlFor="jd-left">JSON A (original)</label>
          <textarea id="jd-left" value={left} onChange={e => setLeft(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'} style={{ minHeight: 200, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label htmlFor="jd-right">JSON B (modified)</label>
          <textarea id="jd-right" value={right} onChange={e => setRight(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 31,\n  "city": "NYC"\n}'} style={{ minHeight: 200, fontFamily: 'monospace' }} />
        </div>
      </div>

      {diff?.error && (
        <div className="notice notice-error">{diff.error}</div>
      )}

      {diff?.changes && (
        <>
          <div className="stats-row" style={{ marginBottom: '1rem' }}>
            {['added','removed','changed'].map(type => {
              const count = diff.changes.filter(c => c.type === type).length
              return (
                <div key={type} className="stat-card">
                  <div className="stat-value" style={{ color: typeColor[type] }}>{count}</div>
                  <div className="stat-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                </div>
              )
            })}
            <div className="stat-card">
              <div className="stat-value">{diff.changes.length}</div>
              <div className="stat-label">Total differences</div>
            </div>
          </div>

          {diff.changes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--success)' }}>
              <p style={{ fontSize: '1.5rem' }}>✓</p>
              <p>No differences — the two JSON objects are identical.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {diff.changes.map((c, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${typeColor[c.type]}`, borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <code style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{c.key}</code>
                    <span style={{ fontSize: '0.75rem', color: typeColor[c.type], fontWeight: 600 }}>{typeLabel[c.type]}</span>
                  </div>
                  {c.type === 'changed' && (
                    <div style={{ fontSize: '0.82rem', display: 'grid', gap: '0.2rem' }}>
                      <div><span style={{ color: 'var(--danger)' }}>− </span><span style={{ color: 'var(--muted)' }}>{c.lVal}</span></div>
                      <div><span style={{ color: 'var(--success)' }}>+ </span><span style={{ color: 'var(--muted)' }}>{c.rVal}</span></div>
                    </div>
                  )}
                  {c.type === 'added'   && <div style={{ fontSize: '0.82rem', color: 'var(--success)' }}>+ {c.rVal}</div>}
                  {c.type === 'removed' && <div style={{ fontSize: '0.82rem', color: 'var(--danger)'  }}>− {c.lVal}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
