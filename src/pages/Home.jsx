import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const FEATURED = [
  { icon: '📝', name: 'Word Counter',       desc: 'Live word, character & reading-time counts.',             path: '/tools/word-counter' },
  { icon: '🔤', name: 'Case Converter',     desc: 'UPPER, lower, Title, camelCase, snake_case and more.',    path: '/tools/case-converter' },
  { icon: '🗂️', name: 'JSON Formatter',    desc: 'Pretty-print and validate JSON with error highlighting.',  path: '/tools/json-formatter' },
  { icon: '🔀', name: 'Diff Checker',       desc: 'Paste two texts and see exactly what changed.',            path: '/tools/diff-checker' },
  { icon: '📷', name: 'QR Generator',       desc: 'Turn any URL or text into a downloadable QR code.',        path: '/tools/qr-generator' },
  { icon: '🔐', name: 'Password Generator', desc: 'Secure passwords and passphrases with a strength meter.',  path: '/tools/password-generator' },
  { icon: '📐', name: 'Unit Converter',     desc: 'Convert length, weight, temperature, speed and area.',     path: '/tools/unit-converter' },
  { icon: '🔒', name: 'Base64 / URL Encode',desc: 'Encode and decode Base64 or URL-encoded strings.',         path: '/tools/base64' },
]

