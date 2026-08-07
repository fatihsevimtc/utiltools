import { useState, useEffect } from 'react'
import BackBar from '../../components/BackBar'

export default function IpInfo() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function fetchInfo() {
    setLoading(true)
    setError('')
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to fetch IP info. Please try again.'); setLoading(false) })
  }

  useEffect(() => { fetchInfo() }, [])

  const fields = data ? [
    { label: 'IP Address',  value: data.ip },
    { label: 'City',        value: data.city },
    { label: 'Region',      value: data.region },
    { label: 'Country',     value: data.country_name },
    { label: 'ISP / Org',   value: data.org },
    { label: 'Timezone',    value: data.timezone },
    { label: 'Latitude',    value: data.latitude },
    { label: 'Longitude',   value: data.longitude },
  ] : []

  return (
    <div className="tool-page">
      <BackBar />
      <h1>IP Address Info</h1>
      <p className="tool-description">Look up your public IP address, location, ISP, and timezone.</p>

      <button className="btn" onClick={fetchInfo} disabled={loading} style={{ marginBottom: '1.5rem' }}>
        {loading ? 'Loading…' : '↻ Refresh'}
      </button>

      {error && <p style={{ color: 'var(--danger, #ef4444)' }}>{error}</p>}

      {!loading && !error && data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {fields.map(f => (
            <div key={f.label} style={{ background: 'var(--surface2, #f5f5f5)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>{f.label}</div>
              <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{f.value ?? '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
