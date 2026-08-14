import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function Traceroute() {
  const [host, setHost] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function runTraceroute() {
    if (!host.trim()) {
      setError('Please enter a hostname or IP address')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Extract hostname from URL if user entered a full URL
      let hostname = host.trim()
      try {
        // Try to parse as URL first
        const url = new URL(hostname.startsWith('http') ? hostname : `https://${hostname}`)
        hostname = url.hostname
      } catch {
        // If not a valid URL, assume it's already a hostname
        hostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split('?')[0]
      }

      // Check if it's an IP address (simple validation)
      const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
      
      let targetIp = hostname
      
      if (!isIpAddress) {
        // Try to resolve the hostname
        const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}`)
        const data = await response.json()

        if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
          targetIp = data.Answer[0].data
        } else {
          setError(`Could not resolve hostname "${hostname}". Please check the address and try again.`)
          setLoading(false)
          return
        }
      }
      
      // Validate IP address format
      const ipParts = targetIp.split('.')
      if (ipParts.length !== 4 || !ipParts.every(part => {
        const num = parseInt(part)
        return num >= 0 && num <= 255
      })) {
        setError(`Invalid IP address format: ${targetIp}`)
        setLoading(false)
        return
      }
      
      // Generate simulated traceroute result with realistic hops
      const hops = generateSimulatedHops(hostname, targetIp)
      
      setResult({
        target: hostname,
        targetIp,
        hops,
        simulated: true,
      })
    } catch (err) {
      console.error('Traceroute error:', err)
      setError('Failed to perform lookup. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function generateSimulatedHops(hostname, targetIp) {
    // Generate a realistic simulated traceroute path
    const hops = []
    
    // Local gateway
    hops.push({
      hop: 1,
      ip: '192.168.1.1',
      hostname: 'router.local',
      time: Math.random() * 3 + 0.5,
    })
    
    // ISP gateway
    hops.push({
      hop: 2,
      ip: '10.0.0.1',
      hostname: 'gateway.isp.com',
      time: Math.random() * 5 + 2,
    })
    
    // ISP edge
    hops.push({
      hop: 3,
      ip: '172.16.0.1',
      hostname: 'edge.isp.net',
      time: Math.random() * 10 + 5,
    })
    
    // Intermediate hops (2-4 hops)
    const intermediateCount = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < intermediateCount; i++) {
      hops.push({
        hop: 4 + i,
        ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        hostname: `transit-${i + 1}.backbone.net`,
        time: Math.random() * 15 + 10 + (i * 5),
      })
    }
    
    // Destination
    hops.push({
      hop: hops.length + 1,
      ip: targetIp,
      hostname: hostname,
      time: Math.random() * 20 + 20,
    })
    
    return hops
  }

  function reset() {
    setHost('')
    setResult(null)
    setError('')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Traceroute</h1>
      <p className="tool-description">
        Trace the network path to a destination — see the route packets take across the internet.
      </p>

      <div style={{
        padding: '1rem',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgb(59, 130, 246)',
        borderRadius: 8,
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
      }}>
        ℹ️ <strong>Note:</strong> Browsers cannot perform real traceroute operations due to security restrictions. 
        This tool provides a simulated path based on DNS resolution. For accurate traceroute results, use 
        command-line tools: <code style={{ padding: '0.2rem 0.4rem', backgroundColor: 'var(--card-bg)', borderRadius: 4 }}>tracert</code> (Windows) 
        or <code style={{ padding: '0.2rem 0.4rem', backgroundColor: 'var(--card-bg)', borderRadius: 4 }}>traceroute</code> (Mac/Linux).
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="tr-host">Hostname, IP Address, or URL</label>
        <input
          id="tr-host"
          type="text"
          value={host}
          onChange={e => setHost(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runTraceroute()}
          placeholder="youtube.com, 8.8.8.8, or https://example.com"
          style={{ marginBottom: '0.5rem' }}
        />
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
          💡 You can enter a hostname, IP address, or full URL
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className="btn"
          onClick={runTraceroute}
          disabled={loading}
        >
          {loading ? '🔄 Resolving…' : '🌐 Resolve & Simulate Path'}
        </button>
        {result && (
          <button className="btn btn-ghost" onClick={reset}>
            ↻ Reset
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgb(248, 113, 113)',
          borderRadius: 8,
          color: 'rgb(248, 113, 113)',
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}>
          <h3>Path to {result.target}</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Target IP: {result.targetIp}
          </p>
          {result.simulated && (
            <p style={{ 
              fontSize: '0.82rem', 
              color: 'rgb(251, 146, 60)', 
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              borderRadius: 4,
            }}>
              ⚠️ This is a simulated path for demonstration purposes
            </p>
          )}

          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {result.hops.map((hop) => (
              <div
                key={hop.hop}
                style={{
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 4,
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{hop.hop}.</span>
                <span style={{ flex: 1, minWidth: '200px' }}>
                  {hop.hostname}
                  {hop.hostname !== hop.ip && (
                    <span style={{ color: 'var(--muted)' }}> ({hop.ip})</span>
                  )}
                </span>
                <span style={{ color: 'var(--muted)' }}>
                  {hop.time.toFixed(2)} ms
                </span>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg)', 
            borderRadius: 8,
            fontSize: '0.85rem',
            color: 'var(--muted)',
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>How to run real traceroute:</h4>
            <p style={{ marginBottom: '0.5rem' }}><strong>Windows:</strong></p>
            <code style={{ 
              display: 'block', 
              padding: '0.5rem', 
              backgroundColor: 'var(--card-bg)', 
              borderRadius: 4,
              marginBottom: '0.75rem',
            }}>
              tracert {result.target}
            </code>
            <p style={{ marginBottom: '0.5rem' }}><strong>Mac / Linux:</strong></p>
            <code style={{ 
              display: 'block', 
              padding: '0.5rem', 
              backgroundColor: 'var(--card-bg)', 
              borderRadius: 4,
            }}>
              traceroute {result.target}
            </code>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderRadius: 8 }}>
        <h3>About Traceroute:</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.5rem' }}>
          <li>Traceroute shows the path network packets take from your computer to a destination</li>
          <li>Each "hop" represents a router or gateway along the path</li>
          <li>The time shown is the round-trip time (RTT) to reach that hop</li>
          <li>Real traceroute requires privileged network access not available in browsers</li>
          <li>This tool verifies the hostname resolves and provides educational simulation</li>
        </ul>
      </div>

      <RelatedTools
        tools={[
          { icon: '🌐', name: 'DNS Lookup', path: '/tools/dns-lookup' },
          { icon: '🌐', name: 'IP Address Info', path: '/tools/ip-info' },
          { icon: '🔌', name: 'Port Checker', path: '/tools/port-checker' },
          { icon: '📡', name: 'HTTP Status Codes', path: '/tools/http-status' },
        ]}
      />
      <ToolSeo />
    </div>
  )
}
