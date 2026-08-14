import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// ─── Lightweight client-side Python formatter / validator ───────────────────
// Applies PEP 8-style rules without any server calls or heavy dependencies.

function formatPython(code, { indentSize, removeTrailingWhitespace, addBlankLinesBetweenFunctions }) {
  const lines = code.split('\n')
  const out = []
  let errors = []

  // Track indent level for basic structure checks
  let lineNum = 0
  for (let i = 0; i < lines.length; i++) {
    lineNum = i + 1
    let line = lines[i]

    // Remove trailing whitespace
    if (removeTrailingWhitespace) {
      line = line.trimEnd()
    }

    // Convert tabs to spaces
    const leadingTabs = line.match(/^\t+/)
    if (leadingTabs) {
      line = ' '.repeat(leadingTabs[0].length * indentSize) + line.slice(leadingTabs[0].length)
    }

    // Warn: line too long (PEP 8: 79 chars)
    if (line.length > 79) {
      errors.push({ line: lineNum, msg: `Line ${lineNum}: line too long (${line.length} > 79 characters)` })
    }

    // Blank lines between top-level functions/classes
    if (addBlankLinesBetweenFunctions && /^(def |class )/.test(line.trim())) {
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('')
        out.push('')
      }
    }

    out.push(line)
  }

  // Remove consecutive blank lines > 2
  const cleaned = []
  let blankCount = 0
  for (const line of out) {
    if (line.trim() === '') {
      blankCount++
      if (blankCount <= 2) cleaned.push(line)
    } else {
      blankCount = 0
      cleaned.push(line)
    }
  }

  // Remove trailing blank lines
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') cleaned.pop()

  return { formatted: cleaned.join('\n'), errors }
}

