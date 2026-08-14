import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function AccessibilityChecker() {
  const [html, setHtml] = useState('')

  function checkAccessibility(input) {
    if (!input) return []
    const issues = []

    // Missing alt text on images
    const imgsWithoutAlt = input.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []
    if (imgsWithoutAlt.length > 0) {
      issues.push({ 
        type: 'error', 
        wcag: 'WCAG 2.1 Level A', 
        message: `${imgsWithoutAlt.length} image(s) missing alt text`
      })
    }

    // Missing form labels
    const inputsWithoutLabel = input.match(/<input(?![^>]*\bid=)[^>]*>/gi) || []
    if (inputsWithoutLabel.length > 0) {
      issues.push({ 
        type: 'warning', 
        wcag: 'WCAG 2.1 Level A', 
        message: `${inputsWithoutLabel.length} input(s) may be missing associated labels`
      })
    }

    // Missing language attribute
    if (!input.match(/<html[^>]*\blang=/i)) {
      issues.push({ 
        type: 'error', 
        wcag: 'WCAG 2.1 Level A', 
        message: 'Missing lang attribute on <html> tag'
      })
    }

    // Low contrast warnings (basic detection)
    if (input.includes('color:') && input.includes('background')) {
      issues.push({ 
        type: 'info', 
        wcag: 'WCAG 2.1 Level AA', 
        message: 'Manual check needed: Verify color contrast ratio is at least 4.5:1'
      })
    }

    // Missing heading structure
    if (!input.match(/<h1[^>]*>/i)) {
      issues.push({ 
        type: 'warning', 
        wcag: 'Best Practice', 
        message: 'No <h1> heading found — ensure proper heading hierarchy'
      })
    }

    // Links without descriptive text
    const emptyLinks = input.match(/<a[^>]*>\s*<\/a>/gi) || []
    if (emptyLinks.length > 0) {
      issues.push({ 
        type: 'error', 
        wcag: 'WCAG 2.1 Level A', 
        message: `${emptyLinks.length} link(s) with no text content`
      })
    }

    return issues
  }

  const issues = checkAccessibility(html)
  const errors = issues.filter(i => i.type === 'error').length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Website Accessibility Checker</h1>
      <p className="tool-description">Check HTML for common WCAG 2.1 accessibility issues like missing alt text, labels, and proper semantics.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ Automated Testing Limitations</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Automated tools can only catch ~30% of accessibility issues. Manual testing with screen readers and keyboard navigation is essential for WCAG compliance.
        </p>
      </div>

      <label htmlFor="a11y-input">HTML Code</label>
      <textarea 
        id="a11y-input"
        value={html} 
        onChange={e => setHtml(e.target.value)} 
        placeholder="Paste HTML to check..."
        rows={15}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {html && (
        <div style={{ marginTop: '1.5rem' }}>
          {issues.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              ✓ No automated accessibility issues detected
            </div>
          ) : (
            <>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{issues.length}</div>
                  <div className="stat-label">Issues found</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--error)' }}>{errors}</div>
                  <div className="stat-label">Errors</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3>Accessibility Issues</h3>
                {issues.map((issue, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    background: issue.type === 'error' ? 'var(--error-bg)' : issue.type === 'warning' ? 'var(--warning-bg)' : 'var(--bg-secondary)',
                    borderLeft: `4px solid ${issue.type === 'error' ? 'var(--error)' : issue.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                    marginBottom: '0.75rem',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      {issue.wcag}
                    </div>
                    <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{issue.type}</strong>
                    <div style={{ marginTop: '0.25rem' }}>{issue.message}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/accessibility-checker" />
      <ToolSeo />
    </div>
  )
}
