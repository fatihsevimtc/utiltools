import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'

const MODELS = [
  {
    name: 'GPT-4o',        provider: 'OpenAI',    released: 'May 2024',
    context: 128000,       inputCost: 5.00,       outputCost: 15.00,
    strengths: ['Multimodal (vision+audio)', 'Code generation', 'Reasoning', 'Speed vs GPT-4'],
    weaknesses: ['Costly at scale', 'No real-time web access by default'],
    bestFor: 'Complex reasoning, code, vision tasks',
    tier: 'frontier',
  },
  {
    name: 'GPT-4o mini',   provider: 'OpenAI',    released: 'Jul 2024',
    context: 128000,       inputCost: 0.15,       outputCost: 0.60,
    strengths: ['Very cheap', 'Fast', 'Good for simple tasks', 'Huge context'],
    weaknesses: ['Weaker at hard reasoning', 'Less capable than 4o'],
    bestFor: 'High-volume, cost-sensitive tasks, summarisation',
    tier: 'efficient',
  },
  {
    name: 'Claude 3.5 Sonnet', provider: 'Anthropic', released: 'Jun 2024',
    context: 200000,       inputCost: 3.00,       outputCost: 15.00,
    strengths: ['Excellent writing & reasoning', 'Very large context', 'Strong at coding', 'Artifacts feature'],
    weaknesses: ['Slower than some', 'No image generation'],
    bestFor: 'Long documents, code, creative writing, analysis',
    tier: 'frontier',
  },
  {
    name: 'Claude 3 Haiku', provider: 'Anthropic', released: 'Mar 2024',
    context: 200000,       inputCost: 0.25,       outputCost: 1.25,
    strengths: ['Extremely fast', 'Very cheap', 'Large context', 'Good for classification'],
    weaknesses: ['Less capable than Sonnet/Opus'],
    bestFor: 'Real-time tasks, classification, bulk processing',
    tier: 'efficient',
  },
  {
    name: 'Gemini 1.5 Pro', provider: 'Google',   released: 'May 2024',
    context: 1000000,      inputCost: 1.25,       outputCost: 5.00,
    strengths: ['1M token context (industry leading)', 'Multimodal', 'Good at long documents'],
    weaknesses: ['Variable quality on reasoning', 'Slower at large contexts'],
    bestFor: 'Entire codebases, long videos/docs, multimodal',
    tier: 'frontier',
  },
  {
    name: 'Gemini 1.5 Flash', provider: 'Google', released: 'May 2024',
    context: 1000000,      inputCost: 0.075,      outputCost: 0.30,
    strengths: ['Extremely fast', 'Cheapest per token', '1M context', 'Good multimodal'],
    weaknesses: ['Less accurate than Pro on hard tasks'],
    bestFor: 'Fast, cheap, high-volume tasks with large context needs',
    tier: 'efficient',
  },
  {
    name: 'Llama 3.1 405B', provider: 'Meta (open)', released: 'Jul 2024',
    context: 128000,       inputCost: 0.90,       outputCost: 0.90,
    strengths: ['Open weights', 'Competitive with GPT-4', 'Self-hostable', 'No usage restrictions'],
    weaknesses: ['Expensive to self-host', 'Slower inference at scale'],
    bestFor: 'Privacy-sensitive tasks, fine-tuning, open-source projects',
    tier: 'open',
  },
  {
    name: 'Llama 3.1 70B',  provider: 'Meta (open)', released: 'Jul 2024',
    context: 128000,       inputCost: 0.09,       outputCost: 0.09,
    strengths: ['Open weights', 'Very cheap via API', 'Strong for its size', 'Self-hostable'],
    weaknesses: ['Weaker than frontier models on hard tasks'],
    bestFor: 'Cost-efficient production, fine-tuning, open-source',
    tier: 'open',
  },
  {
    name: 'Mistral Large',  provider: 'Mistral',   released: 'Feb 2024',
    context: 32000,        inputCost: 3.00,       outputCost: 9.00,
    strengths: ['Strong multilingual', 'Function calling', 'EU-based / GDPR friendly'],
    weaknesses: ['Smaller context than competitors', 'Less known ecosystem'],
    bestFor: 'European deployments, multilingual, function calling',
    tier: 'frontier',
  },
  {
    name: 'Mistral 7B',     provider: 'Mistral',   released: 'Sep 2023',
    context: 32000,        inputCost: 0.03,       outputCost: 0.03,
    strengths: ['Ultra cheap', 'Fast', 'Open weights', 'Good for its size'],
    weaknesses: ['Limited capability vs larger models'],
    bestFor: 'Edge deployment, fine-tuning, very simple tasks',
    tier: 'open',
  },
]

