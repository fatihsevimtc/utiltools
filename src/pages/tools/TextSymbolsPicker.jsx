import { useState, useMemo } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// 1300+ Unicode symbols grouped by category
const SYMBOL_GROUPS = [
  {
    label: 'Math & Science',
    symbols: '± × ÷ ∞ √ ∛ ∜ ∑ ∏ ∫ ∂ ∆ ∇ ≈ ≠ ≤ ≥ ≡ ≢ ≣ ≤ ≥ ∈ ∉ ∋ ∌ ∩ ∪ ⊂ ⊃ ⊄ ⊅ ⊆ ⊇ ⊕ ⊖ ⊗ ⊘ ⊙ ⊚ ⊛ ⊜ ⊝ ∀ ∃ ∄ ∅ ∧ ∨ ¬ ⊤ ⊥ ∠ ∟ ⊾ ∡ ∢ ° ℃ ℉ ‰ ‱ ∝ ∞ ℵ ℶ ℷ ℸ ⅀ ⋅ ∗ ∘ ∙ ≀ ⋈ ⋉ ⋊ ⋋ ⋌ ⋍ ⋎ ⋏ ⋐ ⋑ ⋒ ⋓ ⊻ ⊼ ⊽ ⟨ ⟩ ⌈ ⌉ ⌊ ⌋ μ π Ω α β γ δ ε ζ η θ ι κ λ ν ξ ρ σ τ υ φ χ ψ ω Γ Δ Θ Λ Ξ Π Σ Φ Ψ'.split(' ').filter(Boolean),
  },
  {
    label: 'Arrows',
    symbols: '← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↚ ↛ ↜ ↝ ↞ ↟ ↠ ↡ ↢ ↣ ↤ ↥ ↦ ↧ ↨ ↩ ↪ ↫ ↬ ↭ ↮ ↯ ↰ ↱ ↲ ↳ ↴ ↵ ↶ ↷ ↸ ↹ ↺ ↻ ⇐ ⇒ ⇑ ⇓ ⇔ ⇕ ⇖ ⇗ ⇘ ⇙ ⇚ ⇛ ⇜ ⇝ ⇞ ⇟ ⇠ ⇡ ⇢ ⇣ ⇤ ⇥ ⇦ ⇧ ⇨ ⇩ ⇪ ⇫ ⇬ ⇭ ⇮ ⇯ ⟵ ⟶ ⟷ ⟸ ⟹ ⟺ ⟻ ⟼ ⟽ ⟾ ⟿ ➔ ➘ ➙ ➚ ➛ ➜ ➝ ➞ ➟ ➠ ➡ ➢ ➣ ➤ ➥ ➦ ➧ ➨ ➩ ➪ ➫ ➬ ➭ ➮ ➯ ➰ ➱ ➲ ➳ ➴ ➵ ➶ ➷ ➸ ➹ ➺ ➻ ➼ ➽ ➾'.split(' ').filter(Boolean),
  },
  {
    label: 'Stars & Shapes',
    symbols: '★ ☆ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⭐ 🌟 💫 ✨ ❄ ❅ ❆ ◆ ◇ ◈ ◉ ○ ● ◎ ◯ □ ■ ▪ ▫ ▬ ▭ ▮ ▯ △ ▲ ▴ ▵ ▶ ▷ ▸ ▹ ▻ ▼ ▽ ▾ ▿ ◀ ◁ ◂ ◃ ◄ ◅ ◆ ◇ ◈ ◉ ◊ ○ ◌ ◍ ◎ ● ◐ ◑ ◒ ◓ ◔ ◕ ◖ ◗ ◘ ◙ ◚ ◛ ◜ ◝ ◞ ◟ ◠ ◡ ◢ ◣ ◤ ◥ ◦ ◧ ◨ ◩ ◪ ◫ ◬ ◭ ◮ ☐ ☑ ☒ ❏ ❐ ❑ ❒ ⬛ ⬜ ⬝ ⬞ ⬟ ⬠ ⬡ ⬢ ⬣'.split(' ').filter(Boolean),
  },
  {
    label: 'Punctuation & Typography',
    symbols: `« » ‹ › \u201C \u201D \u2018 \u2019 \u201A \u201E \u201F … ‥ – — ― ¦ | ‖ ∕ ⁄ ⁓ ~ ¿ ¡ § ¶ † ‡ • ‣ ⁃ ◦ ‽ ⁅ ⁆ ‒ ⁁ ⌁ ⌃ ⌄ ⌅ ⌆ ⌇ ⌘ ⌙ ⌚ ⌛ ⌜ ⌝ ⌞ ⌟ ⌠ ⌡ ⌢ ⌣ ⌤ ⌥ ⌦ ⌧ ⌨ ⌫ ⌬ ⌭ ⌮ ⌯ ⌰ ⌱ ⌲ ⌳ ⌴ ⌵ ⌶ ⌷ ⌸ ⌹ ⌺ ⌻ ⌼ ⌽ ⌾ ⌿ ⍀ ⍁ ⍂ ⍃ ⍄ ⍅ ⍆ ⍇ ⍈ ⍉ ⍊ ⍋ ⍌ ⍍ ⍎ ⍏`.split(' ').filter(Boolean),
  },
  {
    label: 'Currency & Commerce',
    symbols: '$ € £ ¥ ¢ ₹ ₩ ₪ ₺ ₴ ₱ ฿ ₿ ₡ ₢ ₣ ₤ ₥ ₦ ₧ ₨ ₫ ₭ ₮ ₯ ₰ ₲ ₳ ₵ ₶ ₷ ₸ ₻ ₼ ₽ ₾ ₿ © ® ™ ℗ ℠ № ℃ ℉ ℓ ℅ ℆ ℗'.split(' ').filter(Boolean),
  },
  {
    label: 'Cards & Chess',
    symbols: '♠ ♣ ♥ ♦ ♤ ♧ ♡ ♢ ♔ ♕ ♖ ♗ ♘ ♙ ♚ ♛ ♜ ♝ ♞ ♟ 🂠 🂡 🂢 🂣 🂤 🂥 🂦 🂧 🂨 🂩 🂪 🂫 🂬 🂭 🂮 🂱 🂲 🂳 🂴 🂵 🂶 🂷 🂸 🂹 🂺 🂻 🂼 🂽 🂾'.split(' ').filter(Boolean),
  },
  {
    label: 'Music & Sound',
    symbols: '♩ ♪ ♫ ♬ ♭ ♮ ♯ 𝄞 𝄟 𝄠 𝄡 𝄢 𝄣 𝄤 𝄥 𝄦 𝄫 𝄬 𝅗𝅥 𝅘𝅥 𝅘𝅥𝅮 𝅘𝅥𝅯 𝅘𝅥𝅰 𝅘𝅥𝅱 𝅘𝅥𝅲 🎵 🎶 🎼 🎤 🎧 🎷 🎸 🎹 🎺 🎻 🥁 🪘 🎙'.split(' ').filter(Boolean),
  },
  {
    label: 'Religious & Cultural',
    symbols: '✝ ✞ ✟ ✠ ☨ ✡ ☯ ☮ ☪ ☫ ☬ ☭ ☦ ☧ ☩ ☫ ✙ ✚ ✛ ✜ ♾ ⚕ ⚖ ⚗ ⚘ ⚙ ⚚ ⚛ ⚜ ⚝ ⚞ ⚟ ⚠ ⚡ ⚢ ⚣ ⚤ ⚥ ⚦ ⚧ ⚨ ⚩ ⚪ ⚫ ⚬ ⚭ ⚮ ⚯ ⚰ ⚱ ⚲ ⚳ ⚴ ⚵ ⚶ ⚷ ⚸ ⚹ ⚺ ⚻ ⚼ ⚽ ⚾ ⚿ ⛀ ⛁ ⛂ ⛃'.split(' ').filter(Boolean),
  },
  {
    label: 'Weather & Nature',
    symbols: '☀ ☁ ☂ ☃ ☄ ★ ☆ ☇ ☈ ☉ ☊ ☋ ☌ ☍ ☎ ☏ ☐ ☑ ☒ ☓ ☔ ☕ ☖ ☗ ☘ ☙ ☚ ☛ ☜ ☝ ☞ ☟ ☠ ☡ ☢ ☣ ☤ ☥ ☦ ☧ ☨ ☩ ☪ ☫ ☬ ☭ ☮ ☯ ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷ ☸ ☹ ☺ ☻ ☼ ☽ ☾ ☿ ♀ ♁ ♂ ♃ ♄ ♅ ♆ ♇ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓'.split(' ').filter(Boolean),
  },
  {
    label: 'Hands & People',
    symbols: '☚ ☛ ☜ ☝ ☞ ☟ ✋ ✌ ✍ ✎ ✏ ✐ ✑ ✒ 👆 👇 👈 👉 👊 👋 👌 👍 👎 👏 👐 🤝 🤜 🤛 🤞 🤟 🤘 🤙 🖕 🖖 🖗 🖘 🖙 🖚 🖛 🖜 🖝 🖞 🖟 🖠 🖡 🖢 🖣 🖤 🖥 🖦 🖧 🖨 🖩 🖪 🖫 🖬 🖭 🖮 🖯 🖰 🖱 🖲 🖳 🖴 🖵 🖶 🖷 🖸 🖹 🖺 🖻'.split(' ').filter(Boolean),
  },
  {
    label: 'Superscript & Subscript',
    symbols: '⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁼ ⁽ ⁾ ⁿ ⁱ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₊ ₋ ₌ ₍ ₎ ₐ ₑ ₒ ₓ ₔ ₕ ₖ ₗ ₘ ₙ ₚ ₛ ₜ'.split(' ').filter(Boolean),
  },
  {
    label: 'Fractions & Number Forms',
    symbols: '¼ ½ ¾ ⅓ ⅔ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅛ ⅜ ⅝ ⅞ ⅟ ↉ Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ Ⅼ Ⅽ Ⅾ Ⅿ ⅰ ⅱ ⅲ ⅳ ⅴ ⅵ ⅶ ⅷ ⅸ ⅹ ⅺ ⅻ ⅼ ⅽ ⅾ ⅿ'.split(' ').filter(Boolean),
  },
  {
    label: 'Dingbats & Decorative',
    symbols: '✁ ✂ ✃ ✄ ✅ ✆ ✇ ✈ ✉ ✊ ✋ ✌ ✍ ✎ ✏ ✐ ✑ ✒ ✓ ✔ ✕ ✖ ✗ ✘ ✙ ✚ ✛ ✜ ✝ ✞ ✟ ✠ ✡ ✢ ✣ ✤ ✥ ✦ ✧ ✨ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ✱ ✲ ✳ ✴ ✵ ✶ ✷ ✸ ✹ ✺ ✻ ✼ ✽ ✾ ✿ ❀ ❁ ❂ ❃ ❄ ❅ ❆ ❇ ❈ ❉ ❊ ❋ ❌ ❍ ❎ ❏ ❐ ❑ ❒ ❓ ❔ ❕ ❖ ❗ ❘ ❙ ❚ ❛ ❜ ❝ ❞ ❟ ❠ ❡ ❢ ❣ ❤ ❥ ❦ ❧'.split(' ').filter(Boolean),
  },
]

