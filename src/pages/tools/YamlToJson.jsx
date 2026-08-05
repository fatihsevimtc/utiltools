import { useState } from 'react'
import BackBar from '../../components/BackBar'

/**
 * Minimal YAML→JSON parser supporting:
 *  - key: value (string, number, boolean, null)
 *  - nested objects via indentation
 *  - lists starting with "- "
 *  - quoted strings
 */
function parseYaml(text) {
  const lines = text.split('\n').filter(l => !/^\s*#/.test(l))

  function parseValue(v) {
    const s = v.trim()
    if (s === 'true') return true
    if (s === 'false') return false
    if (s === 'null' || s === '~') return null
    if (/^-?\d+$/.test(s)) return parseInt(s, 10)
    if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s)
    if (/^['"].*['"]$/.test(s)) return s.slice(1, -1)
    return s
  }

  function indentOf(line) {
    return line.match(/^(\s*)/)[1].length
  }

  function parseBlock(startIdx, baseIndent) {
    const result = {}
    const list = []
    let isList = false
    let i = startIdx

    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) { i++; continue }
      const lineIndent = indentOf(line)
      if (lineIndent < baseIndent) break

      const listMatch = line.match(/^(\s*)- (.*)$/)
      if (listMatch && listMatch[1].length === baseIndent) {
        isList = true
        const val = listMatch[2].trim()
        if (val === '' || val === null) {
          // nested object/list on next lines
          const [obj, next] = parseBlock(i + 1, baseIndent + 2)
          list.push(obj)
          i = next
        } else {
          list.push(parseValue(val))
          i++
        }
        continue
      }

      const kvMatch = line.match(/^(\s*)([^:]+):\s?(.*)$/)
      if (kvMatch && kvMatch[1].length === baseIndent) {
        const key = kvMatch[2].trim()
        const val = kvMatch[3].trim()
        if (val === '' || val === '|' || val === '>') {
          // nested
          const [nested, next] = parseBlock(i + 1, baseIndent + 2)
          result[key] = nested
          i = next
        } else {
          result[key] = parseValue(val)
          i++
        }
        continue
      }
      break
    }

    return [isList ? list : result, i]
  }

  const [parsed] = parseBlock(0, 0)
  return JSON.stringify(parsed, null, 2)
}

export default function YamlToJson() {
  const [input, setInput] = useState('name: Alice\nage: 30\nhobbies:\n  - reading\n  - coding')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function convert() {
    try {
      setOutput(parseYaml(input))
      setError('')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
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
      <h1>YAML to JSON</h1>
      <p className="tool-description">Convert YAML to JSON — supports nested objects and lists.</p>

      <label htmlFor="y2j-input">Input YAML</label>
      <textarea
        id="y2j-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput(''); setError('') }}
        style={{ minHeight: 180, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={convert}>Convert</button>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.875rem' }}>⚠ {error}</p>}

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>JSON output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
