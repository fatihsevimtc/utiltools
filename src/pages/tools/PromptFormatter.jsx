import { useState } from 'react'
import BackBar from '../../components/BackBar'

const ROLES = ['system', 'user', 'assistant']

const TEMPLATES = {
  'Chain of Thought': {
    messages: [
      { role: 'system',    content: 'You are a helpful assistant. Think step-by-step before giving your final answer. Use <thinking> tags for your reasoning.' },
      { role: 'user',      content: 'Your question here...' },
    ]
  },
  'Few-Shot Example': {
    messages: [
      { role: 'system',    content: 'You are a helpful assistant. Follow the examples below.' },
      { role: 'user',      content: 'Classify the sentiment: "I love this product!"' },
      { role: 'assistant', content: 'Positive' },
      { role: 'user',      content: 'Classify the sentiment: "This is terrible."' },
      { role: 'assistant', content: 'Negative' },
      { role: 'user',      content: 'Classify the sentiment: "Your text here..."' },
    ]
  },
  'RAG Context': {
    messages: [
      { role: 'system',    content: 'You are a helpful assistant. Use only the provided context to answer questions. If the answer is not in the context, say "I don\'t know."' },
      { role: 'user',      content: 'Context:\n"""\n{context}\n"""\n\nQuestion: {question}' },
    ]
  },
  'JSON Output': {
    messages: [
      { role: 'system',    content: 'You are a data extraction assistant. Always respond with valid JSON only, no markdown, no explanation.' },
      { role: 'user',      content: 'Extract the following fields from the text below: name, email, phone.\n\nText: {text}' },
    ]
  },
  'Persona': {
    messages: [
      { role: 'system',    content: 'You are Alex, a senior software engineer with 10 years of experience. You are concise, pragmatic, and prefer simple solutions over clever ones. You give direct advice and always consider trade-offs.' },
      { role: 'user',      content: 'Your question here...' },
    ]
  },
}

const FORMAT_OPTIONS = [
  { id: 'openai',   label: 'OpenAI / Anthropic JSON' },
  { id: 'xml',      label: 'XML (Claude style)' },
  { id: 'plain',    label: 'Plain text' },
  { id: 'langchain',label: 'LangChain Python' },
]

function toOpenAI(messages) {
  return JSON.stringify({ model: 'gpt-4o', messages }, null, 2)
}

function toXml(messages) {
  return messages.map(m =>
    `<${m.role}>\n${m.content}\n</${m.role}>`
  ).join('\n\n')
}

function toPlain(messages) {
  return messages.map(m =>
    `### ${m.role.toUpperCase()}\n${m.content}`
  ).join('\n\n')
}

function toLangchain(messages) {
  const imports = ['from langchain_core.messages import SystemMessage, HumanMessage, AIMessage', '']
  const lines = messages.map(m => {
    const cls = m.role === 'system' ? 'SystemMessage' : m.role === 'user' ? 'HumanMessage' : 'AIMessage'
    const content = m.content.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
    return `    ${cls}(content="${content}"),`
  })
  return [...imports, 'messages = [', ...lines, ']'].join('\n')
}

export default function PromptFormatter() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user',   content: '' },
  ])
  const [format, setFormat] = useState('openai')
  const [copied, setCopied] = useState(false)

  function addMessage() {
    setMessages(m => [...m, { role: 'user', content: '' }])
  }
  function removeMessage(i) {
    setMessages(m => m.filter((_, idx) => idx !== i))
  }
  function updateMessage(i, field, val) {
    setMessages(m => m.map((msg, idx) => idx === i ? { ...msg, [field]: val } : msg))
  }

  function applyTemplate(key) {
    setMessages(TEMPLATES[key].messages.map(m => ({ ...m })))
  }

  function getOutput() {
    switch (format) {
      case 'openai':    return toOpenAI(messages)
      case 'xml':       return toXml(messages)
      case 'plain':     return toPlain(messages)
      case 'langchain': return toLangchain(messages)
      default:          return toOpenAI(messages)
    }
  }

  const output = getOutput()

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const ROLE_COLORS = { system: '#6366f1', user: '#10b981', assistant: '#f59e0b' }

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Prompt Formatter</h1>
      <p className="tool-description">
        Build multi-turn prompts visually and export them as OpenAI JSON, XML, plain text, or LangChain Python.
      </p>

      {/* Templates */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Start from a template</label>
        <div className="chip-group" style={{ margin: 0, flexWrap: 'wrap' }}>
          {Object.keys(TEMPLATES).map(k => (
            <button key={k} className="chip" onClick={() => applyTemplate(k)}>{k}</button>
          ))}
        </div>
      </div>

      {/* Message editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <select
              value={msg.role}
              onChange={e => updateMessage(i, 'role', e.target.value)}
              style={{
                width: 100, padding: '0.45rem', borderRadius: 8, border: `2px solid ${ROLE_COLORS[msg.role]}`,
                background: 'var(--surface)', color: ROLE_COLORS[msg.role], fontWeight: 700, fontSize: '0.82rem',
                flexShrink: 0,
              }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <textarea
              value={msg.content}
              onChange={e => updateMessage(i, 'content', e.target.value)}
              placeholder={msg.role === 'system' ? 'System instructions…' : msg.role === 'user' ? 'User message…' : 'Assistant response…'}
              style={{ flex: 1, minHeight: 70, fontFamily: 'inherit', fontSize: '0.88rem', resize: 'vertical', borderLeft: `3px solid ${ROLE_COLORS[msg.role]}` }}
            />
            {messages.length > 1 && (
              <button className="btn btn-sm" onClick={() => removeMessage(i)} style={{ flexShrink: 0, padding: '0.3rem 0.5rem', marginTop: '0.3rem' }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-sm" onClick={addMessage} style={{ marginBottom: '1.25rem' }}>+ Add message</button>

      {/* Format selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="chip-group" style={{ margin: 0 }}>
          {FORMAT_OPTIONS.map(f => (
            <button key={f.id} className={`chip ${format === f.id ? 'active' : ''}`} onClick={() => setFormat(f.id)}>{f.label}</button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={copy}>{copied ? '✓ Copied' : 'Copy output'}</button>
      </div>

      <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', maxHeight: 400, overflow: 'auto' }}>
        {output}
      </div>
    </div>
  )
}
