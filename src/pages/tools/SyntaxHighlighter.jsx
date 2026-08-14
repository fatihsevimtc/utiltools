import { useState, useMemo, useCallback } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

// ── Lightweight regex-based syntax highlighter ──────────────────────────────

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'JSON',
  'SQL', 'Bash', 'PHP', 'Java', 'C/C++', 'Rust',
]

const THEMES = {
  'Dracula': {
    bg: '#282a36', fg: '#f8f8f2',
    keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4',
    number: '#bd93f9', function: '#50fa7b', operator: '#ff79c6',
    tag: '#ff79c6', attr: '#50fa7b', type: '#8be9fd',
  },
  'One Dark': {
    bg: '#282c34', fg: '#abb2bf',
    keyword: '#c678dd', string: '#98c379', comment: '#5c6370',
    number: '#d19a66', function: '#61afef', operator: '#56b6c2',
    tag: '#e06c75', attr: '#d19a66', type: '#e5c07b',
  },
  'GitHub Light': {
    bg: '#ffffff', fg: '#24292e',
    keyword: '#d73a49', string: '#032f62', comment: '#6a737d',
    number: '#005cc5', function: '#6f42c1', operator: '#d73a49',
    tag: '#22863a', attr: '#005cc5', type: '#6f42c1',
  },
  'Solarized Dark': {
    bg: '#002b36', fg: '#839496',
    keyword: '#859900', string: '#2aa198', comment: '#586e75',
    number: '#d33682', function: '#268bd2', operator: '#cb4b16',
    tag: '#268bd2', attr: '#b58900', type: '#b58900',
  },
  'Nord': {
    bg: '#2e3440', fg: '#d8dee9',
    keyword: '#81a1c1', string: '#a3be8c', comment: '#4c566a',
    number: '#b48ead', function: '#88c0d0', operator: '#81a1c1',
    tag: '#8fbcbb', attr: '#d08770', type: '#ebcb8b',
  },
}

