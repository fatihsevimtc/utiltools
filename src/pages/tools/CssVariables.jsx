import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

function extractFromSheets() {
  const vars = {}
  try {
    for (const sheet of document.styleSheets) {
      let rules
      try { rules = sheet.cssRules || sheet.rules } catch { continue }
      for (const rule of rules) {
        if (!rule.style) continue
        for (const prop of rule.style) {
          if (prop.startsWith('--')) vars[prop] = rule.style.getPropertyValue(prop).trim()
        }
      }
    }
  } catch {}
  return vars
}

function extractFromText(css) {
  const vars = {}
  const re = /(--[\w-]+)\s*:\s*([^;}\n]+)/g
  let m
  while ((m = re.exec(css)) !== null) vars[m[1]] = m[2].trim()
  return vars
}

export default function CssVariables() {
  const [liveVars, setLiveVars] = useState({})
  const [pastedCss, setPastedCss] = useState('')
  const [pastedVars, setPastedVars] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => { setLiveVars(extractFromSheets()) }, [])

  useEffect(() => {
    if (pastedCss) setPastedVars(extractFromText(pastedCss))
    else setPastedVars({})
  }, [pastedCss])

  const allVars = { ...liveVars, ...pastedVars }
  const q = search.toLowerCase()
  const filtered = Object.entries(allVars).filter(([k, v]) => !q || k.includes(q) || v.toLowerCase().includes(q))

  return (
    <div className="tool-page">
      <BackBar />
      <h1>CSS Variables Inspector</h1>
      <p className="tool-description">Extract and inspect CSS custom property (variable) declarations from stylesheets or pasted CSS.</p>

      <label htmlFor="css-paste">Paste CSS to extract variables (optional)</label>
      <textarea
        id="css-paste"
        value={pastedCss}
        onChange={e => setPastedCss(e.target.value)}
        placeholder={':root {\n  --primary: #6366f1;\n  --spacing: 1rem;\n}'}
        style={{ minHeight: 120, fontFamily: 'monospace' }}
      />

      <label htmlFor="var-search" style={{ marginTop: '1rem' }}>Search variables</label>
      <input
        id="var-search"
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="--primary or #fff"
        style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
      />

      {filtered.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface2, #f0f0f0)' }}>
                <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>Variable</th>
                <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(([name, val]) => (
                <tr key={name}>
                  <td style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--border, #ddd)', color: 'var(--accent, #6366f1)' }}>{name}</td>
                  <td style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>
                    {/^#[0-9a-fA-F]{3,8}$/.test(val.trim()) && (
                      <span style={{ display: 'inline-block', width: 14, height: 14, background: val.trim(), borderRadius: 3, border: '1px solid #ccc', marginRight: 6, verticalAlign: 'middle' }} />
                    )}
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>{filtered.length} variable{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      ) : (
        <p style={{ opacity: 0.6 }}>{search ? 'No matching variables.' : 'No CSS custom properties found on this page. Paste CSS above to inspect.'}</p>
      )}
    </div>
  )
}
