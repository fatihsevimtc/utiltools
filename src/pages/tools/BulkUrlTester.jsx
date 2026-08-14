import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function BulkUrlTester() {
  const [urls, setUrls] = useState('')
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState([])

  async function testUrls() {
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean)
    if (urlList.length === 0) return

    setTesting(true)
    setResults([])

    const testResults = []
    
    for (const url of urlList) {
      try {
        const start = Date.now()
        const response = await fetch(url, { method: 'HEAD' })
        const time = Date.now() - start
        
        testResults.push({
          url,
          status: response.status,
          ok: response.ok,
          time,
          error: null
        })
      } catch (err) {
        testResults.push({
          url,
          status: null,
          ok: false,
          time: null,
          error: err.message
        })
      }
      
      setResults([...testResults])
    }

    setTesting(false)
  }

  const successCount = results.filter(r => r.ok).length
  const failCount = results.filter(r => !r.ok).length

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Bulk URL Tester</h1>
      <p className="tool-description">Test multiple URLs at once and see their HTTP status codes and response times.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>⚠️ CORS Limitations</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Many websites block HEAD requests from browsers. For production URL monitoring, use server-side tools like Uptime Robot or Pingdom.
        </p>
      </div>

      <label htmlFor="url-list">URLs (one per line)</label>
      <textarea 
        id="url-list"
        value={urls} 
        onChange={e => setUrls(e.target.value)} 
        placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
        rows={10}
      />

      <button className="btn" onClick={testUrls} disabled={testing || !urls}>
        {testing ? `Testing ${results.length}...` : 'Test All URLs'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">URLs tested</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{successCount}</div>
              <div className="stat-label">Success</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--error)' }}>{failCount}</div>
              <div className="stat-label">Failed</div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>Results</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>URL</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--border)' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--border)' }}>Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.url}
                      </td>
                      <td style={{ 
                        padding: '0.75rem', 
                        textAlign: 'center',
                        color: r.ok ? 'var(--success)' : 'var(--error)',
                        fontWeight: '600'
                      }}>
                        {r.error ? 'Error' : r.status}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {r.time ? `${r.time}ms` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <RelatedTools category="network" exclude="/tools/bulk-url-tester" />
      <ToolSeo />
    </div>
  )
}
