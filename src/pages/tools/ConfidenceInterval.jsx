import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// z* values for common confidence levels
const Z_TABLE = {
  80: 1.282,
  85: 1.440,
  90: 1.645,
  95: 1.960,
  99: 2.576,
  99.5: 2.807,
  99.9: 3.291,
}

// Two-tailed t-distribution critical values (degrees of freedom → t*)
// Precomputed for 95% CI — full table for 80/90/95/99
const T_TABLE = {
  1:  { 80: 3.078, 85: 4.165, 90: 6.314, 95: 12.706, 99: 63.657 },
  2:  { 80: 1.886, 85: 2.282, 90: 2.920, 95: 4.303,  99: 9.925 },
  3:  { 80: 1.638, 85: 1.924, 90: 2.353, 95: 3.182,  99: 5.841 },
  4:  { 80: 1.533, 85: 1.778, 90: 2.132, 95: 2.776,  99: 4.604 },
  5:  { 80: 1.476, 85: 1.699, 90: 2.015, 95: 2.571,  99: 4.032 },
  6:  { 80: 1.440, 85: 1.650, 90: 1.943, 95: 2.447,  99: 3.707 },
  7:  { 80: 1.415, 85: 1.617, 90: 1.895, 95: 2.365,  99: 3.499 },
  8:  { 80: 1.397, 85: 1.592, 90: 1.860, 95: 2.306,  99: 3.355 },
  9:  { 80: 1.383, 85: 1.574, 90: 1.833, 95: 2.262,  99: 3.250 },
  10: { 80: 1.372, 85: 1.559, 90: 1.812, 95: 2.228,  99: 3.169 },
  12: { 80: 1.356, 85: 1.538, 90: 1.782, 95: 2.179,  99: 3.055 },
  15: { 80: 1.341, 85: 1.520, 90: 1.753, 95: 2.131,  99: 2.947 },
  20: { 80: 1.325, 85: 1.499, 90: 1.725, 95: 2.086,  99: 2.845 },
  25: { 80: 1.316, 85: 1.488, 90: 1.708, 95: 2.060,  99: 2.787 },
  30: { 80: 1.310, 85: 1.479, 90: 1.697, 95: 2.042,  99: 2.750 },
  40: { 80: 1.303, 85: 1.470, 90: 1.684, 95: 2.021,  99: 2.704 },
  60: { 80: 1.296, 85: 1.462, 90: 1.671, 95: 2.000,  99: 2.660 },
  120:{ 80: 1.289, 85: 1.453, 90: 1.658, 95: 1.980,  99: 2.617 },
}

function getTCritical(df, cl) {
  const keys = Object.keys(T_TABLE).map(Number).sort((a, b) => a - b)
  // Find nearest df in table
  let nearest = keys[keys.length - 1]
  for (const k of keys) {
    if (k >= df) { nearest = k; break }
  }
  // For cl not in table, use z
  const row = T_TABLE[nearest]
  return row?.[cl] ?? Z_TABLE[cl] ?? 1.96
}

