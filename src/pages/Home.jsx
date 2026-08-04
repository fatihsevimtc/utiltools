import { Link } from 'react-router-dom'

const TOOLS = [
  {
    icon: '📝',
    name: 'Word Counter',
    description: 'Live word, character & reading-time counts as you type.',
    path: '/tools/word-counter',
  },
  {
    icon: '🔤',
    name: 'Case Converter',
    description: 'Convert text to UPPER, lower, Title, camelCase, snake_case and more.',
    path: '/tools/case-converter',
  },
  {
    icon: '🗂️',
    name: 'JSON Formatter',
    description: 'Pretty-print and validate JSON with syntax error highlighting.',
    path: '/tools/json-formatter',
  },
  {
    icon: '🔀',
    name: 'Diff Checker',
    description: 'Paste two blocks of text and see exactly what changed.',
    path: '/tools/diff-checker',
  },
  {
    icon: '📷',
    name: 'QR Generator',
    description: 'Turn any URL or text into a downloadable QR code instantly.',
    path: '/tools/qr-generator',
  },
  {
    icon: '🔑',
    name: 'Password Generator',
    description: 'Customizable passwords and passphrases with a strength meter.',
    path: '/tools/password-generator',
  },
  {
    icon: '📐',
    name: 'Unit Converter',
    description: 'Convert length, weight and temperature between common units.',
    path: '/tools/unit-converter',
  },
  {
    icon: '🔒',
    name: 'Base64 / URL Encode',
    description: 'Encode and decode Base64 or URL-encoded strings in one click.',
    path: '/tools/base64',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>
          Free <span>browser tools</span> — no sign-up, no uploads
        </h1>
        <p>
          Everything runs in your browser. Your text, files and data never touch a server.
        </p>
      </section>

      <div className="tools-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.path} to={tool.path} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
