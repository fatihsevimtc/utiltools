import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const FEATURED = [
  { icon: '📝', name: 'Word Counter',       desc: 'Live word, character & reading-time counts.',            path: '/tools/word-counter' },
  { icon: '🔤', name: 'Case Converter',      desc: 'UPPER, lower, Title, camelCase, snake_case and more.',   path: '/tools/case-converter' },
  { icon: '🗂️', name: 'JSON Formatter',     desc: 'Pretty-print and validate JSON with error highlighting.', path: '/tools/json-formatter' },
  { icon: '🔀', name: 'Diff Checker',        desc: 'Paste two texts and see exactly what changed.',           path: '/tools/diff-checker' },
  { icon: '📷', name: 'QR Generator',        desc: 'Turn any URL or text into a downloadable QR code.',       path: '/tools/qr-generator' },
  { icon: '🔐', name: 'Password Generator',  desc: 'Secure passwords and passphrases with a strength meter.', path: '/tools/password-generator' },
  { icon: '📐', name: 'Unit Converter',      desc: 'Convert length, weight, temperature, speed and area.',    path: '/tools/unit-converter' },
  { icon: '🔒', name: 'Base64 / URL Encode', desc: 'Encode and decode Base64 or URL-encoded strings.',        path: '/tools/base64' },
]

