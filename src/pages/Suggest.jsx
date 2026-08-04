import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

const CATEGORIES = ['Text', 'Developer', 'File', 'Image', 'Math / Numbers', 'Security', 'Other']

// ─────────────────────────────────────────────────────────────
// Get your free access key at https://web3forms.com
// Enter your email there → they send the key instantly.
// Free tier: 250 submissions/month, no account needed.
// ─────────────────────────────────────────────────────────────
const WEB3FORMS_KEY = 'e3d8cbe1-4f8d-441b-9f4d-b7f00f7f5e03'

export default function Suggest() {
  const [form, setForm] = useState({ tool: '', category: 'Text', description: '', email: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    try {
      const payload = new FormData()
      payload.append('access_key', WEB3FORMS_KEY)
      payload.append('subject', `Tool suggestion: ${form.tool}`)
      payload.append('from_name', 'UtilTools Suggestion')
      payload.append('Tool name', form.tool)
      payload.append('Category', form.category)
      payload.append('Description', form.description || '(no description)')
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
      <div style={{ maxWidth: 520, textAlign: 'center', paddingTop: '3rem' }}>
        <p style={{ fontSize: '3rem' }}>🙌</p>
        <h1 style={{ margin: '1rem 0 0.5rem' }}>Thanks for the suggestion!</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          Every idea gets read. If you left your email, I'll let you know when it ships.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setStatus('idle')
              setForm({ tool: '', category: 'Text', description: '', email: '' })
            }}
          >
            Submit another
          </button>
          <Link to="/" className="btn">Back to tools</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <BackBar />
      <h1>Suggest a tool</h1>
      <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.75rem' }}>
        Got a utility you wish existed here? Tell me what it does and I'll consider building it.
        All ideas are welcome — the more specific the better.
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

        <div>
          <label htmlFor="s-email">
            Your email
            <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
              (optional — I'll let you know when it ships)
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
          {status === 'loading' ? 'Sending…' : 'Send suggestion'}
        </button>

      </form>
    </div>
  )
}