const JS_KEYWORDS = /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|void|in|of|class|extends|import|export|default|from|async|await|try|catch|finally|throw|this|super|true|false|null|undefined)\b/g
const TS_KEYWORDS = /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|void|in|of|class|extends|import|export|default|from|async|await|try|catch|finally|throw|this|super|true|false|null|undefined|interface|type|enum|implements|abstract|readonly|private|public|protected|declare|namespace|as|is|keyof|typeof|infer|never|any|unknown|string|number|boolean|object|symbol)\b/g
const PY_KEYWORDS  = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|print|raise|return|True|False|try|while|with|yield)\b/g
const PHP_KEYWORDS = /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|null|true|false)\b/g
const SQL_KEYWORDS = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|DISTINCT|AS|AND|OR|NOT|IN|IS|NULL|LIKE|BETWEEN|EXISTS|UNION|ALL|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|UNIQUE|CONSTRAINT|AUTO_INCREMENT|COUNT|SUM|AVG|MIN|MAX|COALESCE|CASE|WHEN|THEN|ELSE|END|WITH|EXPLAIN|SHOW|DESCRIBE)\b/gi
const JAVA_KEYWORDS = /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|null|true|false)\b/g
const RUST_KEYWORDS = /\b(as|break|const|continue|crate|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while|async|await|dyn)\b/g
const C_KEYWORDS    = /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|NULL|true|false|nullptr)\b/g
const BASH_KEYWORDS = /\b(if|then|else|elif|fi|for|while|do|done|case|in|esac|function|return|exit|echo|read|local|export|source|alias|unset|shift|break|continue|trap|exec|eval)\b/g

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function highlight(code, lang, theme) {
  const t = THEMES[theme] || THEMES['Dracula']
  const esc = escapeHtml(code)
  let out = esc

  const span = (cls, color) => (m) => `<span style="color:${color}">${m}</span>`

  if (lang === 'JSON') {
    out = out
      .replace(/"((?:[^"\\]|\\.)*)"(?=\s*:)/g, (m, k) => `<span style="color:${t.attr}">"${k}"</span>`)
      .replace(/:\s*"((?:[^"\\]|\\.)*)"/g, (_, v) => `: <span style="color:${t.string}">"${v}"</span>`)
      .replace(/\b(true|false|null)\b/g, span('kw', t.keyword))
      .replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, span('num', t.number))
    return out
  }

  if (lang === 'HTML') {
    out = out
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, (m) => `<span style="color:${t.comment}">${m}</span>`)
      .replace(/(&lt;\/?)([\w-]+)/g, (_, bracket, tag) => `${bracket}<span style="color:${t.tag}">${tag}</span>`)
      .replace(/([\w-]+)=(&quot;[^&]*&quot;)/g, (_, a, v) => `<span style="color:${t.attr}">${a}</span>=${v}`)
    return out
  }

  if (lang === 'CSS') {
    out = out
      .replace(/(\/\*[\s\S]*?\*\/)/g, (m) => `<span style="color:${t.comment}">${m}</span>`)
      .replace(/([.#]?[\w-]+)(?=\s*\{)/g, (m) => `<span style="color:${t.tag}">${m}</span>`)
      .replace(/([\w-]+)(?=\s*:)/g, (m) => `<span style="color:${t.attr}">${m}</span>`)
      .replace(/(:\s*)([^;{}\n]+)/g, (_, colon, val) => `${colon}<span style="color:${t.string}">${val}</span>`)
    return out
  }

  if (lang === 'SQL') {
    out = out
      .replace(/(--[^\n]*)/g, span('cm', t.comment))
      .replace(SQL_KEYWORDS, span('kw', t.keyword))
      .replace(/('(?:[^'\\]|\\.)*')/g, span('str', t.string))
      .replace(/\b(\d+(?:\.\d+)?)\b/g, span('num', t.number))
    return out
  }

  if (lang === 'HTML') return out  // already handled above

  // Generic: comments, strings, numbers, keywords
  let kwRe = JS_KEYWORDS
  if (lang === 'TypeScript') kwRe = TS_KEYWORDS
  else if (lang === 'Python') kwRe = PY_KEYWORDS
  else if (lang === 'PHP')    kwRe = PHP_KEYWORDS
  else if (lang === 'Java')   kwRe = JAVA_KEYWORDS
  else if (lang === 'C/C++') kwRe = C_KEYWORDS
  else if (lang === 'Rust')   kwRe = RUST_KEYWORDS
  else if (lang === 'Bash')   kwRe = BASH_KEYWORDS

  // Comments
  const lineComment = ['Python', 'Bash'].includes(lang) ? /#([^\n]*)/ : /\/\/([^\n]*)/
  const blockComment = /\/\*[\s\S]*?\*\//

  out = out
    .replace(blockComment, (m) => `<span style="color:${t.comment}">${m}</span>`)
    .replace(new RegExp(lineComment.source, 'g'), (m) => `<span style="color:${t.comment}">${m}</span>`)
    .replace(/((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`))/g, (m) => `<span style="color:${t.string}">${m}</span>`)
    .replace(/\b(\d+(?:\.\d+)?)\b/g, span('num', t.number))
    .replace(kwRe, span('kw', t.keyword))

  return out
}

const SAMPLE_CODE = {
  JavaScript: `// Fibonacci generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}`,
  Python: `# Find prime numbers
def sieve(n):
    primes = [True] * (n + 1)
    primes[0] = primes[1] = False
    for i in range(2, int(n**0.5) + 1):
        if primes[i]:
            for j in range(i*i, n + 1, i):
                primes[j] = False
    return [i for i, p in enumerate(primes) if p]

print(sieve(50))`,
  HTML: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
</head>
<body>
  <h1 class="title">Hello, World!</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
  JSON: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,
}

export default function SyntaxHighlighter() {
  const [lang, setLang]       = useState('JavaScript')
  const [theme, setTheme]     = useState('Dracula')
  const [code, setCode]       = useState(SAMPLE_CODE.JavaScript || '')
  const [copied, setCopied]   = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [lineNums, setLineNums] = useState(true)
  const [fontSize, setFontSize] = useState(14)

  const highlighted = useMemo(() => highlight(code, lang, theme), [code, lang, theme])
  const t = THEMES[theme] || THEMES['Dracula']

  const handleLangChange = useCallback((newLang) => {
    setLang(newLang)
    if (SAMPLE_CODE[newLang] && !code.trim()) {
      setCode(SAMPLE_CODE[newLang])
    }
  }, [code])

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function copyHtml() {
    const lines = highlighted.split('\n')
    const inner = lines.map((line, i) =>
      lineNums
        ? `<span style="user-select:none;color:#666;margin-right:1.5em">${String(i + 1).padStart(String(lines.length).length, ' ')}</span>${line}`
        : line
    ).join('\n')
    const html = `<pre style="background:${t.bg};color:${t.fg};padding:1em;border-radius:8px;overflow:auto;font-size:${fontSize}px;line-height:1.6"><code>${inner}</code></pre>`
    navigator.clipboard.writeText(html).then(() => {
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 1500)
    })
  }

  const lines = code.split('\n')

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Syntax Highlighter</h1>
      <p className="tool-description">
        Highlight code syntax for 12 languages with 5 colour themes. Copy the raw code or an HTML snippet for embedding.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: '0.85rem' }}>Language</label>
          <div className="chip-group" style={{ marginTop: '0.25rem', flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <button key={l} className={`chip ${lang === l ? 'active' : ''}`} onClick={() => handleLangChange(l)} style={{ fontSize: '0.8rem' }}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.85rem' }}>Theme</label>
          <div className="chip-group" style={{ marginTop: '0.25rem' }}>
            {Object.keys(THEMES).map(th => (
              <button key={th} className={`chip ${theme === th ? 'active' : ''}`} onClick={() => setTheme(th)} style={{ fontSize: '0.8rem' }}>{th}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', userSelect: 'none', marginBottom: 0 }}>
          <input type="checkbox" checked={lineNums} onChange={e => setLineNums(e.target.checked)} />
          Line numbers
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ marginBottom: 0, fontSize: '0.85rem' }}>Font size:</label>
          <input type="number" min={10} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: 60, padding: '0.3rem 0.5rem', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>px</span>
        </div>
      </div>

      <label htmlFor="sh-input">Code</label>
      <textarea
        id="sh-input"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Paste your code here…"
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        spellCheck={false}
      />

      {code.trim() && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ marginBottom: 0 }}>Preview</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={copyCode}>{copied ? '✓ Code copied' : 'Copy code'}</button>
              <button className="btn btn-sm" onClick={copyHtml}>{copiedHtml ? '✓ HTML copied' : 'Copy as HTML'}</button>
            </div>
          </div>
          <div
            style={{
              background: t.bg,
              borderRadius: 8,
              padding: '1rem 1.25rem',
              overflowX: 'auto',
              border: '1px solid var(--border)',
            }}
          >
            <pre style={{ margin: 0, fontSize: `${fontSize}px`, lineHeight: 1.6, color: t.fg, fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace' }}>
              {lines.map((_, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  {lineNums && (
                    <span style={{ userSelect: 'none', color: t.comment, marginRight: '1.5em', minWidth: `${String(lines.length).length}ch`, textAlign: 'right', opacity: 0.6 }}>
                      {i + 1}
                    </span>
                  )}
                  <span dangerouslySetInnerHTML={{ __html: highlighted.split('\n')[i] ?? '' }} />
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}

      <RelatedTools tools={[
        { icon: '🛠️', name: 'JS Formatter',     path: '/tools/js-formatter' },
        { icon: '📄', name: 'HTML Formatter',   path: '/tools/html-formatter' },
        { icon: '🗄️', name: 'SQL Formatter',    path: '/tools/sql-formatter' },
        { icon: '△',  name: 'GraphQL Formatter', path: '/tools/graphql-formatter' },
      ]} />
      <ToolSeo />
    </div>
  )
}
