import { useState } from 'react'
import BackBar from '../../components/BackBar'

function jsonToCsv(json) {
  const data = JSON.parse(json)
  const arr = Array.isArray(data) ? data : [data]
  const headers = [...new Set(arr.flatMap(obj => Object.keys(obj)))]
  const escape = v => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? '"' + s.replace(/"/g, '""') + '"'
      : s
  }
  const rows = arr.map(obj => headers.map(h => escape(obj[h] ?? '')).join(','))
  return [headers.join(','), ...rows].join('\n')
}

export default function JsonToCsv() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function convert() {
    try {
      setOutput(jsonToCsv(input.trim()))
      setError('')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  function download() {
    const blob = new Blob([output], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON to CSV</h1>
      <p className="tool-description">Convert a JSON array of objects to a CSV spreadsheet.</p>

      <label htmlFor="j2csv-input">Input JSON (array of objects)</label>
      <textarea
        id="j2csv-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={convert}>Convert</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>CSV output</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
              <button className="btn btn-sm" onClick={download}>Download .csv</button>
            </div>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
