import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function HtmlValidator() {
  const [html, setHtml] = useState('')

  function validateHtml(input) {
    if (!input) return []
    const issues = []

    // Basic validation checks
    const openTags = input.match(/<(\w+)[^>]*>/g) || []
    const closeTags = input.match(/<\/(\w+)>/g) || []
    
    // Check for unclosed tags
    const tagStack = []
    const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link']
    
    openTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)[1].toLowerCase()
      if (!selfClosing.includes(tagName)) {
        tagStack.push(tagName)
      }
    })

    closeTags.forEach(tag => {
      const tagName = tag.match(/<\/(\w+)>/)[1].toLowerCase()
      const lastOpen = tagStack.pop()
      if (lastOpen !== tagName) {
        issues.push({ type: 'error', message: `Mismatched closing tag: expected </${lastOpen}>, found </${tagName}>` })
      }
    })

    if (tagStack.length > 0) {
      tagStack.forEach(tag => {
        issues.push({ type: 'error', message: `Unclosed tag: <${tag}>` })
      })
    }

    // Check for missing DOCTYPE
    if (!input.includes('<!DOCTYPE') && !input.includes('<!doctype')) {
      issues.push({ type: 'warning', message: 'Missing <!DOCTYPE html> declaration' })
    }

    // Check for duplicate IDs
    const ids = input.match(/id=["']([^"']+)["']/g) || []
    const idValues = ids.map(id => id.match(/id=["']([^"']+)["']/)[1])
    const duplicates = idValues.filter((id, i) => idValues.indexOf(id) !== i)
    if (duplicates.length > 0) {
      duplicates.forEach(id => {
        issues.push({ type: 'error', message: `Duplicate ID: "${id}"` })
      })
    }

    // Check for inline styles
    const inlineStyles = input.match(/style=["'][^"']+["']/g) || []
    if (inlineStyles.length > 3) {
      issues.push({ type: 'info', message: `${inlineStyles.length} inline styles found — consider moving to CSS` })
    }

    return issues
  }

  const issues = validateHtml(html)
  const errors = issues.filter(i => i.type === 'error').length
  const warnings = issues.filter(i => i.type === 'warning').length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTML Validator</h1>
      <p className="tool-description">Validate HTML for common errors, unclosed tags, duplicate IDs, and best practices.</p>

      <label htmlFor="html-input">HTML Code</label>
      <textarea 
        id="html-input"
        value={html} 
        onChange={e => setHtml(e.target.value)} 
        placeholder="Paste your HTML here..."
        rows={15}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {html && (
        <div style={{ marginTop: '1.5rem' }}>
          {issues.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              ✓ No issues found — HTML looks valid
            </div>
          ) : (
            <>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{issues.length}</div>
                  <div className="stat-label">Total issues</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--error)' }}>{errors}</div>
                  <div className="stat-label">Errors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--warning)' }}>{warnings}</div>
                  <div className="stat-label">Warnings</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3>Validation Issues</h3>
                {issues.map((issue, i) => (
                  <div key={i} style={{ 
                    padding: '0.75rem 1rem', 
                    background: issue.type === 'error' ? 'var(--error-bg)' : issue.type === 'warning' ? 'var(--warning-bg)' : 'var(--bg-secondary)',
                    borderLeft: `4px solid ${issue.type === 'error' ? 'var(--error)' : issue.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{issue.type}</strong>
                    <div>{issue.message}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/html-validator" />
      <ToolSeo />
    </div>
  )
}