const CATEGORIES = [
  {
    id: 'text',
    label: '📝 Text',
    tools: [
      { icon: '📄', name: 'Lorem Ipsum',         desc: 'Generate placeholder text.',                            path: '/tools/lorem-ipsum' },
      { icon: '🔁', name: 'Text Repeater',        desc: 'Repeat any string N times.',                            path: '/tools/text-repeater' },
      { icon: '↩️', name: 'String Reverse',       desc: 'Reverse by characters, words, or lines.',               path: '/tools/string-reverse' },
      { icon: '🧹', name: 'Duplicate Remover',    desc: 'Remove duplicate lines instantly.',                     path: '/tools/duplicate-remover' },
      { icon: '↕️', name: 'Line Sorter',          desc: 'Sort lines A→Z, by length, or shuffle.',                path: '/tools/line-sort' },
      { icon: '📋', name: 'Markdown Preview',     desc: 'Write Markdown, see rendered HTML live.',               path: '/tools/markdown-preview' },
      { icon: '🔗', name: 'Slug Generator',       desc: 'Convert text into a URL-friendly slug.',                path: '/tools/slug-generator' },
      { icon: '📊', name: 'Word Frequency',       desc: 'Count how often each word appears in text.',            path: '/tools/word-frequency' },
      { icon: '0️⃣', name: 'Text ↔ Binary',       desc: 'Convert text to binary and back.',                      path: '/tools/text-to-binary' },
      { icon: '📡', name: 'Morse Code',           desc: 'Encode and decode Morse code.',                         path: '/tools/morse-code' },
      { icon: '🔄', name: 'Palindrome Checker',   desc: 'Check if a word or phrase is a palindrome.',            path: '/tools/palindrome' },
      { icon: '🔀', name: 'Anagram Checker',      desc: 'Check if two words are anagrams of each other.',        path: '/tools/anagram' },
      { icon: '🧽', name: 'Whitespace Remover',   desc: 'Remove or normalize whitespace from text.',             path: '/tools/whitespace-remover' },
      { icon: '📧', name: 'Email Extractor',      desc: 'Pull all email addresses from any text.',               path: '/tools/email-extractor' },
      { icon: '🔗', name: 'URL Extractor',        desc: 'Extract all HTTP/HTTPS links from text.',               path: '/tools/url-extractor' },
      { icon: '🔢', name: 'Number Extractor',     desc: 'Extract all numbers from text with statistics.',        path: '/tools/number-extractor' },
      { icon: '↵',  name: 'Line Break Remover',   desc: 'Remove or clean up line breaks and blank lines.',        path: '/tools/line-break-remover' },
      { icon: '💬', name: 'Sentence Counter',     desc: 'Count sentences, words, characters, and paragraphs.',   path: '/tools/sentence-counter' },
      { icon: '#️⃣', name: 'Text to Hashtags',    desc: 'Generate hashtags from any text for social media.',      path: '/tools/text-to-hashtags' },
      { icon: '🅰️', name: 'Title Case (APA)',     desc: 'Apply APA 7th edition title case rules.',                path: '/tools/title-case-apa' },
      { icon: '🐷', name: 'Pig Latin',             desc: 'Convert English text to Pig Latin.',                    path: '/tools/pig-latin' },
    ],
  },
  {
    id: 'developer',
    label: '🛠️ Developer',
    tools: [
      { icon: '🌐', name: 'HTML Entities',        desc: 'Encode/decode HTML special characters.',                path: '/tools/html-entities' },
      { icon: '🔑', name: 'JWT Decoder',          desc: 'Decode JWT tokens in your browser.',                    path: '/tools/jwt-decoder' },
      { icon: '🔍', name: 'Regex Tester',         desc: 'Test regex with live match highlighting.',               path: '/tools/regex-tester' },
      { icon: '🎨', name: 'Color Converter',      desc: 'HEX ↔ RGB ↔ HSL.',                                     path: '/tools/color-converter' },
      { icon: '⏱️', name: 'Timestamp Converter', desc: 'Unix timestamp ↔ human-readable date.',                 path: '/tools/timestamp' },
      { icon: '🗜️', name: 'CSS Minifier',        desc: 'Remove whitespace and comments from CSS.',               path: '/tools/css-minifier' },
      { icon: '✨', name: 'CSS Formatter',        desc: 'Prettify and indent CSS for readability.',               path: '/tools/css-formatter' },
      { icon: '🗜️', name: 'JS Minifier',         desc: 'Strip comments and whitespace from JavaScript.',         path: '/tools/js-minifier' },
      { icon: '🗜️', name: 'HTML Minifier',       desc: 'Remove comments and whitespace from HTML.',              path: '/tools/html-minifier' },
      { icon: '📝', name: 'HTML → Markdown',     desc: 'Convert HTML markup to Markdown syntax.',                path: '/tools/html-to-markdown' },
      { icon: '📄', name: 'Markdown → HTML',     desc: 'Convert Markdown to HTML with a live preview.',          path: '/tools/markdown-to-html' },
      { icon: '🔧', name: 'XML Formatter',        desc: 'Validate and prettify XML with indentation.',            path: '/tools/xml-formatter' },
      { icon: '🔄', name: 'XML → JSON',           desc: 'Convert XML to a JSON representation.',                  path: '/tools/xml-to-json' },
      { icon: '🔄', name: 'JSON → XML',           desc: 'Convert a JSON object to XML markup.',                   path: '/tools/json-to-xml' },
      { icon: '📊', name: 'JSON → CSV',           desc: 'Convert a JSON array to a CSV spreadsheet.',             path: '/tools/json-to-csv' },
      { icon: '📊', name: 'CSV → JSON',           desc: 'Convert CSV (with headers) to JSON.',                    path: '/tools/csv-to-json' },
      { icon: '🔄', name: 'YAML → JSON',          desc: 'Convert YAML to JSON.',                                  path: '/tools/yaml-to-json' },
      { icon: '🔄', name: 'JSON → YAML',          desc: 'Convert JSON to clean YAML format.',                     path: '/tools/json-to-yaml' },
      { icon: '🗄️', name: 'SQL Formatter',       desc: 'Prettify SQL queries with consistent indentation.',      path: '/tools/sql-formatter' },
      { icon: '⏰', name: 'Cron Parser',          desc: 'Parse cron expressions into human-readable text.',       path: '/tools/cron-parser' },
      { icon: '🔗', name: 'URL Parser',           desc: 'Break a URL into its component parts.',                  path: '/tools/url-parser' },
      { icon: '🔨', name: 'URL Builder',          desc: 'Assemble URLs from parts with proper encoding.',         path: '/tools/url-builder' },
      { icon: '📡', name: 'HTTP Status Codes',    desc: 'Quick reference for all HTTP status codes.',             path: '/tools/http-status' },
      { icon: '🎯', name: 'JSON Path Tester',     desc: 'Query JSON with JSONPath expressions.',                  path: '/tools/json-path' },
      { icon: '🔐', name: 'TOTP / OTP Generator', desc: 'Generate time-based one-time passwords from a Base32 secret.', path: '/tools/totp-generator' },
      { icon: '#️⃣', name: 'Hex Calculator',      desc: 'Arithmetic and bitwise operations on hex numbers.',       path: '/tools/hex-calculator' },
      { icon: '🏦', name: 'IBAN Validator',        desc: 'Validate IBANs using the MOD-97 checksum algorithm.',    path: '/tools/iban-validator' },
      { icon: '💳', name: 'Credit Card Validator', desc: 'Validate card numbers with the Luhn algorithm.',         path: '/tools/credit-card-validator' },
      { icon: '📦', name: 'Data URI Encoder',      desc: 'Convert files or text into Base64 data URIs.',           path: '/tools/data-uri-encoder' },
      { icon: '🎭', name: 'Fake Data Generator',   desc: 'Generate realistic fake names, emails, and addresses.',  path: '/tools/fake-data-generator' },
    ],
  },
  {
    id: 'generators',
    label: '⚡ Generators',
    tools: [
      { icon: '🆔', name: 'UUID Generator',       desc: 'Random v4 UUIDs in bulk.',                              path: '/tools/uuid-generator' },
      { icon: '#️⃣', name: 'Hash Generator',      desc: 'SHA-1 / SHA-256 / SHA-512.',                           path: '/tools/hash-generator' },
      { icon: '🎲', name: 'Random Number',        desc: 'Random numbers in a range.',                            path: '/tools/random-number' },
      { icon: '👤', name: 'Avatar Generator',     desc: 'Generate placeholder avatars from initials or patterns.', path: '/tools/avatar-generator' },
      { icon: '🎨', name: 'Logo Maker',            desc: 'Design a simple logo with shapes, gradients, and fonts.', path: '/tools/logo-maker' },
      { icon: '💼', name: 'LinkedIn Post Maker',   desc: 'Format LinkedIn posts with Unicode bold, emojis, and CTAs.', path: '/tools/linkedin-post-maker' },
    ],
  },
  {
    id: 'math',
    label: '🔢 Math & Numbers',
    tools: [
      { icon: '%',  name: 'Percentage Calc',      desc: 'X% of Y, % change and more.',                           path: '/tools/percentage' },
      { icon: '🔢', name: 'Number Base',          desc: 'Decimal ↔ Binary ↔ Hex ↔ Octal.',                      path: '/tools/number-base' },
      { icon: 'Ⅻ',  name: 'Roman Numerals',      desc: '2024 ↔ MMXXIV.',                                        path: '/tools/roman-numeral' },
      { icon: '🔟', name: 'Binary Calculator',    desc: 'Arithmetic and bitwise ops on binary numbers.',          path: '/tools/binary-calculator' },
      { icon: '🔍', name: 'Prime Checker',        desc: 'Check if a number is prime and see its factors.',        path: '/tools/prime-checker' },
      { icon: '➗', name: 'GCD / LCM',            desc: 'Greatest Common Divisor and Least Common Multiple.',     path: '/tools/gcd-lcm' },
      { icon: '🌀', name: 'Fibonacci Generator',  desc: 'Generate Fibonacci numbers and check membership.',       path: '/tools/fibonacci' },
      { icon: '⚖️', name: 'BMI Calculator',      desc: 'Calculate your Body Mass Index.',                        path: '/tools/bmi' },
      { icon: '🍽️', name: 'Tip Calculator',      desc: 'Calculate tip and split the bill.',                      path: '/tools/tip-calculator' },
      { icon: '🏦', name: 'Loan Calculator',      desc: 'Monthly payments and total interest for any loan.',      path: '/tools/loan-calculator' },
      { icon: '📈', name: 'Compound Interest',    desc: 'See how your investment grows over time.',               path: '/tools/compound-interest' },
      { icon: '💰', name: 'VAT Calculator',       desc: 'Add or remove VAT from any price.',                      path: '/tools/vat-calculator' },
      { icon: '🔬', name: 'Scientific Calculator', desc: 'Browser-based calculator with trig and power functions.', path: '/tools/scientific-calculator' },
      { icon: '!',  name: 'Factorial / P / C',     desc: 'Factorials, permutations, and combinations.',            path: '/tools/factorial' },
    ],
  },
  {
    id: 'time',
    label: '📅 Time & Date',
    tools: [
      { icon: '🎂', name: 'Age Calculator',       desc: 'Exact age from any birthdate.',                          path: '/tools/age-calculator' },
      { icon: '📆', name: 'Date Difference',      desc: 'Days, weeks, months between dates.',                     path: '/tools/date-difference' },
      { icon: '🌍', name: 'Time Zone Converter',  desc: 'Convert times across multiple time zones.',              path: '/tools/timezone' },
      { icon: '⏳', name: 'Countdown Timer',      desc: 'Count down to any date and time.',                       path: '/tools/countdown' },
      { icon: '⏱️', name: 'Stopwatch',           desc: 'Precise stopwatch with lap tracking.',                   path: '/tools/stopwatch' },
      { icon: '📅', name: 'Working Days',         desc: 'Count or add working days, excluding weekends.',         path: '/tools/working-days' },
      { icon: '🗓️', name: 'Week Number',         desc: 'ISO week number for any date.',                          path: '/tools/week-number' },
      { icon: '🍅', name: 'Pomodoro Timer',       desc: 'Focus timer with the Pomodoro technique.',               path: '/tools/pomodoro' },
    ],
  },
  {
    id: 'files',
    label: '🖼️ Images & Files',
    tools: [
      { icon: '🖼️', name: 'Image Resizer',       desc: 'Resize images in-browser.',                             path: '/tools/image-resizer' },
      { icon: '💾', name: 'File Size Converter',  desc: 'Bytes, KB, MB, GB and more.',                           path: '/tools/file-size' },
      { icon: '🔐', name: 'Image to Base64',      desc: 'Convert any image to a Base64 data URI.',               path: '/tools/image-to-base64' },
      { icon: '🖼️', name: 'Base64 to Image',     desc: 'Preview and download an image from Base64.',            path: '/tools/base64-to-image' },
      { icon: '🎨', name: 'Image Color Picker',   desc: 'Click anywhere on an image to pick a color.',           path: '/tools/image-color-picker' },
      { icon: '⭐', name: 'Favicon Generator',    desc: 'Create emoji favicons and download at multiple sizes.',  path: '/tools/favicon-generator' },
      { icon: '📸', name: 'EXIF Viewer',          desc: 'Extract EXIF metadata from JPEG images in your browser.', path: '/tools/exif-viewer' },
    ],
  },
  {
    id: 'design',
    label: '🎨 Design & CSS',
    tools: [
      { icon: '🌈', name: 'Gradient Generator',   desc: 'Build CSS gradients visually and copy the code.',        path: '/tools/gradient-generator' },
      { icon: '🌑', name: 'Box Shadow Generator', desc: 'Build and preview CSS box-shadow values.',               path: '/tools/box-shadow' },
      { icon: '⬛', name: 'Border Radius',        desc: 'Build CSS border-radius values with live preview.',      path: '/tools/border-radius' },
      { icon: '🎨', name: 'Palette Generator',    desc: 'Generate color palettes from a base color.',             path: '/tools/palette-generator' },
      { icon: '📐', name: 'Flexbox Playground',   desc: 'Experiment with CSS Flexbox properties visually.',        path: '/tools/flexbox-playground' },
      { icon: '▦',  name: 'Grid Generator',       desc: 'Build CSS Grid layouts visually and copy the CSS.',       path: '/tools/grid-generator' },
      { icon: '🗜️', name: 'SVG Optimizer',       desc: 'Remove comments and metadata to shrink SVG files.',       path: '/tools/svg-optimizer' },
      { icon: '🎨', name: 'HTML Color Names',      desc: 'Browse all 140 named HTML/CSS colors with HEX values.',  path: '/tools/html-color-names' },
    ],
  },
  {
    id: 'ai',
    label: '🤖 AI Tools',
    tools: [
      { icon: '🤖', name: 'AI Model Comparison',  desc: 'Compare leading LLMs by context, cost, and use cases.',  path: '/tools/ai-model-comparison' },
      { icon: '🪙', name: 'Token Counter',         desc: 'Estimate token counts and API cost for any text.',       path: '/tools/token-counter' },
      { icon: '🧱', name: 'System Prompt Builder', desc: 'Build effective system prompts with persona and tone.',  path: '/tools/system-prompt-builder' },
      { icon: '✏️', name: 'Prompt Formatter',     desc: 'Build multi-turn prompts and export as JSON, XML, or Python.', path: '/tools/prompt-formatter' },
      { icon: '✨', name: 'Prompt Improver',       desc: 'Apply best-practice rules to strengthen any prompt.',    path: '/tools/prompt-improver' },
    ],
  },
]

