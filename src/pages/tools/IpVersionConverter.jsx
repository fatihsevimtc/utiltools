import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function IpVersionConverter() {
  const [ipv4, setIpv4] = useState('')
  const [ipv6, setIpv6] = useState('')

  function ipv4ToIpv6(ip) {
    const parts = ip.split('.')
    if (parts.length !== 4) return 'Invalid IPv4'
    
    const valid = parts.every(p => {
      const num = parseInt(p)
      return !isNaN(num) && num >= 0 && num <= 255
    })
    
    if (!valid) return 'Invalid IPv4'

    // IPv4-mapped IPv6 address
    const hex = parts.map(p => parseInt(p).toString(16).padStart(2, '0')).join('')
    return `::ffff:${parts.join('.')}`
  }

  function ipv6ToIpv4(ip) {
    // Check if it's IPv4-mapped IPv6
    const ipv4MappedPattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/i
    const match = ip.match(ipv4MappedPattern)
    
    if (match) {
      return match[1]
    }
    
    return 'Not an IPv4-mapped IPv6 address'
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>IP Version Converter (IPv4 ↔ IPv6)</h1>
      <p className="tool-description">Convert between IPv4 and IPv6 addresses using IPv4-mapped IPv6 format.</p>

      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <strong>📝 About IPv4-mapped IPv6</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          IPv4 addresses can be represented in IPv6 format using the ::ffff: prefix (e.g., ::ffff:192.0.2.1). This is useful for dual-stack networks.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div>
          <h3>IPv4 → IPv6</h3>
          <label htmlFor="ipv4-input">IPv4 Address</label>
          <input 
            id="ipv4-input"
            type="text" 
            value={ipv4} 
            onChange={e => setIpv4(e.target.value)} 
            placeholder="192.168.1.1"
          />
          
          {ipv4 && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>IPv6 (mapped):</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', wordBreak: 'break-all' }}>
                {ipv4ToIpv6(ipv4)}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3>IPv6 → IPv4</h3>
          <label htmlFor="ipv6-input">IPv6 Address</label>
          <input 
            id="ipv6-input"
            type="text" 
            value={ipv6} 
            onChange={e => setIpv6(e.target.value)} 
            placeholder="::ffff:192.168.1.1"
          />
          
          {ipv6 && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>IPv4:</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.125rem' }}>
                {ipv6ToIpv4(ipv6)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.875rem' }}>
        <strong>Examples:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li><code>192.0.2.1</code> → <code>::ffff:192.0.2.1</code></li>
          <li><code>127.0.0.1</code> → <code>::ffff:127.0.0.1</code></li>
          <li><code>::ffff:8.8.8.8</code> → <code>8.8.8.8</code></li>
        </ul>
      </div>

      <RelatedTools category="network" exclude="/tools/ip-version-converter" />
      <ToolSeo />
    </div>
  )
}
