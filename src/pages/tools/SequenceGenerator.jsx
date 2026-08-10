import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function SequenceGenerator() {
  const [mode, setMode] = useState('number') // number | letter | custom
  const [start, setStart] = useState('1')
  const [end, setEnd] = useState('10')
  const [step, setStep] = useState('1')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [separator, setSeparator] = useState('\n')
  const [zeroPad, setZeroPad] = useState(false)
  const [customList, setCustomList] = useState('a, b, c, d, e')
  const [copied, setCopied] = useState(false)

  const sequence = useMemo(() => {
    if (mode === 'custom') {
      return customList.split(',').map(s => s.trim()).filter(Boolean)
    }
    const s = parseFloat(start)
    const e = parseFloat(end)
    const st = parseFloat(step) || 1
    if (isNaN(s) || isNaN(e) || st === 0) return []
    const result = []
    const maxItems = 10000
    if (mode === 'number') {
      const ascending = st > 0 ? s <= e : s >= e
      if (!ascending) return []
      let cur = s
      while ((st > 0 ? cur <= e : cur >= e) && result.length < maxItems) {
        let val = Number.isInteger(s) && Number.isInteger(e) && Number.isInteger(st)
          ? String(Math.round(cur))
          : cur.toFixed(10).replace(/\.?0+$/, '')
        if (zeroPad && Number.isInteger(cur)) {
          const maxLen = String(Math.abs(e)).length
          val = Math.sign(cur) < 0 ? '-' + String(Math.abs(Math.round(cur))).padStart(maxLen, '0') : String(Math.round(cur)).padStart(maxLen, '0')
        }
        result.push(val)
        cur = Math.round((cur + st) * 1e10) / 1e10
      }
    } else if (mode === 'letter') {
      const startCode = start.charCodeAt(0)
      const endCode = end.charCodeAt(0)
      const dir = endCode >= startCode ? 1 : -1
      for (let c = startCode; (dir > 0 ? c <= endCode : c >= endCode) && result.length < maxItems; c += dir) {
        result.push(String.fromCharCode(c))
      }
    }
    return result
  }, [mode, start, end, step, zeroPad, customList])

  const output = sequence.map(v => `${prefix}${v}${suffix}`).join(separator === '\\n' ? '\n' : separator === '\\t' ? '\t' : separator)

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const sepLabel = { '\n': 'New line', ',': 'Comma', ' ': 'Space', ';': 'Semicolon', '\t': 'Tab' }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Sequence Generator</h1>
      <p className="tool-description">
        Generate numeric sequences, letter ranges, or custom lists with flexible formatting options.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {[['number', 'Numbers'], ['letter', 'Letters A–Z'], ['custom', 'Custom list']].map(([id, label]) => (
          <button key={id} className={`btn ${mode === id ? '' : 'btn-ghost'} btn-sm`} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>

      {mode === 'custom' ? (
        <div>
          <label htmlFor="sg-custom">Custom items (comma-separated)</label>
          <input id="sg-custom" value={customList} onChange={e => setCustomList(e.target.value)} placeholder="a, b, c, d, e" />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 100px' }}>
            <label htmlFor="sg-start">{mode === 'letter' ? 'Start letter' : 'Start'}</label>
            <input id="sg-start" value={start} onChange={e => setStart(e.target.value)} placeholder={mode === 'letter' ? 'A' : '1'} />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label htmlFor="sg-end">{mode === 'letter' ? 'End letter' : 'End'}</label>
            <input id="sg-end" value={end} onChange={e => setEnd(e.target.value)} placeholder={mode === 'letter' ? 'Z' : '10'} />
          </div>
          {mode === 'number' && (
            <div style={{ flex: '1 1 100px' }}>
              <label htmlFor="sg-step">Step</label>
              <input id="sg-step" type="number" value={step} onChange={e => setStep(e.target.value)} placeholder="1" />
            </div>
          )}
          {mode === 'number' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.875rem', paddingBottom: '0.3rem' }}>
              <input type="checkbox" checked={zeroPad} onChange={e => setZeroPad(e.target.checked)} />
              Zero-pad
            </label>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 130px' }}>
          <label htmlFor="sg-sep">Separator</label>
          <select id="sg-sep" value={separator} onChange={e => setSeparator(e.target.value)}>
            {Object.entries(sepLabel).map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label>Prefix</label>
          <input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="optional" />
        </div>
        <div style={{ flex: '1 1 130px' }}>
          <label>Suffix</label>
          <input value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="optional" />
        </div>
      </div>

      {sequence.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{sequence.length} items generated</span>
            <button className="btn btn-sm btn-ghost" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={output} style={{ minHeight: 140, background: 'var(--surface)', cursor: 'default', fontFamily: 'monospace' }} />
        </div>
      )}
      {sequence.length === 0 && mode !== 'custom' && (start || end) && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.75rem' }}>Check your start, end, and step values.</p>
      )}

      <RelatedTools category="generators" exclude="/tools/sequence-generator" />
      <ToolSeo />
    </div>
  )
}