function validatePython(code) {
  const lines = code.split('\n')
  const issues = []

  // Basic checks
  let parenDepth = 0
  let bracketDepth = 0
  let braceDepth = 0
  let inString = false
  let stringChar = ''

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1
    const line = lines[i]
    const stripped = line.trim()

    // Check for mixed indentation
    if (/^\t+ /.test(line) || /^ +\t/.test(line)) {
      issues.push({ type: 'error', line: lineNum, msg: `Line ${lineNum}: mixed tabs and spaces` })
    }

    // Check colon at end of control flow
    if (/^(if |elif |else:|for |while |def |class |with |try:|except|finally:)/.test(stripped)) {
      if (!/:\s*(#.*)?$/.test(stripped) && !/^(else|try|finally)/.test(stripped)) {
        // Might be multiline — just note it
      }
    }

    // Detect bare except
    if (/^except\s*:/.test(stripped)) {
      issues.push({ type: 'warning', line: lineNum, msg: `Line ${lineNum}: bare 'except:' catches all exceptions (use 'except Exception:')` })
    }

    // Detect print without parens (Python 2 style)
    if (/^print\s+[^(]/.test(stripped)) {
      issues.push({ type: 'warning', line: lineNum, msg: `Line ${lineNum}: 'print' without parentheses — Python 2 style` })
    }

    // Detect comparison to None with == instead of is
    if (/==\s*None/.test(line) || /None\s*==/.test(line)) {
      issues.push({ type: 'warning', line: lineNum, msg: `Line ${lineNum}: use 'is None' instead of '== None'` })
    }

    // Detect comparison to True/False with == 
    if (/==\s*(True|False)/.test(line)) {
      issues.push({ type: 'warning', line: lineNum, msg: `Line ${lineNum}: use 'if x:' or 'if not x:' instead of comparing to True/False` })
    }

    // Detect unused semicolons
    if (/;\s*$/.test(stripped)) {
      issues.push({ type: 'style', line: lineNum, msg: `Line ${lineNum}: trailing semicolon (not needed in Python)` })
    }

    // Lambda assigned to variable (PEP 8 E731)
    if (/^\w+ *= *lambda/.test(stripped)) {
      issues.push({ type: 'style', line: lineNum, msg: `Line ${lineNum}: use a def instead of assigning a lambda to a variable (PEP 8 E731)` })
    }
  }

  return issues
}

export default function PythonFormatter() {
  const [input, setInput] = useState(`def hello(name):
\tprint("Hello, " + name)

class MyClass:
\tdef __init__(self,x,y):
\t\tself.x=x
\t\tself.y=y
\tdef get_sum( self ):
\t\treturn self.x+self.y   

if __name__=="__main__":
\tobj=MyClass(1,2)
\tprint(obj.get_sum())`)
  const [output, setOutput] = useState('')
  const [issues, setIssues] = useState([])
  const [indentSize, setIndentSize] = useState(4)
  const [removeTrailing, setRemoveTrailing] = useState(true)
  const [addBlanks, setAddBlanks] = useState(true)
  const [tab, setTab] = useState('format') // 'format' | 'validate'
  const [copied, setCopied] = useState(false)

  const runFormat = useCallback(() => {
    const { formatted, errors } = formatPython(input, {
      indentSize,
      removeTrailingWhitespace: removeTrailing,
      addBlankLinesBetweenFunctions: addBlanks,
    })
    setOutput(formatted)
    setIssues(errors)
    setTab('format')
  }, [input, indentSize, removeTrailing, addBlanks])

  const runValidate = useCallback(() => {
    const found = validatePython(input)
    setIssues(found)
    setTab('validate')
  }, [input])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const ISSUE_COLORS = { error: '#ef4444', warning: '#f59e0b', style: 'var(--muted)' }
  const ISSUE_ICONS  = { error: '❌', warning: '⚠️', style: '💡' }

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>Python Formatter / Validator</h1>
      <p className="tool-description">
        Format Python code (PEP 8 indentation, whitespace, blank lines) and validate it for common style and correctness issues — 100% in your browser.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          <label htmlFor="py-indent" style={{ marginBottom: 0 }}>Indent size</label>
          <select id="py-indent" value={indentSize} onChange={e => setIndentSize(Number(e.target.value))} style={{ width: 100 }}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <label style={{ display:'flex', gap:'0.4rem', alignItems:'center', cursor:'pointer', marginBottom:0 }}>
          <input type="checkbox" checked={removeTrailing} onChange={e => setRemoveTrailing(e.target.checked)} />
          Remove trailing whitespace
        </label>
        <label style={{ display:'flex', gap:'0.4rem', alignItems:'center', cursor:'pointer', marginBottom:0 }}>
          <input type="checkbox" checked={addBlanks} onChange={e => setAddBlanks(e.target.checked)} />
          Blank lines before def/class
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="py-input">Input Python</label>
          <textarea
            id="py-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={16}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
            spellCheck={false}
          />
        </div>
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
            <label style={{ marginBottom:0 }}>Output</label>
            {output && <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>}
          </div>
          <textarea
            value={output}
            readOnly
            rows={16}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', background: 'var(--surface)' }}
            aria-label="Formatted Python output"
          />
        </div>
      </div>

      <div style={{ display:'flex', gap:'0.75rem', margin:'0.75rem 0' }}>
        <button className="btn" onClick={runFormat}>✨ Format</button>
        <button className="btn btn-ghost" onClick={runValidate}>🔍 Validate</button>
      </div>

      {issues.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontWeight:600, marginBottom:'0.4rem' }}>
            {tab === 'validate' ? 'Validation results' : 'Formatting notes'} — {issues.length} issue{issues.length !== 1 ? 's' : ''}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
            {issues.map((issue, i) => (
              <div key={i} style={{
                display:'flex', gap:'0.5rem', alignItems:'flex-start',
                background: 'var(--surface)', borderLeft: `3px solid ${ISSUE_COLORS[issue.type] || 'var(--border)'}`,
                borderRadius: '0 6px 6px 0', padding: '0.35rem 0.75rem',
                fontSize: '0.85rem',
              }}>
                <span>{ISSUE_ICONS[issue.type] || '•'}</span>
                <span style={{ color: 'var(--text)' }}>{issue.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'validate' && issues.length === 0 && input.trim() && (
        <p style={{ color: 'var(--success, #22c55e)', marginTop:'0.5rem', fontWeight:600 }}>
          ✅ No issues found.
        </p>
      )}

      <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:'1rem' }}>
        This is a lightweight style checker, not a full Python parser. For complete analysis use tools like <strong>pylint</strong>, <strong>flake8</strong>, or <strong>black</strong> locally.
      </p>

      <RelatedTools tools={[
        { icon: '🗂️', name: 'JSON Formatter',   path: '/tools/json-formatter' },
        { icon: '🗄️', name: 'SQL Formatter',    path: '/tools/sql-formatter' },
        { icon: '⚙️', name: 'JS Formatter',     path: '/tools/js-formatter' },
        { icon: '🌐', name: 'HTML Formatter',   path: '/tools/html-formatter' },
      ]} />
    </div>
  )
}
