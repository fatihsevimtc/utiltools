import { useState } from 'react'
import BackBar from '../../components/BackBar'

export default function TimestampConverter() {
  const [unix, setUnix]     = useState(String(Math.floor(Date.now()/1000)))
  const [human, setHuman]   = useState('')
  const [direction, setDir] = useState('toHuman')

  const nowTs = Math.floor(Date.now()/1000)

  function fromUnix(val) {
    setUnix(val)
    const n = Number(val)
    if (!isNaN(n) && val !== '') {
      const ts = n > 1e10 ? n : n * 1000 // handle ms vs s
      setHuman(new Date(ts).toISOString().replace('T',' ').replace('Z','') + ' UTC')
    } else setHuman('')
  }

  function fromHuman(val) {
    setHuman(val)
    const d = new Date(val)
    if (!isNaN(d.getTime())) setUnix(String(Math.floor(d.getTime()/1000)))
    else setUnix('')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Timestamp Converter</h1>
      <p className="tool-description">Convert Unix timestamps to human-readable dates and back.</p>

      <button className="btn btn-ghost btn-sm" onClick={() => fromUnix(String(nowTs))} style={{ marginBottom: '1.25rem' }}>
        Use current time
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label>Unix timestamp (seconds)</label>
          <input type="number" value={unix} onChange={e => fromUnix(e.target.value)} placeholder="1700000000" />
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '1.25rem', paddingTop: '1.2rem' }}>⇄</div>
        <div>
          <label>Human readable (UTC)</label>
          <input type="text" value={human} onChange={e => fromHuman(e.target.value)} placeholder="2024-01-01 00:00:00 UTC" />
        </div>
      </div>

      {unix && (
        <div className="stats-row" style={{ marginTop: '1.5rem' }}>
          {[
            ['Unix (s)', unix],
            ['Unix (ms)', unix ? String(Number(unix)*1000) : ''],
            ['ISO 8601', unix ? new Date(Number(unix)*1000).toISOString() : ''],
            ['Local time', unix ? new Date(Number(unix)*1000).toLocaleString() : ''],
          ].map(([label, val]) => (
            <div key={label} className="stat-card" style={{ flex: '1 1 160px' }}>
              <div className="stat-value" style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