const CATEGORIES = [
  { id: 'text',      label: '📝 Text',            tools: [
    { icon: '📄', name: 'Lorem Ipsum',            desc: 'Generate placeholder text.',                          path: '/tools/lorem-ipsum' },
    { icon: '🔁', name: 'Text Repeater',          desc: 'Repeat any string N times.',                          path: '/tools/text-repeater' },
    { icon: '↩️', name: 'String Reverse',         desc: 'Reverse by characters, words, or lines.',             path: '/tools/string-reverse' },
    { icon: '🧹', name: 'Duplicate Remover',      desc: 'Remove duplicate lines instantly.',                   path: '/tools/duplicate-remover' },
    { icon: '↕️', name: 'Line Sorter',            desc: 'Sort lines A→Z, by length, or shuffle.',              path: '/tools/line-sort' },
    { icon: '📋', name: 'Markdown Preview',       desc: 'Write Markdown, see rendered HTML live.',             path: '/tools/markdown-preview' },
  ]},
  { id: 'developer', label: '🛠️ Developer',       tools: [
    { icon: '🌐', name: 'HTML Entities',          desc: 'Encode/decode HTML special characters.',              path: '/tools/html-entities' },
    { icon: '🔑', name: 'JWT Decoder',            desc: 'Decode JWT tokens in your browser.',                  path: '/tools/jwt-decoder' },
    { icon: '🔍', name: 'Regex Tester',           desc: 'Test regex with live match highlighting.',             path: '/tools/regex-tester' },
    { icon: '🎨', name: 'Color Converter',        desc: 'HEX ↔ RGB ↔ HSL.',                                   path: '/tools/color-converter' },
    { icon: '⏱️', name: 'Timestamp Converter',   desc: 'Unix timestamp ↔ human-readable date.',               path: '/tools/timestamp' },
  ]},
  { id: 'generators',label: '⚡ Generators',       tools: [
    { icon: '🆔', name: 'UUID Generator',         desc: 'Random v4 UUIDs in bulk.',                            path: '/tools/uuid-generator' },
    { icon: '#️⃣', name: 'Hash Generator',        desc: 'SHA-1 / SHA-256 / SHA-512.',                         path: '/tools/hash-generator' },
    { icon: '🎲', name: 'Random Number',          desc: 'Random numbers in a range.',                          path: '/tools/random-number' },
  ]},
  { id: 'math',      label: '🔢 Math & Numbers',  tools: [
    { icon: '%',  name: 'Percentage Calc',        desc: 'X% of Y, % change and more.',                         path: '/tools/percentage' },
    { icon: '🔢', name: 'Number Base',            desc: 'Decimal ↔ Binary ↔ Hex ↔ Octal.',                    path: '/tools/number-base' },
    { icon: 'Ⅻ',  name: 'Roman Numerals',        desc: '2024 ↔ MMXXIV.',                                      path: '/tools/roman-numeral' },
  ]},
  { id: 'time',      label: '📅 Time & Date',      tools: [
    { icon: '🎂', name: 'Age Calculator',         desc: 'Exact age from any birthdate.',                        path: '/tools/age-calculator' },
    { icon: '📆', name: 'Date Difference',        desc: 'Days, weeks, months between dates.',                   path: '/tools/date-difference' },
  ]},
  { id: 'files',     label: '🖼️ Images & Files',  tools: [
    { icon: '🖼️', name: 'Image Resizer',          desc: 'Resize images in-browser.',                           path: '/tools/image-resizer' },
    { icon: '💾', name: 'File Size Converter',    desc: 'Bytes, KB, MB, GB and more.',                         path: '/tools/file-size' },
  ]},
  { id: 'soon', label: '🚀 Coming Soon', soon: true, tools: [
    { name: 'CSS Minifier' },            { name: 'CSS Formatter' },           { name: 'CSS to Tailwind' },
    { name: 'JS Minifier' },             { name: 'JS Formatter' },            { name: 'HTML Minifier' },
    { name: 'HTML Formatter' },          { name: 'HTML to Markdown' },        { name: 'Markdown to HTML' },
    { name: 'XML Formatter' },           { name: 'XML to JSON' },             { name: 'JSON to XML' },
    { name: 'JSON to CSV' },             { name: 'CSV to JSON' },             { name: 'YAML to JSON' },
    { name: 'JSON to YAML' },            { name: 'TOML to JSON' },            { name: 'SQL Formatter' },
    { name: 'SQL Minifier' },            { name: 'GraphQL Formatter' },
    { name: 'Cron Expression Parser' },  { name: 'Regex to English' },        { name: 'Glob Tester' },
    { name: 'URL Parser' },              { name: 'URL Builder' },             { name: 'Query String Parser' },
    { name: 'HTTP Status Codes' },       { name: 'MIME Type Lookup' },        { name: 'IP Address Info' },
    { name: 'User Agent Parser' },
    { name: 'Slug Generator' },          { name: 'Kebab to camelCase' },      { name: 'Word Frequency Counter' },
    { name: 'Text to Binary' },          { name: 'Binary to Text' },          { name: 'Morse Code' },
    { name: 'Pig Latin Converter' },     { name: 'Palindrome Checker' },      { name: 'Anagram Checker' },
    { name: 'Sentence Counter' },        { name: 'Vowel Counter' },           { name: 'Text to Hashtags' },
    { name: 'Email Extractor' },         { name: 'URL Extractor' },           { name: 'Number Extractor' },
    { name: 'Whitespace Remover' },      { name: 'Line Break Remover' },      { name: 'Empty Line Remover' },
    { name: 'Text to Title Case (APA)' },
    { name: 'TOTP / OTP Generator' },    { name: 'RSA Key Generator' },       { name: 'Bcrypt Hash' },
    { name: 'Bcrypt Verify' },           { name: 'Credit Card Validator' },   { name: 'IBAN Validator' },
    { name: 'ISBN Validator' },          { name: 'EAN Barcode Generator' },   { name: 'Data URI Encoder' },
    { name: 'SVG Optimizer' },
    { name: 'Image to Base64' },         { name: 'Base64 to Image' },         { name: 'Image Cropper' },
    { name: 'Image Color Picker' },      { name: 'Image Compressor' },        { name: 'PNG to JPEG' },
    { name: 'WebP Converter' },          { name: 'EXIF Viewer' },             { name: 'Favicon Generator' },
    { name: 'PDF Merge' },               { name: 'PDF to Text' },             { name: 'PDF Page Count' },
    { name: 'Word Count (DOCX)' },
    { name: 'Binary Calculator' },       { name: 'Hex Calculator' },          { name: 'Scientific Calculator' },
    { name: 'Matrix Calculator' },       { name: 'Prime Checker' },           { name: 'Factorial Calculator' },
    { name: 'GCD / LCM Calculator' },    { name: 'Fibonacci Generator' },     { name: 'BMI Calculator' },
    { name: 'Tip Calculator' },          { name: 'Loan Calculator' },         { name: 'Compound Interest' },
    { name: 'Currency Converter' },      { name: 'VAT Calculator' },
    { name: 'Time Zone Converter' },     { name: 'Countdown Timer' },         { name: 'Stopwatch' },
    { name: 'Working Days Calculator' }, { name: 'Week Number' },             { name: 'Calendar Generator' },
    { name: 'Pomodoro Timer' },
    { name: 'Fake Name Generator' },     { name: 'Fake Address Generator' },  { name: 'Fake Email Generator' },
    { name: 'Fake Credit Card' },        { name: 'Fake Phone Number' },       { name: 'Avatar Generator' },
    { name: 'Palette Generator' },       { name: 'Gradient Generator' },      { name: 'Box Shadow Generator' },
    { name: 'Border Radius Generator' }, { name: 'Flexbox Playground' },      { name: 'Grid Generator' },
    { name: 'CSS Variables Inspector' }, { name: 'HTML Color Names' },         { name: 'JSON Path Tester' },
  ]},
]