const TIER_COLORS = { frontier: '#6366f1', efficient: '#10b981', open: '#f59e0b' }
const TIER_LABELS = { frontier: '🚀 Frontier', efficient: '⚡ Efficient', open: '🔓 Open source' }

export default function AiModelComparison() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set(['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro']))
  const [view, setView] = useState('cards') // cards | table | compare

  function toggleSelect(name) {
    setSelected(s => {
      const n = new Set(s)
      n.has(name) ? n.delete(name) : n.add(name)
      return n
    })
  }

  let models = [...MODELS]
  if (filter !== 'all') models = models.filter(m => m.tier === filter)
  if (search) models = models.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()))
  if (sortBy === 'context') models.sort((a, b) => b.context - a.context)
  else if (sortBy === 'inputCost') models.sort((a, b) => a.inputCost - b.inputCost)
  else if (sortBy === 'outputCost') models.sort((a, b) => a.outputCost - b.outputCost)
  else models.sort((a, b) => a.name.localeCompare(b.name))

  const compareModels = MODELS.filter(m => selected.has(m.name))
  const maxContext = Math.max(...MODELS.map(m => m.context))

  return (
    <div className="tool-page">
      <BackBar />
      <h1>AI Model Comparison</h1>
      <p className="tool-description">Compare leading LLMs by context window, cost, strengths, and best use cases.</p>

      {/* ── View switcher — always visible ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div className="chip-group" style={{ margin: 0 }}>
          <button className={`chip ${view === 'cards'   ? 'active' : ''}`} onClick={() => setView('cards')}>🃏 Cards</button>
          <button className={`chip ${view === 'table'   ? 'active' : ''}`} onClick={() => setView('table')}>📋 Table</button>
          <button className={`chip ${view === 'compare' ? 'active' : ''}`} onClick={() => setView('compare')}>
            ⚖️ Compare{selected.size > 0 ? ` (${selected.size})` : ''}
          </button>
        </div>
      </div>

      {/* ── Filter + search + sort — only in Cards and Table ── */}
      {view !== 'compare' && (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models…" style={{ flex: 1, minWidth: 160 }} />
            <div className="chip-group" style={{ margin: 0 }}>
              {[['all','All'], ['frontier','Frontier'], ['efficient','Efficient'], ['open','Open']].map(([v, l]) => (
                <button key={v} className={`chip ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--muted)' }}>Sort:</span>
            {[['name','Name'], ['context','Context'], ['inputCost','Input $/1M'], ['outputCost','Output $/1M']].map(([v, l]) => (
              <button key={v} onClick={() => setSortBy(v)} style={{ background: sortBy === v ? 'var(--accent)' : 'var(--surface)', color: sortBy === v ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font)' }}>{l}</button>
            ))}
          </div>
        </>
      )}

      {/* ── Cards view ── */}
      {view === 'cards' && (
        <>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            💡 Click a card to select it for <button className="chip" style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', display: 'inline', cursor: 'pointer' }} onClick={() => setView('compare')}>Compare</button>.
            {selected.size > 0 && <strong style={{ color: 'var(--text)', marginLeft: '0.3rem' }}>{selected.size} selected.</strong>}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '0.75rem' }}>
            {models.map(m => (
              <div key={m.name} onClick={() => toggleSelect(m.name)} style={{ background: 'var(--surface)', borderRadius: 12, padding: '1rem', border: `2px solid ${selected.has(m.name) ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative' }}>
                {selected.has(m.name) && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{m.provider} · {m.released}</div>
                  </div>
                  <span style={{ background: TIER_COLORS[m.tier], color: '#fff', borderRadius: 20, padding: '0.15rem 0.55rem', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap', marginRight: selected.has(m.name) ? '1.5rem' : 0 }}>{TIER_LABELS[m.tier]}</span>
                </div>
                <div style={{ marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                    <span>Context</span>
                    <span>{(m.context / 1000).toFixed(0)}K tokens</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--border)' }}>
                    <div style={{ width: `${(m.context / maxContext) * 100}%`, height: '100%', background: TIER_COLORS[m.tier], borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                  <span style={{ background: 'var(--bg)', borderRadius: 6, padding: '0.15rem 0.5rem', border: '1px solid var(--border)' }}>In: ${m.inputCost}/1M</span>
                  <span style={{ background: 'var(--bg)', borderRadius: 6, padding: '0.15rem 0.5rem', border: '1px solid var(--border)' }}>Out: ${m.outputCost}/1M</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>Best for: </strong>{m.bestFor}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Table view ── */}
      {view === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Model','Provider','Context','Input $/1M','Output $/1M','Tier','Best for'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', whiteSpace: 'nowrap', color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={m.name} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '0.45rem 0.75rem', color: 'var(--muted)' }}>{m.provider}</td>
                  <td style={{ padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}>{(m.context / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}>${m.inputCost}</td>
                  <td style={{ padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}>${m.outputCost}</td>
                  <td style={{ padding: '0.45rem 0.75rem' }}>
                    <span style={{ background: TIER_COLORS[m.tier], color: '#fff', borderRadius: 20, padding: '0.1rem 0.5rem', fontSize: '0.7rem' }}>{m.tier}</span>
                  </td>
                  <td style={{ padding: '0.45rem 0.75rem', color: 'var(--muted)', fontSize: '0.78rem' }}>{m.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Compare view ── */}
      {view === 'compare' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)', fontSize: '0.82rem' }}>
              Select models to compare (click to toggle):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {MODELS.map(m => (
                <button
                  key={m.name}
                  onClick={() => toggleSelect(m.name)}
                  style={{
                    background: selected.has(m.name) ? TIER_COLORS[m.tier] : 'var(--surface)',
                    color: selected.has(m.name) ? '#fff' : 'var(--muted)',
                    border: `1px solid ${selected.has(m.name) ? TIER_COLORS[m.tier] : 'var(--border)'}`,
                    borderRadius: 20, padding: '0.25rem 0.75rem',
                    fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font)',
                    transition: 'all 0.15s',
                  }}
                >
                  {selected.has(m.name) ? '✓ ' : ''}{m.name}
                </button>
              ))}
            </div>
          </div>
          {compareModels.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Select at least one model above to start comparing.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--border)' }}>Aspect</th>
                    {compareModels.map(m => (
                      <th key={m.name} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--border)', color: TIER_COLORS[m.tier] }}>{m.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Provider',         m => m.provider],
                    ['Released',         m => m.released],
                    ['Context window',   m => `${(m.context/1000).toFixed(0)}K tokens`],
                    ['Input cost /1M',   m => `$${m.inputCost}`],
                    ['Output cost /1M',  m => `$${m.outputCost}`],
                    ['Tier',             m => TIER_LABELS[m.tier]],
                    ['Best for',         m => m.bestFor],
                    ['Strengths',        m => m.strengths.join(', ')],
                    ['Weaknesses',       m => m.weaknesses.join(', ')],
                  ].map(([label, fn]) => (
                    <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.45rem 0.75rem', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</td>
                      {compareModels.map(m => (
                        <td key={m.name} style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top' }}>{fn(m)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
        Pricing as of mid-2024. Always check provider websites for current rates. Costs shown per 1M tokens.
      </p>
      <RelatedTools category="ai" exclude="/tools/ai-model-comparison" />
    </div>
  )
}
