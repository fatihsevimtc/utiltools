import { useState } from 'react'
import BackBar from '../../components/BackBar'
import ToolSeo from '../../components/ToolSeo'

/**
 * Prompt Improver — applies best-practice prompt engineering rules
 * entirely client-side. No API calls.
 */

// ── Rule definitions ────────────────────────────────────────────────
const RULES = [
  {
    id: 'role',
    label: 'Add a role',
    desc: 'Prepend "You are a [role]." to give the model a persona.',
    applies: text => !/^you are /i.test(text.trim()),
    fix: (text, ctx) => `You are ${ctx.role || 'a helpful expert'}.\n\n${text}`,
  },
  {
    id: 'context',
    label: 'Add context',
    desc: 'Explain the background so the model understands the situation.',
    applies: text => text.length < 120 && !/context|background|because|given that/i.test(text),
    fix: (text, ctx) => `${text}\n\nContext: ${ctx.context || '[Describe your background or goal here]'}`,
  },
  {
    id: 'format',
    label: 'Specify output format',
    desc: 'Tell the model exactly how to format the answer.',
    applies: text => !/format|bullet|numbered|json|markdown|table|paragraph|list/i.test(text),
    fix: (text, ctx) => `${text}\n\nRespond using ${ctx.format || 'clear bullet points'}.`,
  },
  {
    id: 'tone',
    label: 'Set the tone',
    desc: 'State the desired tone to match your audience.',
    applies: text => !/tone|formal|casual|friendly|professional|concise|simple/i.test(text),
    fix: (text, ctx) => `${text}\n\nTone: ${ctx.tone || 'professional and concise'}.`,
  },
  {
    id: 'cot',
    label: 'Request step-by-step reasoning',
    desc: 'Asking the model to think step by step improves accuracy.',
    applies: text => !/step.by.step|think through|reason|chain of thought/i.test(text),
    fix: text => `${text}\n\nThink step by step before giving your final answer.`,
  },
  {
    id: 'length',
    label: 'Constrain response length',
    desc: 'Prevent unnecessarily long or short answers.',
    applies: text => !/word|sentence|paragraph|brief|detailed|short|long|concise/i.test(text),
    fix: (text, ctx) => `${text}\n\nKeep your response ${ctx.length || 'under 300 words'}.`,
  },
  {
    id: 'example',
    label: 'Ask for an example',
    desc: 'Concrete examples anchor abstract answers.',
    applies: text => !/example|e\.g\.|for instance|illustrate|show me/i.test(text),
    fix: text => `${text}\n\nInclude at least one concrete example.`,
  },
  {
    id: 'nofluff',
    label: 'Ban filler phrases',
    desc: 'Remove "Certainly!", "Of course!" and similar padding.',
    applies: text => !/certainly|of course|absolutely|great question/i.test(text),
    fix: text => `${text}\n\nDo not start with filler phrases like "Certainly!" or "Of course!". Get straight to the answer.`,
  },
]

const TONES   = ['professional', 'casual', 'friendly', 'formal', 'concise', 'detailed', 'simple', 'technical']
const FORMATS = ['bullet points', 'numbered list', 'plain paragraphs', 'a table', 'JSON', 'Markdown', 'a short summary']
const LENGTHS = ['under 100 words', 'under 300 words', 'under 500 words', '1-2 paragraphs', '3-5 bullet points']
const ROLES   = [
  'a helpful expert', 'a senior software engineer', 'a product manager',
  'a data analyst', 'a professional writer', 'a patient teacher',
  'a marketing specialist', 'a UX designer',
]

// ── Score helpers ────────────────────────────────────────────────────
function scorePrompt(text) {
  if (!text.trim()) return 0
  let score = 20 // base
  if (/^you are /i.test(text.trim()))                                   score += 15
  if (text.length > 80)                                                  score += 10
  if (text.length > 200)                                                 score += 10
  if (/format|bullet|json|markdown|list|table/i.test(text))             score += 10
  if (/tone|formal|casual|professional/i.test(text))                    score += 10
  if (/step.by.step|think through|chain of thought/i.test(text))        score += 10
  if (/example|e\.g\.|for instance/i.test(text))                        score += 10
  if (/context|background|because|given that/i.test(text))              score += 10
  if (!/certainly|of course|absolutely/i.test(text))                    score += 5
  return Math.min(score, 100)
}

function scoreColor(s) {
  if (s >= 80) return 'var(--success)'
  if (s >= 50) return '#f59e0b'
  return 'var(--danger)'
}

function scoreLabel(s) {
  if (s >= 80) return 'Strong'
  if (s >= 50) return 'OK'
  return 'Weak'
}

