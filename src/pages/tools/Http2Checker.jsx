import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function Http2Checker() {
  const [url, setUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)

  async function checkHttp2() {
    if (!url) return
    
    setChecking(true)
    setResult(null)

    try {
      const response = await fetch(url)
      const protocol = response.headers.get('x-http-version') || 'Unknown'
      
      setResult({
        success: true,
        protocol,
        // Browser fetch API doesn't expose HTTP version directly
        note: 'Browser fetch API cannot directly detect HTTP/2. Check via DevTools Network tab instead.',
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (err) {
      setResult({
        success: false,
        error: 'Failed to fetch URL. Check CORS or URL validity.'
      })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTTP/2 Checker</h1>
      <p className="tool-description">Check if a website supports HTTP/2 protocol for faster page loading.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ Browser Limitation</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          JavaScript's fetch API doesn't expose HTTP version. To verify HTTP/2, open DevTools → Network tab → reload the page → check the "Protocol" column. 
          Online tools like <a href="https://tools.keycdn.com/http2-test" target="_blank" rel="noopener">KeyCDN HTTP/2 Test</a> provide accurate server-side checks.
        </p>
      </div>

      <label htmlFor="http2-url">Website URL</label>
      <input 
        id="http2-url"
        type="url" 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        placeholder="https://example.com"
      />

      <button className="btn" onClick={checkHttp2} disabled={checking || !url}>
        {checking ? 'Checking...' : 'Check HTTP/2'}
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          {result.success ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--warning-bg)', borderRadius: '8px' }}>
                {result.note}
              </div>
              <div><strong>Status:</strong> {result.status}</div>
              <div style={{ marginTop: '1rem' }}>
                <strong>Response Headers:</strong>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  background: 'var(--bg-tertiary)', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.75rem'
                }}>
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: '8px' }}>
              {result.error}
            </div>
          )}
        </div>
      )}

      <RelatedTools category="network" exclude="/tools/http2-checker" />
      <ToolSeo />
    </div>
  )
}
