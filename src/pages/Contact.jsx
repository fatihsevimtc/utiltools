import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackBar from '../components/BackBar'

const TOPICS = [
  'General question',
  'Bug report',
  'Partnership',
  'Feature request follow-up',
  'Other',
]

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? 'YOUR_ACCESS_KEY'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: TOPICS[0],
    message: '',
  })
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
      payload.append('subject', `Contact us: ${form.topic}`)
      payload.append('from_name', 'UtilTools Contact')
      payload.append('Name', form.name)
      payload.append('Email', form.email)
      payload.append('Topic', form.topic)
      payload.append('Message', form.message)
      payload.append('replyto', form.email)

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
      <div style={{ maxWidth: 560, textAlign: 'center', paddingTop: '3rem', margin: '0 auto' }}>
        <p style={{ fontSize: '3rem' }}>✅</p>
        <h1 style={{ margin: '1rem 0 0.5rem' }}>Message sent</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          Thanks for reaching out. I will get back to you as soon as possible.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setStatus('idle')
              setForm({ name: '', email: '', topic: TOPICS[0], message: '' })
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
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <BackBar />
      <h1>Contact us</h1>
      <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.75rem' }}>
        Have a question, bug report, or business inquiry? Send a message below.
      </p>

      {WEB3FORMS_KEY === 'YOUR_ACCESS_KEY' && (
        <div className="notice notice-warning">
          <strong>Setup needed:</strong> Add <code>VITE_WEB3FORMS_KEY</code> to your <code>.env</code> file
          with your key from{' '}
          <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer">web3forms.com</a>.
        </div>
      )}

      {status === 'error' && (
        <div className="notice notice-error">
          Something went wrong. Please try again in a moment.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label htmlFor="c-name">
            Your name <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            id="c-name"
            type="text"
            required
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="c-email">
            Your email <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="c-topic">Topic</label>
          <select id="c-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
            {TOPICS.map(topic => <option key={topic} value={topic}>{topic}</option>)}
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
            style={{ minHeight: 140 }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={status === 'loading'}
          style={{ alignSelf: 'flex-start' }}
        >
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}
