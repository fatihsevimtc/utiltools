import { useState, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function WordRemover() {
  const [input, setInput] = useState('')
  const [targets, setTargets] = useState('')
  const [mode, setMode] = useState('word') // 'word' | 'sentence' | 'line' | 'contains'
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)

  const process = useCallback(() => {
    const text = input
    const targetList = targets
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)

    if (!text || targetList.length === 0) {
      setOutput(text)
      setStats(null)
      return
    }

    let result = text
    let removedCount = 0

    if (mode === 'word') {
      // Remove specific words (whole-word match)
      for (const target of targetList) {
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const flags = caseSensitive ? 'g' : 'gi'
        const rx = new RegExp(`\\b${escaped}\\b`, flags)
        const before = result
        result = result.replace(rx, '')
        // Count replacements roughly
        const diff = (before.match(rx) || []).length
        removedCount += diff
      }
      // Clean up double spaces left behind
      result = result.replace(/  +/g, ' ').replace(/ ,/g, ',').replace(/ \./g, '.').trim()
    } else if (mode === 'sentence') {
      // Remove sentences containing the target words
      // Split into sentences by .!? keeping the delimiter
      const sentences = result.split(/(?<=[.!?])\s+/)
      const kept = []
      for (const sentence of sentences) {
        const check = caseSensitive ? sentence : sentence.toLowerCase()
        const shouldRemove = targetList.some(t => {
          const needle = caseSensitive ? t : t.toLowerCase()
          return check.includes(needle)
        })
        if (shouldRemove) {
          removedCount++
        } else {
          kept.push(sentence)
        }
      }
      result = kept.join(' ')
    } else if (mode === 'line') {
      // Remove lines containing the target words
      const lines = result.split('\n')
      const kept = []
      for (const line of lines) {
        const check = caseSensitive ? line : line.toLowerCase()
        const shouldRemove = targetList.some(t => {
          const needle = caseSensitive ? t : t.toLowerCase()
          return check.includes(needle)
        })
        if (shouldRemove) {
          removedCount++
        } else {
          kept.push(line)
        }
      }
      result = kept.join('\n')
    } else if (mode === 'contains') {
      // Remove any occurrence (substring match, not word-boundary)
      for (const target of targetList) {
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const flags = caseSensitive ? 'g' : 'gi'
        const rx = new RegExp(escaped, flags)
        const before = result
        result = result.replace(rx, '')
        const diff = (before.match(rx) || []).length
        removedCount += diff
      }
      result = result.replace(/  +/g, ' ').trim()
    }

    setOutput(result)
    setStats({ removed: removedCount })
  }, [input, targets, mode, caseSensitive])

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const MODES = [
    { id: 'word',     label: '🔤 Remove Words (whole-word)' },
    { id: 'contains', label: '🔎 Remove Occurrences (substring)' },
    { id: 'sentence', label: '📄 Remove Sentences containing word' },
    { id: 'line',     label: '📏 Remove Lines containing word' },
  ]

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>Word / Sentence Remover</h1>
      <p className="tool-description">
        Remove specific words, occurrences, sentences, or lines from any text instantly — entirely in your browser.
      </p>

      <div className="chip-group" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            className={`chip ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'start' }}>
        <div>
          <label htmlFor="wr-input">Your text</label>
          <textarea
            id="wr-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your text here…"
            rows={10}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', gap: '0.25rem', userSelect: 'none' }}>
          <span style={{ fontSize: '1.25rem' }}>🗑️</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>remove</span>
        </div>

        <div>
          <label htmlFor="wr-targets">Words / phrases to remove (one per line)</label>
          <textarea
            id="wr-targets"
            value={targets}
            onChange={e => setTargets(e.target.value)}
            placeholder={'the\nand\nbut'}
            rows={10}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '0.75rem 0' }}>
        <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer', marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
          />
          Case-sensitive
        </label>
      </div>

      <button className="btn" onClick={process}>
        🗑️ Remove
      </button>

      {output !== '' && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ marginBottom: 0 }}>
              Output
              {stats && (
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '0.6rem' }}>
                  {stats.removed} removal{stats.removed !== 1 ? 's' : ''}
                </span>
              )}
            </label>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            style={{ resize: 'vertical', background: 'var(--surface)' }}
            aria-label="Output text"
          />
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🗑️', name: 'Character Remover',   path: '/tools/character-remover' },
        { icon: '😶', name: 'Emoji Remover',         path: '/tools/emoji-remover' },
        { icon: '🔎', name: 'Find & Replace',        path: '/tools/find-replace' },
        { icon: '🧼', name: 'Special Char Remover',  path: '/tools/special-char-remover' },
      ]} />
    </div>
  )
}
