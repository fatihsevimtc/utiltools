import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function HttpRequestValidator() {
  const [request, setRequest] = useState('')

  function validateHttpRequest(req) {
    if (!req) return []
    const issues = []
    const lines = req.split('\n')

    // Check request line
    const requestLine = lines[0]
    if (!requestLine) {
      issues.push({ type: 'error', message: 'Missing request line' })
    } else {
      const parts = requestLine.split(' ')
      if (parts.length !== 3) {
        issues.push({ type: 'error', message: 'Invalid request line format. Expected: METHOD /path HTTP/1.1' })
      } else {
        const [method, path, version] = parts
        
        // Validate method
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT']
        if (!validMethods.includes(method.toUpperCase())) {
          issues.push({ type: 'warning', message: `"${method}" is not a standard HTTP method` })
        }

        // Validate path
        if (!path.startsWith('/')) {
          issues.push({ type: 'error', message: 'Path must start with /' })
        }

        // Validate HTTP version
        if (!version.match(/^HTTP\/\d\.\d$/)) {
          issues.push({ type: 'error', message: `Invalid HTTP version: "${version}"` })
        }
      }
    }

    // Check for Host header
    const hasHost = lines.some(line => line.trim().toLowerCase().startsWith('host:'))
    if (!hasHost) {
      issues.push({ type: 'error', message: 'Missing required "Host" header' })
    }

    // Check for proper header format
    const headerLines = lines.slice(1).filter(l => l.trim() && !l.startsWith(' '))
    headerLines.forEach((line, i) => {
      if (!line.includes(':')) {
        issues.push({ type: 'warning', message: `Line ${i + 2}: Invalid header format. Expected "Name: value"` })
      }
    })

    // Check for double CRLF before body
    const emptyLineIndex = lines.findIndex((l, i) => i > 0 && l.trim() === '')
    if (emptyLineIndex === -1 && req.includes('\n\n')) {
      issues.push({ type: 'info', message: 'Request appears to have a body. Ensure headers end with an empty line.' })
    }

    return issues
  }

  const issues = validateHttpRequest(request)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>HTTP Request Validator</h1>
      <p className="tool-description">Validate raw HTTP requests for proper format, required headers, and common mistakes.</p>

      <label htmlFor="http-request">Raw HTTP Request</label>
      <textarea 
        id="http-request"
        value={request} 
        onChange={e => setRequest(e.target.value)} 
        placeholder="GET /api/users HTTP/1.1&#10;Host: example.com&#10;User-Agent: curl/7.68.0&#10;Accept: */*"
        rows={15}
        style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
      />

      {request && (
        <div style={{ marginTop: '1.5rem' }}>
          {issues.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              ✓ HTTP request is valid
            </div>
          ) : (
            <>
              <div className="stat-card" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <div className="stat-value">{issues.length}</div>
                <div className="stat-label">Issues found</div>
              </div>

              <div>
                {issues.map((issue, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    background: issue.type === 'error' ? 'var(--error-bg)' : issue.type === 'warning' ? 'var(--warning-bg)' : 'var(--bg-secondary)',
                    borderLeft: `4px solid ${issue.type === 'error' ? 'var(--error)' : issue.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                    marginBottom: '0.75rem',
                    borderRadius: '4px'
                  }}>
                    <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{issue.type}</strong>
                    <div style={{ marginTop: '0.25rem' }}>{issue.message}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <strong>Example valid request:</strong>
        <pre style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'auto' }}>
{`GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: MyApp/1.0
Accept: application/json

`}
        </pre>
      </div>

      <RelatedTools category="network" exclude="/tools/http-request-validator" />
      <ToolSeo />
    </div>
  )
}