export default function ConfidenceInterval() {
  const [mode, setMode] = useState('mean') // mean | proportion
  const [mean, setMean]   = useState('50')
  const [sd, setSd]       = useState('10')
  const [n, setN]         = useState('30')
  const [cl, setCl]       = useState('95')
  // Proportion mode
  const [phat, setPhat]   = useState('0.4')
  const [np, setNp]       = useState('100')

  const result = useMemo(() => {
    const clNum  = Number(cl)
    const nNum   = mode === 'mean' ? Number(n)   : Number(np)
    const useTDist = mode === 'mean' && nNum < 30

    if (mode === 'mean') {
      const meanNum = Number(mean)
      const sdNum   = Number(sd)
      if (!nNum || !sdNum || nNum < 1) return null
      const se  = sdNum / Math.sqrt(nNum)
      const crit = useTDist ? getTCritical(nNum - 1, clNum) : (Z_TABLE[clNum] ?? 1.96)
      const me  = crit * se
      return {
        lower: (meanNum - me).toFixed(4),
        upper: (meanNum + me).toFixed(4),
        marginOfError: me.toFixed(4),
        criticalValue: crit.toFixed(4),
        standardError: se.toFixed(4),
        method: useTDist ? `t-distribution (df=${nNum - 1})` : 'z-distribution (n≥30)',
      }
    } else {
      const p = Number(phat)
      if (!nNum || p < 0 || p > 1 || nNum < 1) return null
      const z  = Z_TABLE[clNum] ?? 1.96
      const se = Math.sqrt((p * (1 - p)) / nNum)
      const me = z * se
      return {
        lower: Math.max(0, p - me).toFixed(4),
        upper: Math.min(1, p + me).toFixed(4),
        marginOfError: me.toFixed(4),
        criticalValue: z.toFixed(4),
        standardError: se.toFixed(4),
        method: 'z-distribution (proportion)',
      }
    }
  }, [mode, mean, sd, n, cl, phat, np])

  const CONFIDENCE_LEVELS = Object.keys(Z_TABLE).map(Number).sort((a, b) => a - b)

  function ResultRow({ label, value }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{label}</span>
        <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
      </div>
    )
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Confidence Interval Calculator</h1>
      <p className="tool-description">
        Calculate confidence intervals for a population mean or proportion. Uses the t-distribution for small samples (n&lt;30) and z-distribution otherwise.
      </p>

      <div className="chip-group">
        <button className={`chip ${mode === 'mean' ? 'active' : ''}`} onClick={() => setMode('mean')}>
          📊 Population Mean
        </button>
        <button className={`chip ${mode === 'proportion' ? 'active' : ''}`} onClick={() => setMode('proportion')}>
          % Proportion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
        {mode === 'mean' ? (
          <>
            <div>
              <label htmlFor="ci-mean">Sample Mean (x̄)</label>
              <input id="ci-mean" type="number" value={mean} onChange={e => setMean(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ci-sd">Std Deviation (s)</label>
              <input id="ci-sd" type="number" min={0} step="any" value={sd} onChange={e => setSd(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ci-n">Sample Size (n)</label>
              <input id="ci-n" type="number" min={1} step={1} value={n} onChange={e => setN(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="ci-phat">Sample Proportion (p̂)</label>
              <input id="ci-phat" type="number" min={0} max={1} step="0.01" value={phat} onChange={e => setPhat(e.target.value)} placeholder="e.g. 0.4" />
              <small style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>value between 0 and 1</small>
            </div>
            <div>
              <label htmlFor="ci-np">Sample Size (n)</label>
              <input id="ci-np" type="number" min={1} step={1} value={np} onChange={e => setNp(e.target.value)} />
            </div>
          </>
        )}
        <div>
          <label htmlFor="ci-cl">Confidence Level</label>
          <select id="ci-cl" value={cl} onChange={e => setCl(e.target.value)}>
            {CONFIDENCE_LEVELS.map(v => (
              <option key={v} value={v}>{v}%</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem', background: 'var(--card-bg, var(--bg2))', borderRadius: 10, padding: '1.2rem 1.4rem', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent)' }}>
              ({result.lower}, {result.upper})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{cl}% Confidence Interval</div>
          </div>
          <ResultRow label="Lower bound"       value={result.lower} />
          <ResultRow label="Upper bound"       value={result.upper} />
          <ResultRow label="Margin of error"   value={`± ${result.marginOfError}`} />
          <ResultRow label="Standard error"    value={result.standardError} />
          <ResultRow label="Critical value"    value={result.criticalValue} />
          <ResultRow label="Method"            value={result.method} />
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        <strong>How to interpret:</strong> A {cl}% CI means that if you repeated the sampling process many times,
        approximately {cl}% of the intervals computed would contain the true population parameter.
      </div>

      <RelatedTools tools={[
        { icon: '🎲', name: 'Probability Calculator',  path: '/tools/probability' },
        { icon: '🔬', name: 'Scientific Calculator',   path: '/tools/scientific-calculator' },
        { icon: '!',  name: 'Factorial / P / C',        path: '/tools/factorial' },
        { icon: '%',  name: 'Percentage Calc',          path: '/tools/percentage' },
      ]} />
      <ToolSeo />
    </div>
  )
}
