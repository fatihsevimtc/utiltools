import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// ── parsers ────────────────────────────────────────────────────────────────

function parseCsv(text) {
  const lines = text.trim().split('\n')
  return lines.map(line => {
    const row = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') { inQ = !inQ }
      else if (c === ',' && !inQ) { row.push(cur.trim()); cur = '' }
      else cur += c
    }
    row.push(cur.trim())
    return row
  })
}

function parseTsv(text) {
  return text.trim().split('\n').map(l => l.split('\t').map(c => c.trim()))
}

function parseMarkdown(text) {
  return text.trim().split('\n')
    .filter(l => l.includes('|') && !/^[\s|:-]+$/.test(l))
    .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
}

function parseHtml(text) {
  const rows = []
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi
  let trMatch
  while ((trMatch = trRe.exec(text)) !== null) {
    const cells = []
    let cellMatch
    cellRe.lastIndex = 0
    while ((cellMatch = cellRe.exec(trMatch[1])) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim())
    }
    if (cells.length) rows.push(cells)
  }
  return rows
}

// ── renderers ─────────────────────────────────────────────────────────────

function toCsv(rows) {
  return rows.map(row =>
    row.map(cell => {
      const s = String(cell)
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s
    }).join(',')
  ).join('\n')
}

function toTsv(rows) {
  return rows.map(r => r.join('\t')).join('\n')
}

function toMarkdown(rows) {
  if (!rows.length) return ''
  const widths = rows[0].map((_, ci) => Math.max(...rows.map(r => String(r[ci] ?? '').length), 1))
  const pad = (s, w) => String(s).padEnd(w)
  const header  = '| ' + rows[0].map((h, i) => pad(h, widths[i])).join(' | ') + ' |'
  const divider = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |'
  const body    = rows.slice(1).map(r => '| ' + r.map((c, i) => pad(c, widths[i])).join(' | ') + ' |')
  return [header, divider, ...body].join('\n')
}

function toHtml(rows) {
  if (!rows.length) return ''
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const thead = `  <thead>\n    <tr>\n${rows[0].map(h => `      <th>${esc(h)}</th>`).join('\n')}\n    </tr>\n  </thead>`
  const tbody = `  <tbody>\n${rows.slice(1).map(r => `    <tr>\n${r.map(c => `      <td>${esc(c)}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>`
  return `<table>\n${thead}\n${tbody}\n</table>`
}

function toJson(rows) {
  if (rows.length < 2) return '[]'
  const headers = rows[0]
  return JSON.stringify(rows.slice(1).map(row => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
    return obj
  }), null, 2)
}

function toAscii(rows) {
  if (!rows.length) return ''
  const widths = rows[0].map((_, ci) => Math.max(...rows.map(r => String(r[ci] ?? '').length), 1))
  const border = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+'
  const row = (r) => '|' + r.map((c, i) => ` ${String(c).padEnd(widths[i])} `).join('|') + '|'
  return [border, row(rows[0]), border, ...rows.slice(1).map(row), border].join('\n')
}

// ── component ────────────────────────────────────────────────────────────

const INPUT_FORMATS  = ['CSV', 'TSV', 'Markdown', 'HTML']
const OUTPUT_FORMATS = ['CSV', 'TSV', 'Markdown', 'HTML', 'JSON', 'ASCII']

const SAMPLE = `Name,Age,City,Job
Alice,29,New York,Engineer
Bob,35,London,Designer
Carol,42,Paris,Manager`

export default function TableConverter() {
  const [inputFmt,  setInputFmt]  = useState('CSV')
  const [outputFmt, setOutputFmt] = useState('Markdown')
  const [input, setInput]         = useState(SAMPLE)
  const [copied, setCopied]       = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try {
      let rows
      if (inputFmt === 'CSV')      rows = parseCsv(input)
      else if (inputFmt === 'TSV') rows = parseTsv(input)
      else if (inputFmt === 'Markdown') rows = parseMarkdown(input)
      else                         rows = parseHtml(input)

      if (!rows.length) return ''

      if (outputFmt === 'CSV')      return toCsv(rows)
      if (outputFmt === 'TSV')      return toTsv(rows)
      if (outputFmt === 'Markdown') return toMarkdown(rows)
      if (outputFmt === 'HTML')     return toHtml(rows)
      if (outputFmt === 'JSON')     return toJson(rows)
      if (outputFmt === 'ASCII')    return toAscii(rows)
      return ''
    } catch (e) {
      return `Error: ${e.message}`
    }
  }, [input, inputFmt, outputFmt])

  const isError = output.startsWith('Error:')

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Table Format Converter</h1>
      <p className="tool-description">
        Convert tables between CSV, TSV, Markdown, HTML, JSON, and ASCII art formats — all in your browser.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <label>Input format</label>
          <div className="chip-group" style={{ marginTop: '0.25rem' }}>
            {INPUT_FORMATS.map(f => (
              <button key={f} className={`chip ${inputFmt === f ? 'active' : ''}`} onClick={() => setInputFmt(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <label>Output format</label>
          <div className="chip-group" style={{ marginTop: '0.25rem' }}>
            {OUTPUT_FORMATS.map(f => (
              <button key={f} className={`chip ${outputFmt === f ? 'active' : ''}`} onClick={() => setOutputFmt(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <label htmlFor="tc-input">Input ({inputFmt})</label>
      <textarea
        id="tc-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your table data here…"
        rows={8}
        style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output ({outputFmt})</label>
            {!isError && <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>}
          </div>
          <pre className={`code-block ${isError ? 'error' : ''}`} style={{ whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.88rem', lineHeight: 1.55, maxHeight: 400 }}>
            {output}
          </pre>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '📊', name: 'CSV → JSON',     path: '/tools/csv-to-json' },
        { icon: '📊', name: 'JSON → CSV',     path: '/tools/json-to-csv' },
        { icon: '🗂️', name: 'JSON Formatter', path: '/tools/json-formatter' },
        { icon: '🔧', name: 'XML Formatter',  path: '/tools/xml-formatter' },
      ]} />
      <ToolSeo />
    </div>
  )
}