const ALL_TOOLS = [
  ...FEATURED,
  ...CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, category: c.label }))),
]
const TOTAL = ALL_TOOLS.length

export default function Home() {
  const [query, setQuery]         = useState('')
  const [activeCat, setActiveCat] = useState(null) // null = show featured

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return null
    return ALL_TOOLS.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q)
    )
  }, [query])

  const centerTools = activeCat
    ? CATEGORIES.find(c => c.id === activeCat)?.tools ?? []
    : FEATURED

  const centerTitle = activeCat
    ? CATEGORIES.find(c => c.id === activeCat)?.label
    : '⭐ Popular tools'

  return (
    <div className="home-layout">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="home-sidebar home-sidebar-left">
        <p className="sidebar-heading">Categories</p>

        <button
          className={`sidebar-cat-btn ${activeCat === null ? 'active' : ''}`}
          onClick={() => { setActiveCat(null); setQuery('') }}
        >
          ⭐ Popular
          <span className="sidebar-count">{FEATURED.length}</span>
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`sidebar-cat-btn ${activeCat === cat.id ? 'active' : ''}`}
            onClick={() => { setActiveCat(cat.id); setQuery('') }}
          >
            {cat.label}
            <span className="sidebar-count">{cat.tools.length}</span>
          </button>
        ))}
      </aside>

      {/* ── CENTER ── */}
      <div className="home-center">
        {/* Search bar */}
        <div className="search-wrap" style={{ marginBottom: '1.25rem' }}>
          <input
            type="search"
            className="search-input"
            placeholder='Search all tools…'
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveCat(null) }}
            aria-label="Search tools"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear">✕</button>
          )}
        </div>

        {/* Search results */}
        {filtered !== null ? (
          filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: '2rem' }}>🔍</p>
              <p style={{ marginTop: '0.5rem' }}>No results for "{query}"</p>
              <Link to="/suggest" style={{ fontSize: '0.875rem' }}>Suggest a tool →</Link>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="tools-grid">
                {filtered.map(t => (
                  <Link key={t.path} to={t.path} className="tool-card">
                    <div className="tool-icon">{t.icon}</div>
                    <h3>{t.name}</h3>
                    <p>{t.desc}</p>
                    {t.category && <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 'auto' }}>{t.category}</span>}
                  </Link>
                ))}
              </div>
            </>
          )
        ) : (
          <>
            <p className="center-title">{centerTitle}</p>
            <div className="tools-grid">
              {centerTools.map(t => (
                <Link key={t.path} to={t.path} className="tool-card">
                  <div className="tool-icon">{t.icon}</div>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="home-sidebar home-sidebar-right">
        <div className="sidebar-stat-box">
          <div className="sidebar-stat-value">{TOTAL}</div>
          <div className="sidebar-stat-label">Free tools</div>
        </div>

        <div className="sidebar-stat-box">
          <div className="sidebar-stat-value">{CATEGORIES.length}</div>
          <div className="sidebar-stat-label">Categories</div>
        </div>

        <div className="sidebar-divider" />

        <p className="sidebar-heading">Support</p>
        <a
          href="https://ko-fi.com/utiltools"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-donate-btn"
        >
          ♥ Donate
        </a>

        <Link to="/suggest" className="sidebar-suggest-btn">
          💡 Suggest a tool
        </Link>

        <div className="sidebar-divider" />

        <p className="sidebar-privacy">
          🔒 100% private — nothing leaves your browser
        </p>
      </aside>
    </div>
  )
}
