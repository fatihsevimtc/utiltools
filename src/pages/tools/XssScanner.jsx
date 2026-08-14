import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function XssScanner() {
  const [input, setInput] = useState('')

  const xssPatterns = [
    { pattern: /<script\b[^>]*>.*?<\/script>/gi, name: 'Script tags', severity: 'High' },
    { pattern: /javascript:/gi, name: 'javascript: protocol', severity: 'High' },
    { pattern: /on\w+\s*=\s*["'][^"']*["']/gi, name: 'Event handlers (onclick, onerror, etc.)', severity: 'High' },
    { pattern: /<iframe\b[^>]*>/gi, name: 'Iframe injection', severity: 'Medium' },
    { pattern: /<embed\b[^>]*>/gi, name: 'Embed tags', severity: 'Medium' },
    { pattern: /<object\b[^>]*>/gi, name: 'Object tags', severity: 'Medium' },
    { pattern: /eval\s*\(/gi, name: 'eval() function', severity: 'High' },
    { pattern: /document\.cookie/gi, name: 'Cookie access', severity: 'Medium' },
    { pattern: /document\.write/gi, name: 'document.write', severity: 'Medium' },
    { pattern: /window\.location/gi, name: 'Location manipulation', severity: 'Medium' },
  ]

  function scanForXss() {
    if (!input) return []
    
    const findings = []
    xssPatterns.forEach(({ pattern, name, severity }) => {
      const matches = input.match(pattern)
      if (matches) {
        findings.push({
          name,
          severity,
          count: matches.length,
          examples: matches.slice(0, 3)
        })
      }
    })

    return findings
  }

  const vulnerabilities = scanForXss()
  const highRisk = vulnerabilities.filter(v => v.severity === 'High').length
  const mediumRisk = vulnerabilities.filter(v => v.severity === 'Medium').length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>XSS Vulnerability Scanner</h1>
      <p className="tool-description">Scan HTML/JavaScript code for common Cross-Site Scripting (XSS) patterns and vulnerabilities.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ Educational Tool</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This is a basic pattern matcher for learning. For production security audits, use professional tools like OWASP ZAP or Burp Suite.
        </p>
      </div>

      <label htmlFor="xss-input">HTML/JavaScript Code to Scan</label>
      <textarea 
        id="xss-input"
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Paste HTML or JavaScript code here..."
        rows={12}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {input && (
        <div style={{ marginTop: '1.5rem' }}>
          {vulnerabilities.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              ✓ No XSS patterns detected
            </div>
          ) : (
            <>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{vulnerabilities.length}</div>
                  <div className="stat-label">Potential issues</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--error)' }}>{highRisk}</div>
                  <div className="stat-label">High risk</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--warning)' }}>{mediumRisk}</div>
                  <div className="stat-label">Medium risk</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3>Vulnerabilities Found</h3>
                {vulnerabilities.map((v, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    background: v.severity === 'High' ? 'var(--error-bg)' : 'var(--warning-bg)', 
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    border: `1px solid ${v.severity === 'High' ? 'var(--error)' : 'var(--warning)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{v.name}</strong>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        background: v.severity === 'High' ? 'var(--error)' : 'var(--warning)',
                        color: 'white'
                      }}>
                        {v.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                      Found {v.count} occurrence{v.count !== 1 ? 's' : ''}
                    </div>
                    <details style={{ marginTop: '0.5rem' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '0.875rem' }}>View examples</summary>
                      <pre style={{ 
                        marginTop: '0.5rem', 
                        padding: '0.5rem', 
                        background: 'var(--bg-tertiary)', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.75rem'
                      }}>
                        {v.examples.join('\n')}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/xss-scanner" />
      <ToolSeo />
    </div>
  )
}
