import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function FilterUnusedCss() {
  const [css, setCss] = useState('')
  const [html, setHtml] = useState('')

  function findUsedSelectors() {
    if (!css || !html) return { used: '', unused: '', stats: null }

    try {
      // Simple regex to extract selectors from CSS
      const rules = css.match(/([^{}]+)\s*{[^}]*}/g) || []
      const used = []
      const unused = []

      rules.forEach(rule => {
        const match = rule.match(/([^{]+){/)
        if (!match) return
        
        const selector = match[1].trim()
        
        // Check if selector appears in HTML
        const isUsed = html.includes(selector.replace(/^\./, '').replace(/#/, '').split(/[\s>+~:]/)[0])
        
        if (isUsed) {
          used.push(rule)
        } else {
          unused.push(rule)
        }
      })

      return {
        used: used.join('\n\n'),
        unused: unused.join('\n\n'),
        stats: {
          total: rules.length,
          used: used.length,
          unused: unused.length,
          reduction: Math.round((unused.length / rules.length) * 100)
        }
      }
    } catch (err) {
      console.error(err)
      return { used: '', unused: '', stats: null }
    }
  }

  const { used, unused, stats } = findUsedSelectors()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Filter Unused CSS</h1>
      <p className="tool-description">Find and remove unused CSS rules by comparing your CSS against HTML content.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ Simple Detection</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This tool uses basic string matching. For production use, consider tools like PurgeCSS or UnCSS.
        </p>
      </div>

      <label htmlFor="css-input">CSS Code</label>
      <textarea 
        id="css-input"
        value={css} 
        onChange={e => setCss(e.target.value)} 
        placeholder="Paste your CSS here..."
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      <label htmlFor="html-input">HTML Content</label>
      <textarea 
        id="html-input"
        value={html} 
        onChange={e => setHtml(e.target.value)} 
        placeholder="Paste your HTML here..."
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {stats && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total rules</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.used}</div>
              <div className="stat-label">Used</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--error)' }}>{stats.unused}</div>
              <div className="stat-label">Unused</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.reduction}%</div>
              <div className="stat-label">Can be removed</div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>Used CSS (Keep)</h3>
            <textarea 
              value={used} 
              readOnly
              rows={10}
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            <button onClick={() => navigator.clipboard.writeText(used)} style={{ marginTop: '0.5rem' }}>
              Copy Used CSS
            </button>
          </div>

          {unused && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Unused CSS (Remove)</h3>
              <textarea 
                value={unused} 
                readOnly
                rows={10}
                style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: 'var(--error-bg)' }}
              />
            </div>
          )}
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/filter-unused-css" />
      <ToolSeo />
    </div>
  )
}
