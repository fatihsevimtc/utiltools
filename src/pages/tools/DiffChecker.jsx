import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

function computeDiff(a, b) {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const result = []

  // Simple LCS-based line diff
  const m = linesA.length
  const n = linesB.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  function trace(i, j) {
    if (i === 0 && j === 0) return
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      trace(i - 1, j - 1)
      result.push({ type: 'same', text: linesA[i - 1] })
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      trace(i, j - 1)
      result.push({ type: 'added', text: linesB[j - 1] })
    } else {
      trace(i - 1, j)
      result.push({ type: 'removed', text: linesA[i - 1] })
    }
  }

  trace(m, n)
  return result
}

export default function DiffChecker() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const diff = useMemo(() => {
    if (!left && !right) return []
    return computeDiff(left, right)
  }, [left, right])

  const added   = diff.filter(d => d.type === 'added').length
  const removed = diff.filter(d => d.type === 'removed').length

  return (
    <div className="tool-page" style={{ maxWidth: '100%' }}>
      <BackBar />
      <h1>Text Diff Checker</h1>
      <p className="tool-description">
        Paste two versions of your text. Additions are green, removals are red.
      </p>

      <div className="diff-grid">
        <div>
          <label htmlFor="diff-left">Original</label>
          <textarea
            id="diff-left"
            value={left}
            onChange={e => setLeft(e.target.value)}
            placeholder="Paste original text…"
            style={{ minHeight: 200 }}
          />
        </div>
        <div>
          <label htmlFor="diff-right">Changed</label>
          <textarea
            id="diff-right"
            value={right}
            onChange={e => setRight(e.target.value)}
            placeholder="Paste changed text…"
            style={{ minHeight: 200 }}
          />
        </div>
      </div>

      {diff.length > 0 && (
        <div className="diff-output">
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--success)' }}>+{added} added</span>
            <span style={{ color: 'var(--danger)' }}>−{removed} removed</span>
            <span style={{ color: 'var(--muted)' }}>{diff.filter(d => d.type === 'same').length} unchanged</span>
          </div>
          <div className="code-block" style={{ padding: '0.5rem' }}>
            {diff.map((line, i) => (
              <div key={i} className={`diff-line ${line.type}`}>
                <span style={{ opacity: 0.5, marginRight: '0.5rem', userSelect: 'none' }}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                </span>
                {line.text || ' '}
              </div>
            ))}
          </div>
        </div>
      )}
      <RelatedTools category="developer" exclude="/tools/diff-checker" />
          <ToolSeo />
    </div>
  )
}