// ── Component ────────────────────────────────────────────────────────
export default function PromptImprover() {
  const [input, setInput]       = useState('')
  const [role, setRole]         = useState(ROLES[0])
  const [tone, setTone]         = useState(TONES[0])
  const [format, setFormat]     = useState(FORMATS[0])
  const [length, setLength]     = useState(LENGTHS[1])
  const [context, setContext]   = useState('')
  const [active, setActive]     = useState(new Set(['role', 'format', 'cot', 'nofluff']))
  const [improved, setImproved] = useState('')
  const [copied, setCopied]     = useState(false)

  const score = scorePrompt(input)

  function toggle(id) {
    setActive(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function improve() {
    if (!input.trim()) return
    const ctx = { role, tone, format, length, context }
    let result = input.trim()
    for (const rule of RULES) {
      if (active.has(rule.id) && rule.applies(result)) {
        result = rule.fix(result, ctx)
      }
    }
    setImproved(result)
  }

  function copy() {
    navigator.clipboard.writeText(improved).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const applicableRules = RULES.filter(r => r.applies(input))

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Prompt Improver</h1>
      <p className="tool-description">
        Paste a basic prompt and apply best-practice prompt engineering rules — add roles, context, format instructions, and more. Everything runs in your browser.
      </p>

      {/* ── Input ── */}
      <label htmlFor="pi-input">Your prompt</label>
      <textarea
        id="pi-input"
        value={input}
        onChange={e => { setInput(e.target.value); setImproved('') }}
        placeholder="e.g. Explain machine learning to me."
        style={{ minHeight: 120 }}
      />

      {/* Score */}
      {input.trim() && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${score}%`, height: '100%', background: scoreColor(score), borderRadius: 4, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: '0.82rem', color: scoreColor(score), fontWeight: 600, minWidth: 90 }}>
            {score}/100 · {scoreLabel(score)}
          </span>
        </div>
      )}

      {/* ── Context fields ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Output format</label>
          <select value={format} onChange={e => setFormat(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.82rem' }}>Response length</label>
          <select value={length} onChange={e => setLength(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}>
            {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="pi-ctx" style={{ fontSize: '0.82rem' }}>Extra context (optional)</label>
        <input
          id="pi-ctx"
          type="text"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="e.g. I'm a beginner. This is for a blog post about React."
        />
      </div>

      {/* ── Rules ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label>Rules to apply</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {RULES.map(r => {
            const isApplicable = !input.trim() || r.applies(input)
            return (
              <label
                key={r.id}
                title={r.desc}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  cursor: 'pointer', fontSize: '0.84rem',
                  color: isApplicable ? 'var(--text)' : 'var(--muted)',
                  background: active.has(r.id) ? 'rgba(99,102,241,0.1)' : 'var(--surface)',
                  border: `1px solid ${active.has(r.id) ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 20, padding: '0.25rem 0.75rem',
                  opacity: isApplicable ? 1 : 0.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={active.has(r.id)}
                  onChange={() => toggle(r.id)}
                  style={{ width: 'auto', accentColor: 'var(--accent)', margin: 0 }}
                />
                {r.label}
                {input.trim() && !r.applies(input) && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)', marginLeft: '0.2rem' }}>✓ already present</span>
                )}
              </label>
            )
          })}
        </div>
        {input.trim() && applicableRules.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--success)', marginTop: '0.5rem' }}>
            ✅ Your prompt already follows all selected best practices!
          </p>
        )}
      </div>

      <button className="btn" onClick={improve} disabled={!input.trim()}>
        ✨ Improve prompt
      </button>

      {/* ── Output ── */}
      {improved && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ marginBottom: 0 }}>Improved prompt</label>
              {(() => {
                const newScore = scorePrompt(improved)
                return (
                  <span style={{ fontSize: '0.8rem', color: scoreColor(newScore), fontWeight: 600 }}>
                    {newScore}/100 · {scoreLabel(newScore)}
                    {newScore > score && <span style={{ color: 'var(--success)', marginLeft: '0.3rem' }}>↑ +{newScore - score}</span>}
                  </span>
                )
              })()}
            </div>
            <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: 1.7 }}>
            {improved}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', background: 'var(--surface)', borderRadius: 10, padding: '0.9rem 1rem', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--text)' }}>💡 How it works</strong>
        <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0, lineHeight: 1.8 }}>
          <li>Each rule checks if your prompt already covers that dimension — if so, it's skipped.</li>
          <li>Rules are applied in order, building up the improved prompt progressively.</li>
          <li>The score reflects how many best-practice dimensions your prompt covers.</li>
          <li>Nothing is sent to any server — all processing is in your browser.</li>
        </ul>
      </div>
          <ToolSeo />
    </div>
  )
}
