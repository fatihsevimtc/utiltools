import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function SleepCalculator() {
  const [mode, setMode]       = useState('wakeup')  // 'wakeup' | 'bedtime'
  const [time, setTime]       = useState('')
  const CYCLE_MINS            = 90
  const FALL_ASLEEP_MINS      = 15
  const NUM_CYCLES            = [5, 6]  // 7.5h and 9h — ideal

  function calcTimes() {
    if (!time) return []
    const [h, m] = time.split(':').map(Number)
    const totalMins = h * 60 + m

    return [3, 4, 5, 6].map(cycles => {
      const sleepMins = cycles * CYCLE_MINS
      if (mode === 'wakeup') {
        // want to wake at `time` → need to sleep at …
        let bedMin = totalMins - sleepMins - FALL_ASLEEP_MINS
        bedMin = ((bedMin % 1440) + 1440) % 1440
        const bh = Math.floor(bedMin / 60) % 24
        const bm = bedMin % 60
        return { label: `${cycles} cycles (${(sleepMins / 60).toFixed(1)}h)`, time: `${String(bh).padStart(2,'0')}:${String(bm).padStart(2,'0')}`, ideal: NUM_CYCLES.includes(cycles) }
      } else {
        // going to bed at `time` → will wake at …
        let wakeMin = totalMins + sleepMins + FALL_ASLEEP_MINS
        wakeMin = ((wakeMin % 1440) + 1440) % 1440
        const wh = Math.floor(wakeMin / 60) % 24
        const wm = wakeMin % 60
        return { label: `${cycles} cycles (${(sleepMins / 60).toFixed(1)}h)`, time: `${String(wh).padStart(2,'0')}:${String(wm).padStart(2,'0')}`, ideal: NUM_CYCLES.includes(cycles) }
      }
    })
  }

  const results = calcTimes()

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Sleep Calculator</h1>
      <p className="tool-description">
        Find the best time to go to sleep or wake up based on 90-minute sleep cycles. Waking at the end of a cycle helps you feel more refreshed.
      </p>

      <div className="chip-group" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${mode === 'wakeup' ? 'active' : ''}`} onClick={() => setMode('wakeup')}>I want to wake up at…</button>
        <button className={`chip ${mode === 'bedtime' ? 'active' : ''}`} onClick={() => setMode('bedtime')}>I'm going to bed at…</button>
      </div>

      <label htmlFor="sc-time">{mode === 'wakeup' ? 'Wake-up time' : 'Bedtime'}</label>
      <input id="sc-time" type="time" value={time} onChange={e => setTime(e.target.value)} style={{ maxWidth: 180 }} />

      {results.length > 0 && time && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            {mode === 'wakeup' ? 'Go to sleep at:' : 'You would wake up at:'} (includes ~{FALL_ASLEEP_MINS} min to fall asleep)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {results.map(r => (
              <div key={r.label} style={{ flex: '1 1 130px', background: 'var(--surface)', border: `2px solid ${r.ideal ? 'var(--accent, #6366f1)' : 'var(--border)'}`, borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 700 }}>{r.time}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{r.label}</div>
                {r.ideal && <div style={{ fontSize: '0.72rem', marginTop: '0.2rem', color: 'var(--accent, #6366f1)' }}>★ Recommended</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools category="time" exclude="/tools/sleep-calculator" />
      <ToolSeo />
    </div>
  )
}