const COMING_SOON = [
  { name: 'CSS to Tailwind' }, { name: 'JS Formatter' }, { name: 'HTML Formatter' },
  { name: 'TOML to JSON' }, { name: 'SQL Minifier' }, { name: 'GraphQL Formatter' },
  { name: 'Regex to English' }, { name: 'Glob Tester' }, { name: 'Query String Parser' },
  { name: 'MIME Type Lookup' }, { name: 'IP Address Info' }, { name: 'User Agent Parser' },
  { name: 'Kebab to camelCase' }, { name: 'Vowel Counter' }, { name: 'Empty Line Remover' },
  { name: 'RSA Key Generator' }, { name: 'Bcrypt Hash' }, { name: 'Bcrypt Verify' },
  { name: 'ISBN Validator' }, { name: 'EAN Barcode Generator' }, { name: 'Image Cropper' },
  { name: 'Image Compressor' }, { name: 'PNG to JPEG' }, { name: 'WebP Converter' },
  { name: 'PDF Merge' }, { name: 'PDF to Text' }, { name: 'PDF Page Count' },
  { name: 'Word Count (DOCX)' }, { name: 'Matrix Calculator' }, { name: 'Currency Converter' },
  { name: 'Calendar Generator' }, { name: 'CSS Variables Inspector' },
]

