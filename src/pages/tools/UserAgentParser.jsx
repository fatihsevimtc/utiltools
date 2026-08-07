import { useState } from 'react'
import BackBar from '../../components/BackBar'

function parseUA(ua) {
  const browser =
    /Edg\/([0-9.]+)/.exec(ua)  ? { name: 'Edge',    version: /Edg\/([0-9.]+)/.exec(ua)[1] } :
    /OPR\/([0-9.]+)/.exec(ua)  ? { name: 'Opera',   version: /OPR\/([0-9.]+)/.exec(ua)[1] } :
    /Chrome\/([0-9.]+)/.exec(ua)? { name: 'Chrome',  version: /Chrome\/([0-9.]+)/.exec(ua)[1] } :
    /Firefox\/([0-9.]+)/.exec(ua)?{ name: 'Firefox', version: /Firefox\/([0-9.]+)/.exec(ua)[1] } :
    /Safari\/([0-9.]+)/.exec(ua) ? { name: 'Safari', version: (/Version\/([0-9.]+)/.exec(ua)||[,'?'])[1] } :
    { name: 'Unknown', version: '?' }

  const os =
    /Windows NT/.test(ua)   ? 'Windows' :
    /Mac OS X/.test(ua)     ? 'macOS' :
    /Android/.test(ua)      ? 'Android' :
    /iPhone|iPad/.test(ua)  ? 'iOS' :
    /Linux/.test(ua)        ? 'Linux' :
    'Unknown'

  const device =
    /Mobi|Android.*Mobile/.test(ua) ? 'Mobile' :
    /iPad|Tablet/.test(ua)          ? 'Tablet' : 'Desktop'

  return { browser: browser.name, version: browser.version, os, device }
}

export default function UserAgentParser() {
  const liveUA = navigator.userAgent
  const [custom, setCustom] = useState('')

  const ua = custom.trim() || liveUA
  const info = parseUA(ua)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>User Agent Parser</h1>
      <p className="tool-description">Parse browser user-agent strings to extract browser, OS, and device info.</p>

      <label>Your current user agent</label>
      <div className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginBottom: '1.5rem' }}>{liveUA}</div>

      <label htmlFor="ua-custom">Paste a custom user-agent string (optional)</label>
      <textarea
        id="ua-custom"
        value={custom}
        onChange={e => setCustom(e.target.value)}
        placeholder="Mozilla/5.0 (Windows NT 10.0…"
        style={{ minHeight: 80, fontFamily: 'monospace' }}
      />

      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Browser', value: info.browser },
          { label: 'Version', value: info.version },
          { label: 'OS',      value: info.os },
          { label: 'Device',  value: info.device },
        ].map(f => (
          <div key={f.label} style={{ background: 'var(--surface2, #f5f5f5)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>{f.label}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
