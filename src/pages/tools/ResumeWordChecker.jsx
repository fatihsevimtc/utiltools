import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'

const WEAK_WORDS = [
  { word: 'responsible for', reason: 'Vague ownership. Use an action verb: "Led", "Owned", "Managed".' },
  { word: 'responsibilities included', reason: 'Passive. Start with what you did: "Built", "Designed", "Delivered".' },
  { word: 'assisted with', reason: 'Downplays your role. Use "Contributed to", "Co-led", or describe your specific action.' },
  { word: 'helped', reason: 'Weak verb. Be specific: "Reduced", "Improved", "Enabled".' },
  { word: 'worked on', reason: 'Non-specific. Replace with a concrete action and outcome.' },
  { word: 'worked with', reason: 'Vague. Specify: "Collaborated with 5 engineers to…"' },
  { word: 'involved in', reason: 'Passive. State your direct contribution.' },
  { word: 'participated in', reason: 'Weak. Describe what you specifically did or achieved.' },
  { word: 'familiar with', reason: 'Suggests limited knowledge. Either claim proficiency or omit.' },
  { word: 'experience with', reason: 'Weak phrasing. Replace with a concrete skill or achievement.' },
  { word: 'knowledge of', reason: 'Vague. Show don\'t tell — demonstrate with an accomplishment.' },
  { word: 'basic knowledge', reason: 'Undermines you. Either prove the skill or leave it out.' },
  { word: 'strong communication skills', reason: 'Overused cliché. Show it through specific examples.' },
  { word: 'team player', reason: 'Cliché. Replace with a specific cross-team achievement.' },
  { word: 'detail-oriented', reason: 'Overused. Show attention to detail through results.' },
  { word: 'hard worker', reason: 'Unquantifiable. Let your achievements speak.' },
  { word: 'proactive', reason: 'Cliché. Give a concrete example instead.' },
  { word: 'go-getter', reason: 'Cliché. Replace with measurable impact.' },
  { word: 'passionate about', reason: 'Subjective filler. Use a fact or result instead.' },
  { word: 'various', reason: 'Vague. Be specific about what "various" means.' },
  { word: 'several', reason: 'Vague. Use exact numbers where possible.' },
  { word: 'etc.', reason: 'Lazy shorthand. List specifics or omit.' },
  { word: 'managed a team', reason: 'How big? "Managed a team of 6 engineers" is stronger.' },
  { word: 'improved', reason: 'By how much? Add a metric: "Improved load time by 40%".' },
  { word: 'increased', reason: 'Quantify it: "Increased conversion rate by 15%".' },
  { word: 'decreased', reason: 'Quantify it: "Decreased support tickets by 30%".' },
  { word: 'reduced', reason: 'Great verb — add a number: "Reduced costs by $20k/year".' },
]

function highlight(text, matches) {
  if (!matches.length) return [{ text, match: false }]
  let result = []; let last = 0
  const sorted = [...matches].sort((a,b) => a.start - b.start)
  for (const m of sorted) {
    if (m.start > last) result.push({ text: text.slice(last, m.start), match: false })
    result.push({ text: text.slice(m.start, m.end), match: true, reason: m.reason })
    last = m.end
  }
  if (last < text.length) result.push({ text: text.slice(last), match: false })
  return result
}

export default function ResumeWordChecker() {
  const [text, setText] = useState('')
  const [selected, setSelected] = useState(null)

  const { matches, issues } = useMemo(() => {
    if (!text) return { matches: [], issues: [] }
    const lower = text.toLowerCase()
    const found = []
    for (const { word, reason } of WEAK_WORDS) {
      let idx = 0
      while ((idx = lower.indexOf(word, idx)) !== -1) {
        found.push({ start: idx, end: idx + word.length, word, reason })
        idx += word.length
      }
    }
    const sorted = found.sort((a,b) => a.start - b.start)
    // Deduplicate overlaps
    const deduped = []; let lastEnd = -1
    for (const m of sorted) { if (m.start >= lastEnd) { deduped.push(m); lastEnd = m.end } }
    const uniqueIssues = [...new Map(deduped.map(m => [m.word, m])).values()]
    return { matches: deduped, issues: uniqueIssues }
  }, [text])

  const segments = highlight(text, matches)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Resume Word Checker</h1>
      <p className="tool-description">Paste your resume and get flagged for weak, vague, or clichéd language with specific suggestions.</p>

      <label htmlFor="rw-input">Paste your resume text</label>
      <textarea id="rw-input" value={text} onChange={e => setText(e.target.value)}
        placeholder="Paste your resume content here…" style={{ minHeight: 200 }} />

      {text && (
        <>
          <div className="stats-row" style={{ margin: '1rem 0' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ color: issues.length ? 'var(--warning)' : 'var(--success)' }}>{issues.length}</div>
              <div className="stat-label">Issues found</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{matches.length}</div>
              <div className="stat-label">Total occurrences</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{text.trim().split(/\s+/).length}</div>
              <div className="stat-label">Words</div>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="notice" style={{ background: 'rgba(46,204,113,0.1)', border: '1px solid var(--success)', color: 'var(--success)' }}>
              ✓ No weak phrases detected. Great work!
            </div>
          ) : (
            <>
              {/* Highlighted preview */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', lineHeight: 1.8, marginBottom: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                {segments.map((seg, i) =>
                  seg.match ? (
                    <span key={i}
                      onClick={() => setSelected(seg.reason)}
                      style={{ background: selected === seg.reason ? 'rgba(243,156,18,0.4)' : 'rgba(243,156,18,0.25)', color: 'var(--warning)', borderRadius: 3, cursor: 'pointer', padding: '0 2px' }}
                      title={seg.reason}
                    >{seg.text}</span>
                  ) : <span key={i}>{seg.text}</span>
                )}
              </div>

              {selected && (
                <div className="notice notice-warning" style={{ marginBottom: '1rem' }}>
                  💡 {selected}
                  <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)' }} onClick={() => setSelected(null)}>✕</button>
                </div>
              )}

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {issues.map((issue, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--warning)', fontSize: '1rem' }}>⚠</span>
                      <div>
                        <strong style={{ fontSize: '0.88rem' }}>"{issue.word}"</strong>
                        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>{issue.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
