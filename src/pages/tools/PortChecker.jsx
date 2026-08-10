import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function PortChecker() {
  const [host, setHost]     = useState('')
  const [port, setPort]     = useState('80')
  const [status, setStatus] = useState(null)  // null | 'checking' | 'open' | 'closed' | 'error'
  const [msg, setMsg]       = useState('')

  const COMMON = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 5432, 6379, 8080, 8443, 27017]

  async function check() {
    const h = host.trim()
    const p = parseInt(port)
    if (!h || isNaN(p) || p < 1 || p > 65535) { setStatus('error'); setMsg('Please enter a valid host and port (1–65535).'); return }

    setStatus('checking')
    setMsg('')

    // Use the /api/port-check endpoint pattern but since we're browser-only we use
    // a WebSocket connect attempt — this works for some ports.
    // For a fully browser-based approach, we attempt a fetch with a very short timeout.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    try {
      await fetch(`https://${h}:${p}`, { mode: 'no-cors', signal: controller.signal })
      clearTimeout(timeout)
      setStatus('open')
      setMsg(`Port ${p} on ${h} appears to be open (connection succeeded).`)
    } catch (e) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') {
        setStatus('closed')
        setMsg(`Port ${p} on ${h} timed out — likely closed or filtered.`)
      } else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        setStatus('closed')
        setMsg(`Port ${p} on ${h} refused the connection or is closed.`)
      } else {
        setStatus('open')
        setMsg(`Port ${p} on ${h} may be open (response received, CORS blocked content).`)
      }
    }
  }

  const statusColor = { open: '#22c55e', closed: '#ef4444', checking: 'var(--muted)', error: '#f59e0b' }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Port Checker</h1>
      <p className="tool-description">
        Check if a TCP port is open on a remote host from your browser. Results are best-effort — browser security restrictions may affect accuracy.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
        <div style={{ flex: '2 1 200px' }}>
          <label htmlFor="pc-host">Host / IP</label>
          <input id="pc-host" type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="example.com or 1.2.3.4" onKeyDown={e => e.key === 'Enter' && check()} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <label htmlFor="pc-port">Port</label>
          <input id="pc-port" type="number" min="1" max="65535" value={port} onChange={e => setPort(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} />
        </div>
        <button className="btn" onClick={check} disabled={status === 'checking'}>
          {status === 'checking' ? 'Checking…' : 'Check'}
        </button>
      </div>

      <div className="chip-group" style={{ flexWrap: 'wrap' }}>
        {COMMON.map(p => (
          <button key={p} className={`chip ${port === String(p) ? 'active' : ''}`} onClick={() => setPort(String(p))}>{p}</button>
        ))}
      </div>

      {status && status !== 'checking' && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
          <span style={{ fontWeight: 700, color: statusColor[status] }}>
            {status === 'open' ? '✓ Open' : status === 'closed' ? '✗ Closed / Filtered' : '⚠ Error'}
          </span>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--muted)' }}>{msg}</p>
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
        Note: Browser security restrictions (CORS, mixed-content) mean results for some ports may not be reliable. For accurate results use a server-side port scanner.
      </p>

      <RelatedTools category="developer" exclude="/tools/port-checker" />
      <ToolSeo />
    </div>
  )
}
