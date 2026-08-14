import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// Convert JS value → PHP source string
function valueToPhp(val, depth = 0) {
  const indent = '    '.repeat(depth)
  const inner  = '    '.repeat(depth + 1)

  if (val === null)            return 'null'
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  if (typeof val === 'number')  return String(val)
  if (typeof val === 'string')  return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]'
    const items = val.map(v => `${inner}${valueToPhp(v, depth + 1)},`).join('\n')
    return `[\n${items}\n${indent}]`
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val)
    if (keys.length === 0) return '[]'
    const items = keys.map(k => {
      const phpKey = `'${k.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
      return `${inner}${phpKey} => ${valueToPhp(val[k], depth + 1)},`
    }).join('\n')
    return `[\n${items}\n${indent}]`
  }

  return `'${String(val)}'`
}

function jsonToPhp(json, varName) {
  const obj = JSON.parse(json)
  const php = valueToPhp(obj, 0)
  return `<?php\n\n$${varName} = ${php};\n`
}

// Convert PHP array → JSON (best-effort regex-based)
function phpToJson(phpStr) {
  // Strip <?php and variable assignment wrapper
  let s = phpStr.replace(/<\?php[\s\S]*?\$\w+\s*=\s*/, '').replace(/;\s*$/, '').trim()
  // Replace PHP array brackets and arrows with JSON equivalents
  // This is simplified — handles basic flat/nested arrays
  s = s
    .replace(/\[\s*\n/g, '[\n')
    .replace(/,\s*\n\s*\]/g, '\n]')  // trailing commas
    .replace(/=>/g, ':')
    .replace(/null/g, 'null')
    .replace(/true/g, 'true')
    .replace(/false/g, 'false')
    // single-quoted strings → double-quoted
    .replace(/'((?:[^'\\]|\\.)*)'/g, (_, m) => `"${m.replace(/\\'/g, "'").replace(/"/g, '\\"')}"`)

  return JSON.stringify(JSON.parse(s), null, 2)
}

export default function JsonToPhp() {
  const [mode, setMode]   = useState('json-to-php')
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "active": true,\n  "tags": ["admin", "user"],\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  }\n}')
  const [varName, setVarName] = useState('data')
  const [copied, setCopied]   = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try {
      if (mode === 'json-to-php') return jsonToPhp(input, varName || 'data')
      return phpToJson(input)
    } catch (e) {
      return `Error: ${e.message}`
    }
  }, [input, mode, varName])

  const isError = output.startsWith('Error:')

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function swap() {
    setInput(output.replace(/^Error:.*/, ''))
    setMode(m => m === 'json-to-php' ? 'php-to-json' : 'json-to-php')
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JSON ↔ PHP Array Converter</h1>
      <p className="tool-description">
        Convert JSON objects to PHP associative arrays and back. Supports nested objects, arrays, booleans, and null values.
      </p>

      <div className="chip-group">
        <button className={`chip ${mode === 'json-to-php' ? 'active' : ''}`} onClick={() => setMode('json-to-php')}>
          JSON → PHP
        </button>
        <button className={`chip ${mode === 'php-to-json' ? 'active' : ''}`} onClick={() => setMode('php-to-json')}>
          PHP → JSON
        </button>
      </div>

      {mode === 'json-to-php' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
          <label htmlFor="php-varname" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Variable name:</label>
          <input
            id="php-varname"
            type="text"
            value={varName}
            onChange={e => setVarName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder="data"
            style={{ width: 140, padding: '0.4rem 0.6rem', fontSize: '0.95rem', fontFamily: 'monospace' }}
          />
        </div>
      )}

      <label htmlFor="php-input">{mode === 'json-to-php' ? 'JSON Input' : 'PHP Array Input'}</label>
      <textarea
        id="php-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'json-to-php' ? '{"key": "value"}' : '<?php\n$data = ["key" => "value"];'}
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
      />

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>{mode === 'json-to-php' ? 'PHP Array Output' : 'JSON Output'}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isError && <button className="btn btn-ghost btn-sm" onClick={swap}>⇄ Swap</button>}
              {!isError && <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>}
            </div>
          </div>
          <pre className={`code-block ${isError ? 'error' : ''}`} style={{ whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.88rem', lineHeight: 1.55, maxHeight: 400 }}>
            {output}
          </pre>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🗂️', name: 'JSON Formatter',  path: '/tools/json-formatter' },
        { icon: '🔑', name: 'JSON Key Sorter',  path: '/tools/json-key-sorter' },
        { icon: '🔀', name: 'JSON Diff',        path: '/tools/json-diff' },
        { icon: '🔄', name: 'JSON → YAML',      path: '/tools/json-to-yaml' },
      ]} />
      <ToolSeo />
    </div>
  )
}
