import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

/**
 * BPE-style token estimator — closely matches GPT-4 / GPT-3.5-turbo tokenization.
 * Rule: ~4 chars per token on average English prose, but we use a better heuristic:
 *   - Split on spaces & punctuation boundaries
 *   - Each whitespace run = 1 token
 *   - Each punctuation char is often its own token
 *   - Numbers each digit is often a separate token
 */
function estimateTokens(text) {
  if (!text) return 0
  // Rough GPT-4 tokenizer approximation
  const words = text.match(/[a-zA-Z]+|[0-9]+|[^\s\w]/g) || []
  let tokens = 0
  for (const w of words) {
    if (/^[a-zA-Z]+$/.test(w)) {
      // Common short words → 1 token, longer → ceil(len/4)
      tokens += w.length <= 4 ? 1 : Math.ceil(w.length / 4)
    } else if (/^[0-9]+$/.test(w)) {
      tokens += w.length  // each digit often separate
    } else {
      tokens += 1  // punctuation / symbol
    }
  }
  // Add tokens for whitespace patterns
  const spaces = (text.match(/\s+/g) || []).length
  tokens += Math.ceil(spaces * 0.8)
  return Math.max(1, Math.round(tokens))
}

const MODELS = [
  { name: 'GPT-4o',          contextWindow: 128000, inputPer1k: 0.005,  outputPer1k: 0.015  },
  { name: 'GPT-4o mini',     contextWindow: 128000, inputPer1k: 0.00015,outputPer1k: 0.0006 },
  { name: 'GPT-4 Turbo',     contextWindow: 128000, inputPer1k: 0.01,   outputPer1k: 0.03   },
  { name: 'GPT-3.5 Turbo',   contextWindow: 16385,  inputPer1k: 0.0005, outputPer1k: 0.0015 },
  { name: 'Claude 3.5 Sonnet',contextWindow: 200000,inputPer1k: 0.003,  outputPer1k: 0.015  },
  { name: 'Claude 3 Haiku',  contextWindow: 200000, inputPer1k: 0.00025,outputPer1k: 0.00125},
  { name: 'Gemini 1.5 Pro',  contextWindow: 1000000,inputPer1k: 0.00125,outputPer1k: 0.005  },
  { name: 'Llama 3.1 70B',   contextWindow: 128000, inputPer1k: 0.0009, outputPer1k: 0.0009 },
]

export default function TokenCounter() {
  const [text, setText]     = useState('')
  const [model, setModel]   = useState('GPT-4o')
  const [calls, setCalls]   = useState(1)

  const tokens = useMemo(() => estimateTokens(text), [text])
  const words  = useMemo(() => (text.match(/\S+/g) || []).length, [text])
  const chars  = text.length

  const selectedModel = MODELS.find(m => m.name === model) ?? MODELS[0]
  const pctOfContext  = tokens / selectedModel.contextWindow * 100
  const costInput     = (tokens / 1000) * selectedModel.inputPer1k * calls
  const barColor = pctOfContext > 90 ? 'var(--danger)' : pctOfContext > 70 ? '#f59e0b' : 'var(--success)'

  function fmt(n) {
    if (n < 0.0001) return `$${(n * 1000).toFixed(4)} per 1k`
    return `$${n.toFixed(4)}`
  }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Token Counter</h1>
      <p className="tool-description">
        Estimate token count for any text and see how it fits in each model's context window, plus cost estimates.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label>Model</label>
          <select value={model} onChange={e => setModel(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
            {MODELS.map(m => <option key={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>API calls</label>
          <input type="number" min={1} value={calls} onChange={e => setCalls(Number(e.target.value))} style={{ width: 80 }} />
        </div>
      </div>

      <label htmlFor="tc-text">Text to count</label>
      <textarea
        id="tc-text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your prompt or document here…"
        style={{ minHeight: 200 }}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
        {[
          ['~Tokens', tokens.toLocaleString(), '🪙'],
          ['Words',   words.toLocaleString(), '📝'],
          ['Chars',   chars.toLocaleString(), '🔤'],
        ].map(([label, val, icon]) => (
          <div key={label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '0.9rem', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem' }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Context usage */}
      {text && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <span>Context window usage: <strong style={{ color: barColor }}>{pctOfContext.toFixed(1)}%</strong></span>
            <span style={{ color: 'var(--muted)' }}>{tokens.toLocaleString()} / {selectedModel.contextWindow.toLocaleString()} tokens</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(pctOfContext, 100)}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          {pctOfContext > 100 && <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.3rem' }}>⚠ Exceeds context window by {((pctOfContext - 100)).toFixed(0)}%</p>}

          {/* Cost breakdown */}
          <div style={{ marginTop: '1rem', background: 'var(--surface)', borderRadius: 10, padding: '0.9rem 1rem', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}>💵 Cost estimate — {selectedModel.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Input: {tokens.toLocaleString()} tokens × {calls} call{calls !== 1 ? 's' : ''}</span>
                <strong>{fmt(costInput)}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                Rates: ${selectedModel.inputPer1k}/1k input · ${selectedModel.outputPer1k}/1k output
              </div>
            </div>
          </div>

          {/* All models comparison */}
          <div style={{ marginTop: '1rem' }}>
            <label>All models — context usage</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {MODELS.map(m => {
                const pct = Math.min(tokens / m.contextWindow * 100, 100)
                const over = tokens > m.contextWindow
                return (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ minWidth: 150, fontSize: '0.8rem', color: over ? 'var(--danger)' : 'var(--text)' }}>{m.name}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--danger)' : 'var(--success)', borderRadius: 4 }} />
                    </div>
                    <span style={{ minWidth: 44, fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
        ⚠ Token counts are estimates. Exact counts depend on each model's tokenizer. For GPT models use OpenAI's tiktoken for precise counts.
      </p>
          <ToolSeo />
    </div>
  )
}
