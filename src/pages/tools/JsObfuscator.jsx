import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function simpleObfuscate(code) {
  // Basic obfuscation: hex encode strings, mangle simple identifiers
  let obfuscated = code

  // Hex encode string literals
  obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
    const hex = Array.from(str).map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    return `'${hex}'`
  })

  obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
    const hex = Array.from(str).map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    return `"${hex}"`
  })

  // Simple variable name obfuscation (very basic)
  const varMap = new Map()
  let counter = 0
  obfuscated = obfuscated.replace(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, type, name) => {
    if (!varMap.has(name)) {
      varMap.set(name, '_0x' + counter.toString(16))
      counter++
    }
    return `${type} ${varMap.get(name)}`
  })

  // Replace variable references
  varMap.forEach((obfName, origName) => {
    const regex = new RegExp(`\\b${origName}\\b`, 'g')
    obfuscated = obfuscated.replace(regex, obfName)
  })

  // Remove comments
  obfuscated = obfuscated.replace(/\/\/.*$/gm, '')
  obfuscated = obfuscated.replace(/\/\*[\s\S]*?\*\//g, '')

  // Remove extra whitespace
  obfuscated = obfuscated.replace(/\s+/g, ' ').trim()

  return obfuscated
}

function simpleDeobfuscate(code) {
  // Reverse hex encoding
  let deobfuscated = code

  deobfuscated = deobfuscated.replace(/'((?:\\x[0-9a-fA-F]{2})+)'/g, (match, hex) => {
    const str = hex.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    return `'${str}'`
  })

  deobfuscated = deobfuscated.replace(/"((?:\\x[0-9a-fA-F]{2})+)"/g, (match, hex) => {
    const str = hex.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    return `"${str}"`
  })

  return deobfuscated
}

export default function JsObfuscator() {
  const [mode, setMode] = useState('obfuscate')
  const [input, setInput] = useState('const message = "Hello World";\nconsole.log(message);')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const process = useCallback(() => {
    const code = input.trim()
    if (!code) {
      setOutput('')
      return
    }

    try {
      if (mode === 'obfuscate') {
        setOutput(simpleObfuscate(code))
      } else {
        setOutput(simpleDeobfuscate(code))
      }
    } catch (err) {
      setOutput('Error: ' + err.message)
    }
  }, [input, mode])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>JavaScript Obfuscator</h1>
      <p className="tool-description">
        Basic JavaScript obfuscation — hex-encode strings, mangle variables, and strip comments.
      </p>

      <div className="chip-group">
        <button
          className={`chip ${mode === 'obfuscate' ? 'active' : ''}`}
          onClick={() => setMode('obfuscate')}
        >
          🔒 Obfuscate
        </button>
        <button
          className={`chip ${mode === 'deobfuscate' ? 'active' : ''}`}
          onClick={() => setMode('deobfuscate')}
        >
          🔓 Deobfuscate
        </button>
      </div>

      <label htmlFor="jso-input">Input JavaScript</label>
      <textarea
        id="jso-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your JavaScript code here…"
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
      />

      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={process}>
        {mode === 'obfuscate' ? '🔒 Obfuscate' : '🔓 Deobfuscate'}
      </button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {output}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--muted)' }}>
        <strong>⚠ Note:</strong> This is a basic obfuscator for educational purposes. For production use, consider tools like{' '}
        <a href="https://obfuscator.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>javascript-obfuscator</a>.
      </div>

      <RelatedTools tools={[
        { icon: '🗜️', name: 'JS Minifier',    path: '/tools/js-minifier' },
        { icon: '🛠️', name: 'JS Formatter',   path: '/tools/js-formatter' },
        { icon: '🗂️', name: 'JSON Formatter', path: '/tools/json-formatter' },
        { icon: '🔒', name: 'Base64 Encode',  path: '/tools/base64' },
      ]} />
      <ToolSeo />
    </div>
  )
}