const ALL_TOOLS = [
  ...FEATURED,
  ...CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, category: c.label }))),
]

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_FAVS    = 'ut_favorites'
const LS_RECENT  = 'ut_recent'
const MAX_RECENT = 8

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(LS_FAVS) || '[]') } catch { return [] }
}
function saveFavs(paths) {
  localStorage.setItem(LS_FAVS, JSON.stringify(paths))
}
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT) || '[]') } catch { return [] }
}
function addRecentPath(path) {
  const prev = loadRecent().filter(p => p !== path)
  localStorage.setItem(LS_RECENT, JSON.stringify([path, ...prev].slice(0, MAX_RECENT)))
}

export default function Home() {
  const [query, setQuery]         = useState('')
  const [activeCat, setActiveCat] = useState(null) // null = show featured
  const [favPaths, setFavPaths]   = useState(loadFavs)
  const [recentPaths, setRecentPaths] = useState(loadRecent)
  const [catsExpanded, setCatsExpanded] = useState(false)
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 640)
  const searchRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Ctrl+K / Cmd+K → focus search
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Sync favs to localStorage whenever they change
  useEffect(() => { saveFavs(favPaths) }, [favPaths])

  const toggleFav = useCallback((path, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavPaths(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [path, ...prev]
    )
  }, [])

  // Track recently visited — called from card click
  const handleToolClick = useCallback((path) => {
    addRecentPath(path)
    setRecentPaths(loadRecent())
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return null
    return ALL_TOOLS.filter(t =>
      t.path && (
        t.name.toLowerCase().includes(q) ||
        (t.desc || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      )
    )
  }, [query])

  const isSoon   = activeCat === 'soon'
  const isFavs   = activeCat === 'favs'
  const isRecent = activeCat === 'recent'

  const centerTools = (isSoon || isFavs || isRecent || activeCat === null)
    ? FEATURED
    : CATEGORIES.find(c => c.id === activeCat)?.tools ?? []

  const centerTitle = isSoon   ? '🚀 Coming Soon'
    : isFavs                   ? '❤️ Favourites'
    : isRecent                 ? '🕒 Recently Used'
    : activeCat
      ? CATEGORIES.find(c => c.id === activeCat)?.label
      : '⭐ Popular tools'

  const totalTools = ALL_TOOLS.filter(t => t.path).length

  // Resolve paths → full tool objects for favs/recent
  const pathToTool = useMemo(() => {
    const map = {}
    ALL_TOOLS.forEach(t => { if (t.path) map[t.path] = t })
    return map
  }, [])

  const favTools    = favPaths.map(p => pathToTool[p]).filter(Boolean)
  const recentTools = recentPaths.map(p => pathToTool[p]).filter(Boolean)

  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero">
        <h1>Free Browser Tools for <span>Developers</span>, Writers & Creators</h1>
        <p>{totalTools} fast, privacy-first utilities that run entirely in your browser.</p>
        <div className="search-wrap" style={{ maxWidth: 580 }}>
          <input
            ref={searchRef}
            type="search"
            className="search-input"
            placeholder={`Search all ${totalTools} tools… (Ctrl+K)`}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveCat(null) }}
            aria-label="Search tools"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">✕</button>
          )}
        </div>
      </div>

      <div className="home-layout">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="home-sidebar home-sidebar-left">
          <p className="sidebar-heading">Categories</p>

          {(() => {
            const allBtns = [
              <button key="popular"
                className={`sidebar-cat-btn ${activeCat === null ? 'active' : ''}`}
                onClick={() => { setActiveCat(null); setQuery('') }}
              >⭐ Popular<span className="sidebar-count">{FEATURED.length}</span></button>,

              ...(favTools.length > 0 ? [
                <button key="favs"
                  className={`sidebar-cat-btn ${isFavs ? 'active' : ''}`}
                  onClick={() => { setActiveCat('favs'); setQuery('') }}
                >❤️ Favourites<span className="sidebar-count">{favTools.length}</span></button>
              ] : []),

              ...(recentTools.length > 0 ? [
                <button key="recent"
                  className={`sidebar-cat-btn ${isRecent ? 'active' : ''}`}
                  onClick={() => { setActiveCat('recent'); setQuery('') }}
                >🕒 Recent<span className="sidebar-count">{recentTools.length}</span></button>
              ] : []),

              ...CATEGORIES.map(cat => (
                <button key={cat.id}
                  className={`sidebar-cat-btn ${activeCat === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveCat(cat.id); setQuery('') }}
                >{cat.label}<span className="sidebar-count">{cat.tools.length}</span></button>
              )),

              <button key="soon"
                className={`sidebar-cat-btn ${isSoon ? 'active' : ''}`}
                onClick={() => { setActiveCat('soon'); setQuery('') }}
              >🚀 Coming Soon<span className="sidebar-count">{COMING_SOON.length}</span></button>,
            ]

            const VISIBLE = 4

            return (
              <>
                {/* On mobile: show first 4, rest behind expand. On desktop: show all */}
                {isMobile ? allBtns.slice(0, VISIBLE) : allBtns}

                {isMobile && (
                  <>
                    <span className={`cat-extra ${catsExpanded ? 'cat-extra--open' : ''}`}>
                      {allBtns.slice(VISIBLE)}
                    </span>
                    <button
                      className="sidebar-cat-btn cat-expand-btn"
                      onClick={() => setCatsExpanded(e => !e)}
                      aria-expanded={catsExpanded}
                    >
                      {catsExpanded ? '▲ Less' : `▼ +${allBtns.length - VISIBLE} more`}
                    </button>
                  </>
                )}
              </>
            )
          })()}
        </aside>

        {/* ── CENTER ── */}
        <div className="home-center">

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
                    <ToolCard key={t.path} tool={t} isFav={favPaths.includes(t.path)} onFav={toggleFav} onClick={handleToolClick} />
                  ))}
                </div>
              </>
            )
          ) : isSoon ? (
            <>
              <p className="center-title">🚀 Coming Soon</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                These tools are in the pipeline. <Link to="/suggest">Suggest one</Link> to bump it up the list.
              </p>
              <div className="tools-grid">
                {COMING_SOON.map(t => (
                  <div key={t.name} className="tool-card tool-card--soon">
                    <div className="tool-icon">🔜</div>
                    <h3>{t.name}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Coming soon</p>
                  </div>
                ))}
              </div>
            </>
          ) : isFavs ? (
            favTools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
                <p style={{ fontSize: '2rem' }}>❤️</p>
                <p style={{ marginTop: '0.5rem' }}>No favourites yet. Click the ❤ on any tool card to save it.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <p className="center-title" style={{ margin: 0 }}>❤️ Favourites</p>
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => { setFavPaths([]); localStorage.removeItem(LS_FAVS); setActiveCat(null) }}
                    title="Clear all favourites"
                  >
                    Clear all
                  </button>
                </div>
                <div className="tools-grid">
                  {favTools.map(t => (
                    <ToolCard key={t.path} tool={t} isFav={true} onFav={toggleFav} onClick={handleToolClick} />
                  ))}
                </div>
              </>
            )
          ) : isRecent ? (
            recentTools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
                <p style={{ fontSize: '2rem' }}>🕒</p>
                <p style={{ marginTop: '0.5rem' }}>No recently used tools yet.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <p className="center-title" style={{ margin: 0 }}>🕒 Recently Used</p>
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => { setRecentPaths([]); localStorage.removeItem(LS_RECENT); setActiveCat(null) }}
                    title="Clear recently used"
                  >
                    Clear all
                  </button>
                </div>
                <div className="tools-grid">
                  {recentTools.map(t => (
                    <ToolCard key={t.path} tool={t} isFav={favPaths.includes(t.path)} onFav={toggleFav} onClick={handleToolClick} />
                  ))}
                </div>
              </>
            )
          ) : (
            <>
              <p className="center-title">{centerTitle}</p>
              <div className="tools-grid">
                {centerTools.map(t => (
                  <ToolCard key={t.path} tool={t} isFav={favPaths.includes(t.path)} onFav={toggleFav} onClick={handleToolClick} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="home-sidebar home-sidebar-right">
          {/* Privacy first — it's a trust signal */}
          <div className="sidebar-stat-box" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Privacy</p>
            <p className="sidebar-privacy" style={{ textAlign: 'left' }}>🔒 Runs locally</p>
            <p className="sidebar-privacy">📤 No uploads</p>
            <p className="sidebar-privacy">📊 No tracking</p>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-stat-box">
            <div className="sidebar-stat-value">{totalTools}</div>
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

          <a
            href="https://github.com/fatihsevimtc/utiltools"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-github-btn"
          >
            <svg height="14" width="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Contribute on GitHub
          </a>
        </aside>
      </div>
    </div>
  )
}

// ── ToolCard ─────────────────────────────────────────────────────────────────
function ToolCard({ tool, isFav, onFav, onClick }) {
  return (
    <Link
      to={tool.path}
      className="tool-card"
      onClick={() => onClick(tool.path)}
      style={{ position: 'relative' }}
    >
      <button
        className="tool-fav-btn"
        onClick={e => onFav(tool.path, e)}
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isFav ? '❤️' : '🤍'}
      </button>
      <div className="tool-icon">{tool.icon}</div>
      <h3>{tool.name}</h3>
      <p>{tool.desc}</p>
      {tool.category && (
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 'auto' }}>
          {tool.category}
        </span>
      )}
    </Link>
  )
}
