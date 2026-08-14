import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function WordPressScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)

  async function scanWordPress() {
    if (!url) return
    
    setScanning(true)
    setResults(null)

    try {
      const findings = {
        isWordPress: false,
        version: null,
        theme: null,
        plugins: [],
        endpoints: []
      }

      // Check if it's WordPress
      try {
        const wpJson = await fetch(`${url}/wp-json`).then(r => r.json())
        findings.isWordPress = true
        findings.endpoints.push('/wp-json (REST API available)')
      } catch {
        findings.isWordPress = false
      }

      // Try to detect version
      try {
        const readme = await fetch(`${url}/readme.html`).then(r => r.text())
        const versionMatch = readme.match(/Version\s+([\d.]+)/)
        if (versionMatch) findings.version = versionMatch[1]
      } catch {}

      // Common plugin paths
      const commonPlugins = ['akismet', 'contact-form-7', 'woocommerce', 'yoast-seo', 'jetpack']
      for (const plugin of commonPlugins) {
        try {
          const response = await fetch(`${url}/wp-content/plugins/${plugin}/`, { method: 'HEAD' })
          if (response.ok) {
            findings.plugins.push(plugin)
          }
        } catch {}
      }

      setResults(findings)
    } catch (err) {
      setResults({ error: 'Failed to scan website. CORS or network issues may prevent scanning.' })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>WordPress Scanner</h1>
      <p className="tool-description">Detect WordPress installations, version, theme, and active plugins — for security and compatibility research.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ CORS Limitations</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          This browser-based scanner is limited by CORS policies. Many WordPress sites block external requests. For comprehensive scanning, use WPScan or similar server-side tools.
        </p>
      </div>

      <label htmlFor="wp-url">WordPress Site URL</label>
      <input 
        id="wp-url"
        type="url" 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        placeholder="https://example.com"
      />

      <button className="btn" onClick={scanWordPress} disabled={scanning || !url}>
        {scanning ? 'Scanning...' : 'Scan Website'}
      </button>

      {results && (
        <div style={{ marginTop: '1.5rem' }}>
          {results.error ? (
            <div style={{ padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: '8px' }}>
              {results.error}
            </div>
          ) : (
            <>
              <div className="stat-card" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <div className="stat-value">{results.isWordPress ? '✓ WordPress' : '✗ Not WordPress'}</div>
                <div className="stat-label">Detection Status</div>
              </div>

              {results.isWordPress && (
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ marginTop: 0 }}>Scan Results</h3>
                  
                  {results.version && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Version:</strong> {results.version}
                    </div>
                  )}

                  {results.plugins.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Detected Plugins ({results.plugins.length}):</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        {results.plugins.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}

                  {results.endpoints.length > 0 && (
                    <div>
                      <strong>Endpoints:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        {results.endpoints.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <RelatedTools category="developer" exclude="/tools/wordpress-scanner" />
      <ToolSeo />
    </div>
  )
}
