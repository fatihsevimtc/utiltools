import { useState, useRef, useCallback } from 'react'
import BackBar from '../../components/BackBar'

/* ── Unicode bold / italic converters ──────────────────────────────── */
const BOLD_MAP   = {}
const ITALIC_MAP = {}
const BOLD_ITALIC_MAP = {}

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const BOLD_CHARS   = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
const ITALIC_CHARS = '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'

;[...ALPHA].forEach((c, i) => {
  BOLD_MAP[c]   = [...BOLD_CHARS][i] ?? c
  if (i < 52) ITALIC_MAP[c] = [...ITALIC_CHARS][i] ?? c
})

function applyMap(text, map) {
  return [...text].map(c => map[c] ?? c).join('')
}

/* ── Emoji sets ─────────────────────────────────────────────────────── */
const EMOJI_GROUPS = {
  'Hands & People': ['👋','🤝','👍','💪','🙌','🫶','🤜','🤛','✊','👏','🙏','💼','🧠','👀','💡','🎯','🏆','⭐','✨','🌟'],
  'Business':       ['📈','📉','📊','💰','💵','🏦','🤑','💸','📱','💻','🖥️','⌨️','🖱️','🖨️','📷','📸','🎙️','🎤','📢','📣'],
  'Actions':        ['🚀','🔥','⚡','💥','🎉','🎊','🎁','🏅','🥇','🎖️','🏋️','🤸','🧗','🏃','🚶','💃','🕺','🛠️','🔧','⚙️'],
  'Symbols':        ['✅','❌','⚠️','ℹ️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔺','🔻','➡️','⬅️','⬆️','⬇️','↗️','↘️'],
  'Nature':         ['🌱','🌿','🍀','🌳','🌲','🌻','🌹','🌺','🌸','💐','🌈','☀️','🌙','⭐','❄️','🌊','🔥','💧','🌍','🌏'],
  'Faces':          ['😊','😄','🤩','😎','🤔','😤','🥳','😍','🤗','😅','😂','🥰','😇','🤓','😜','🧐','😏','🙂','🫡','🤌'],
}

/* ── Section dividers ───────────────────────────────────────────────── */
const DIVIDERS = [
  '━━━━━━━━━━━━━━━━━━━━━',
  '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
  '- - - - - - - - - - - - - - -',
  '• • • • • • • • • • • • • • •',
  '◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆',
  '════════════════════',
  '▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷▷',
]

/* ── Bullet styles ──────────────────────────────────────────────────── */
const BULLETS = ['•','▸','▶','◆','★','✦','➤','→','►','◉','⚡','🔹','🔸','✅']

/* ── LinkedIn character limit ───────────────────────────────────────── */
const MAX_CHARS = 3000
const PREVIEW_LIMIT = 210 // "see more" kicks in

