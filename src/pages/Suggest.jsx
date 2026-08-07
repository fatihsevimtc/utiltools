import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

const CATEGORIES = ['Text', 'Developer', 'File', 'Image', 'Math / Numbers', 'Security', 'Other']
const PURPOSES = [
  { value: 'suggest', label: 'Suggest a tool' },
  { value: 'contact', label: 'Contact / support' },
]

// ─────────────────────────────────────────────────────────────
// Get your free access key at https://web3forms.com
// Enter your email there → they send the key instantly.
// Free tier: 250 submissions/month, no account needed.
// Set VITE_WEB3FORMS_KEY in your .env file (copy .env.example).
// ─────────────────────────────────────────────────────────────
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? 'YOUR_ACCESS_KEY'

export default function Suggest() {
  const [form, setForm] = useState({
    purpose: 'suggest',
    tool: '',
    category: 'Text',
    description: '',
    name: '',
    topic: 'General question',
    message: '',
    email: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  const isSuggest = form.purpose === 'suggest'

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    try {
      const payload = new FormData()
      payload.append('access_key', WEB3FORMS_KEY)
      payload.append('subject', isSuggest ? `Tool suggestion: ${form.tool}` : `Contact: ${form.topic}`)
      payload.append('from_name', 'UtilTools Inbox')
      payload.append('Purpose', isSuggest ? 'Suggest a tool' : 'Contact / support')

      if (isSuggest) {
        payload.append('Tool name', form.tool)
        payload.append('Category', form.category)
        payload.append('Description', form.description || '(no description)')
      } else {
        payload.append('Name', form.name || '(not provided)')
        payload.append('Topic', form.topic)
        payload.append('Message', form.message)
      }

      payload.append('User email', form.email || 'not provided')
      if (form.email) payload.append('replyto', form.email)

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
      })

      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (_) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: 520, textAlign: 'center', paddingTop: '3rem', margin: '0 auto' }}>
        <p style={{ fontSize: '3rem' }}>🙌</p>
        <h1 style={{ margin: '1rem 0 0.5rem' }}>Thanks, message received!</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          Your submission was sent successfully. If you left your email, we can follow up.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setStatus('idle')
              setForm({
                purpose: 'suggest',
                tool: '',
                category: 'Text',
                description: '',
                name: '',
                topic: 'General question',
                message: '',
                email: '',
              })
            }}
          >
            Send another
          </button>
          <Link to="/" className="btn">Back to tools</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <BackBar />
      <h1>Contact / Suggest</h1>
      <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.75rem' }}>
        Use one form for both tool ideas and support/business messages.
      </p>

      {WEB3FORMS_KEY === 'YOUR_ACCESS_KEY' && (
        <div className="notice notice-warning">
          <strong>Setup needed:</strong> Get your free access key at{' '}
          <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer">web3forms.com</a>
          {' '}— enter your email, they send the key instantly. Then replace{' '}
          <code>YOUR_ACCESS_KEY</code> in <code>Suggest.jsx</code>.
        </div>
      )}

      {status === 'error' && (
        <div className="notice notice-error">
          Something went wrong — please try again in a moment.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div>
          <label htmlFor="s-purpose">
            Purpose <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <select id="s-purpose" value={form.purpose} onChange={e => set('purpose', e.target.value)}>
            {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        {isSuggest ? (
          <>
            <div>
              <label htmlFor="s-tool">
                Tool name or idea <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="s-tool"
                type="text"
                required
                value={form.tool}
                onChange={e => set('tool', e.target.value)}
                placeholder="e.g. Markdown to HTML converter"
              />
            </div>

            <div>
              <label htmlFor="s-cat">Category</label>
              <select id="s-cat" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="s-desc">What should it do?</label>
              <textarea
                id="s-desc"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe it briefly — what you'd paste in, what comes out…"
                style={{ minHeight: 120 }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="c-topic">Topic</label>
              <select id="c-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
                <option value="General question">General question</option>
                <option value="Bug report">Bug report</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="c-message">
                Message <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <textarea
                id="c-message"
                required
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Tell us how we can help..."
                style={{ minHeight: 120 }}
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="s-email">
            Your email
            <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
              (optional)
            </span>
          </label>
          <input
            id="s-email"
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={status === 'loading'}
          style={{ alignSelf: 'flex-start' }}
        >
          {status === 'loading' ? 'Sending…' : 'Send'}
        </button>

      </form>
    </div>
  )
}
