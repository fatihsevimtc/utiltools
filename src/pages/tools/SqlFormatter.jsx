import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

const KEYWORDS = [
  'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
  'FULL JOIN','CROSS JOIN','ON','AND','OR','NOT','IN','BETWEEN','LIKE','IS NULL',
  'IS NOT NULL','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET','DISTINCT',
  'INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','DROP TABLE',
  'ALTER TABLE','ADD COLUMN','DROP COLUMN','PRIMARY KEY','FOREIGN KEY','REFERENCES',
  'UNIQUE','NOT NULL','DEFAULT','INDEX','UNION','UNION ALL','EXCEPT','INTERSECT',
  'CASE','WHEN','THEN','ELSE','END','AS','WITH','CTE','EXPLAIN','ANALYZE',
]

function formatSQL(sql) {
  let s = sql.replace(/\s+/g, ' ').trim()

  // Uppercase keywords
  const re = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'gi')
  s = s.replace(re, m => m.toUpperCase())

  // Newlines before major clauses
  const clauses = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN',
    'OUTER JOIN','FULL JOIN','ON','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET',
    'UNION','UNION ALL','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','WITH']
  for (const kw of clauses) {
    s = s.replace(new RegExp(`\\b${kw}\\b`, 'g'), '\n' + kw)
  }

  // Indent AND / OR
  s = s.replace(/\b(AND|OR)\b/g, '\n  $1')

  // Indent items after SELECT (comma-separated)
  s = s.replace(/,\s*/g, ',\n  ')

  return s.replace(/^\n/, '').trim()
}

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function format() {
    setOutput(formatSQL(input))
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
      <h1>SQL Formatter</h1>
      <p className="tool-description">Prettify SQL queries with consistent indentation and uppercased keywords.</p>

      <label htmlFor="sql-input">Input SQL</label>
      <textarea
        id="sql-input"
        value={input}
        onChange={e => { setInput(e.target.value); setOutput('') }}
        placeholder="select id,name from users where active=1 order by name"
        style={{ minHeight: 160, fontFamily: 'monospace' }}
      />

      <button className="btn" style={{ marginTop: '1rem' }} onClick={format}>Format</button>

      {output && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>Formatted SQL</label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
          <ToolSeo />
    </div>
  )
}
