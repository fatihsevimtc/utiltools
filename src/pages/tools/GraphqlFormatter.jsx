import { useState } from 'react'
import BackBar from '../../components/BackBar'

function formatGraphql(gql) {
  let indent = 0
  const lines = gql.replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').split('\n')
  const result = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line === '}') {
      indent = Math.max(0, indent - 1)
      result.push('  '.repeat(indent) + line)
    } else if (line.endsWith('{')) {
      result.push('  '.repeat(indent) + line)
      indent++
    } else {
      result.push('  '.repeat(indent) + line)
    }
  }
  return result.join('\n').trim()
}

export default function GraphqlFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = input ? formatGraphql(input) : ''

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>GraphQL Formatter</h1>
      <p className="tool-description">Format and indent GraphQL queries and schema definitions.</p>

      <label htmlFor="gql-input">GraphQL input</label>
      <textarea
        id="gql-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'query { user { id name email } }'}
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      {output && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted output</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre' }}>{output}</div>
        </div>
      )}
    </div>
  )
}