export default function TextSymbolsPicker() {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState('')
  const [collected, setCollected] = useState([])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return SYMBOL_GROUPS
    return SYMBOL_GROUPS
      .map(g => ({
        ...g,
        symbols: g.symbols.filter(s => {
          const cp = s.codePointAt(0)
          const name = cp ? `U+${cp.toString(16).toUpperCase().padStart(4, '0')}` : ''
          return g.label.toLowerCase().includes(q) || name.toLowerCase().includes(q)
        }),
      }))
      .filter(g => g.symbols.length > 0)
  }, [search])

  function copySymbol(sym) {
    navigator.clipboard.writeText(sym).then(() => {
      setCopied(sym)
      setTimeout(() => setCopied(''), 1200)
    })
  }

  function addToCollection(sym) {
    setCollected(prev => prev.includes(sym) ? prev : [...prev, sym])
  }

  function copyCollection() {
    const text = collected.join(' ')
    navigator.clipboard.writeText(text).then(() => {
      setCopied('__collection__')
      setTimeout(() => setCopied(''), 1500)
    })
  }

  const totalCount = SYMBOL_GROUPS.reduce((s, g) => s + g.symbols.length, 0)

  return (
    <div className="tool-page">
      <BackBar />
      <ToolSeo />
      <h1>Text Symbols Picker</h1>
      <p className="tool-description">
        Browse {totalCount}+ Unicode symbols grouped by category. Click to copy, or collect multiple and copy them all at once.
      </p>

      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by category name…"
        style={{ marginBottom: '1rem', width: '100%' }}
        aria-label="Search symbols"
      />

      {collected.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)', marginRight: '0.25rem' }}>Collected:</span>
          {collected.map((sym, i) => (
            <button
              key={i}
              onClick={() => setCollected(prev => prev.filter((_, j) => j !== i))}
              title="Click to remove"
              style={{
                fontSize: '1.25rem', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '0.2rem 0.4rem', cursor: 'pointer', lineHeight: 1,
              }}
            >
              {sym}
            </button>
          ))}
          <button className="btn btn-sm" onClick={copyCollection} style={{ marginLeft: 'auto' }}>
            {copied === '__collection__' ? '✓ Copied' : 'Copy all'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCollected([])}
          >
            Clear
          </button>
        </div>
      )}

      {filtered.map(group => (
        <div key={group.label} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text)' }}>
            {group.label} <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: '0.8rem' }}>({group.symbols.length})</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {group.symbols.map((sym, i) => (
              <button
                key={i}
                title={`U+${(sym.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')} — click to copy, right-click to collect`}
                onClick={() => copySymbol(sym)}
                onContextMenu={e => { e.preventDefault(); addToCollection(sym) }}
                aria-label={`Copy ${sym}`}
                style={{
                  fontSize: '1.3rem',
                  lineHeight: 1,
                  padding: '0.3rem 0.4rem',
                  background: copied === sym ? 'var(--accent)' : 'var(--surface)',
                  color: copied === sym ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  minWidth: '2.2rem',
                  textAlign: 'center',
                }}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No symbols found for that search.</p>
      )}

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        Tip: click a symbol to copy it. Right-click to add it to your collection.
      </p>

      <RelatedTools tools={[
        { icon: '🔡', name: 'Unicode Text Converter', path: '/tools/unicode-text-converter' },
        { icon: '👁️', name: 'Zalgo Text',             path: '/tools/zalgo-text' },
        { icon: '🗺️', name: 'Unicode Char Map',       path: '/tools/unicode-char-map' },
        { icon: '📄', name: 'Lorem Ipsum',             path: '/tools/lorem-ipsum' },
      ]} />
    </div>
  )
}