export default function LinkedInPostMaker() {
  const [text, setText] = useState('')
  const [activeEmoji, setActiveEmoji] = useState('Hands & People')
  const [showEmoji, setShowEmoji] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef()

  /* Insert at cursor */
  const insertAt = useCallback((str) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end   = el.selectionEnd
    const next  = text.slice(0, start) + str + text.slice(end)
    setText(next)
    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + [...str].length
      el.focus()
    })
  }, [text])

  /* Wrap selection */
  const wrapSelection = useCallback((mapFn) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end   = el.selectionEnd
    const selected = text.slice(start, end)
    if (!selected) return
    const wrapped = applyMap(selected, mapFn)
    const next = text.slice(0, start) + wrapped + text.slice(end)
    setText(next)
    requestAnimationFrame(() => {
      el.selectionStart = start
      el.selectionEnd   = start + [...wrapped].length
      el.focus()
    })
  }, [text])

  const charCount = [...text].length // count Unicode code points
  const overLimit = charCount > MAX_CHARS
  const progressPct = Math.min((charCount / MAX_CHARS) * 100, 100)
  const progressColor = charCount > MAX_CHARS * 0.9 ? 'var(--danger)' : charCount > MAX_CHARS * 0.7 ? '#f59e0b' : 'var(--accent)'

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function clear() { setText('') }

  function addHook() {
    const hooks = [
      'Most people don\'t know this about ',
      'I made a mistake last year.\n\nHere\'s what I learned:\n\n',
      'Unpopular opinion:\n\n',
      'Stop doing this if you want to grow:\n\n',
      'The best advice I ever received:\n\n',
      '3 things I wish I knew earlier:\n\n1. \n2. \n3. ',
      'A lesson that took me years to learn:\n\n',
      'Here\'s something I\'ve never shared publicly:\n\n',
    ]
    insertAt(hooks[Math.floor(Math.random() * hooks.length)])
  }

  function addCTA() {
    const ctas = [
      '\n\n♻️ Repost if you found this useful.\n👇 Drop your thoughts in the comments.',
      '\n\n💬 What\'s your take? Let me know below.\n♻️ Share this with someone who needs to see it.',
      '\n\n👋 Follow me for more posts like this.\n💡 Save this for later.',
      '\n\n→ What would you add? Comment below.\n→ Share if you agree.',
    ]
    insertAt(ctas[Math.floor(Math.random() * ctas.length)])
  }

  /* Preview: show "... see more" after 210 chars */
  const [expanded, setExpanded] = useState(false)
  const previewText = text || 'Your post will appear here…'
  const showSeeMore = [...previewText].length > PREVIEW_LIMIT && !expanded
  const displayText = showSeeMore ? [...previewText].slice(0, PREVIEW_LIMIT).join('') + '…' : previewText

  return (
    <div className="tool-page">
      <BackBar />
      <h1>LinkedIn Post Maker</h1>
      <p className="tool-description">
        Format LinkedIn posts with Unicode bold/italic, emojis, dividers, and bullet styles — then copy ready-to-paste text.
      </p>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem', background: 'var(--surface)', padding: '0.5rem 0.75rem', borderRadius: 10, border: '1px solid var(--border)' }}>

        {/* Bold / Italic */}
        <button className="btn btn-sm" onClick={() => wrapSelection(BOLD_MAP)} title="Bold selection (Unicode)">
          <strong>B</strong>
        </button>
        <button className="btn btn-sm" onClick={() => wrapSelection(ITALIC_MAP)} title="Italic selection (Unicode)" style={{ fontStyle: 'italic' }}>
          I
        </button>

        <div style={{ width: 1, background: 'var(--border)', margin: '0 0.25rem' }} />

        {/* Dividers */}
        <div style={{ position: 'relative' }}>
          <select
            onChange={e => { insertAt('\n' + e.target.value + '\n'); e.target.value = '' }}
            defaultValue=""
            style={{ padding: '0.25rem 0.5rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <option value="" disabled>─ Divider</option>
            {DIVIDERS.map((d, i) => <option key={i} value={d}>{d.slice(0, 12)}…</option>)}
          </select>
        </div>

        {/* Bullets */}
        <div>
          <select
            onChange={e => { insertAt(e.target.value + ' '); e.target.value = '' }}
            defaultValue=""
            style={{ padding: '0.25rem 0.5rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <option value="" disabled>• Bullet</option>
            {BULLETS.map(b => <option key={b} value={b}>{b} Bullet</option>)}
          </select>
        </div>

        <div style={{ width: 1, background: 'var(--border)', margin: '0 0.25rem' }} />

        {/* Hook & CTA */}
        <button className="btn btn-sm" onClick={addHook} title="Insert a hook opener">🪝 Hook</button>
        <button className="btn btn-sm" onClick={addCTA}  title="Insert a call to action">📣 CTA</button>

        <div style={{ width: 1, background: 'var(--border)', margin: '0 0.25rem' }} />

        {/* Emoji toggle */}
        <button className="btn btn-sm" onClick={() => setShowEmoji(s => !s)} title="Emoji picker">
          😊 Emoji
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-sm" onClick={clear} style={{ color: 'var(--danger)' }}>Clear</button>
        </div>
      </div>

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            {Object.keys(EMOJI_GROUPS).map(g => (
              <button key={g} className={`chip ${activeEmoji === g ? 'active' : ''}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={() => setActiveEmoji(g)}>{g}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {EMOJI_GROUPS[activeEmoji].map(em => (
              <button
                key={em}
                onClick={() => insertAt(em)}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '0.25rem 0.4rem', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}
                title={em}
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Editor + Preview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Editor */}
        <div>
          <label htmlFor="li-editor">
            Editor
            <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: overLimit ? 'var(--danger)' : 'var(--muted)' }}>
              {charCount}/{MAX_CHARS}
            </span>
          </label>
          <textarea
            id="li-editor"
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ minHeight: 340, fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
            placeholder="Start writing your LinkedIn post…"
          />
          {/* Character bar */}
          <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', marginTop: '0.35rem', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: progressColor, borderRadius: 2, transition: 'width 0.2s, background 0.3s' }} />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label>LinkedIn preview</label>
          <div style={{ background: '#fff', color: '#000', borderRadius: 10, border: '1px solid #dde0e4', padding: '1rem', minHeight: 340, fontSize: '0.88rem', lineHeight: 1.6, overflowY: 'auto' }}>
            {/* Fake profile header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid #eee' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>Y</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#000' }}>Your Name</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Your headline · 1st</div>
                <div style={{ fontSize: '0.72rem', color: '#999' }}>Just now · 🌐</div>
              </div>
            </div>

            {/* Post body */}
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#1d2226' }}>
              {displayText}
              {showSeeMore && (
                <button onClick={() => setExpanded(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontWeight: 600, fontSize: '0.88rem', padding: 0, marginLeft: '0.25rem' }}>
                  see more
                </button>
              )}
              {expanded && [...previewText].length > PREVIEW_LIMIT && (
                <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontWeight: 600, fontSize: '0.88rem', padding: 0, marginLeft: '0.25rem' }}>
                  see less
                </button>
              )}
            </div>

            {/* Engagement row */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.6rem', borderTop: '1px solid #eee', fontSize: '0.78rem', color: '#666' }}>
              <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>📤 Send</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        <button className="btn" onClick={copy} disabled={!text}>
          {copied ? '✓ Copied to clipboard!' : '📋 Copy post'}
        </button>
      </div>

      {/* Tips */}
      <div style={{ marginTop: '1.5rem', background: 'var(--surface)', borderRadius: 10, padding: '0.9rem 1rem', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--text)' }}>💡 Tips</strong>
        <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0, lineHeight: 1.8 }}>
          <li>Select text then click <strong>B</strong> or <strong>I</strong> to apply Unicode bold/italic — works in LinkedIn.</li>
          <li>Keep the first 2–3 lines punchy — only ~210 characters show before "see more".</li>
          <li>Use blank lines to create visual breathing room.</li>
          <li>LinkedIn max is 3,000 characters per post.</li>
        </ul>
      </div>
    </div>
  )
}
