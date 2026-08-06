import { Link } from 'react-router-dom'

/**
 * RelatedTools — shows a small grid of related tool links at the bottom of a tool page.
 *
 * Usage:
 *   <RelatedTools tools={[
 *     { icon: '🔑', name: 'JWT Encoder', path: '/tools/jwt-encoder' },
 *     { icon: '🔀', name: 'JSON Diff',   path: '/tools/json-diff' },
 *   ]} />
 *
 * Or pass a category id and it will auto-pull tools from that category:
 *   <RelatedTools category="developer" exclude="/tools/jwt-decoder" />
 */

// Inline minimal tool map so this component is self-contained
const TOOL_CATALOG = [
  // Text
  { icon: '📄', name: 'Lorem Ipsum',        path: '/tools/lorem-ipsum',        category: 'text' },
  { icon: '📝', name: 'Word Counter',        path: '/tools/word-counter',        category: 'text' },
  { icon: '🔤', name: 'Case Converter',      path: '/tools/case-converter',      category: 'text' },
  { icon: '🧹', name: 'Duplicate Remover',   path: '/tools/duplicate-remover',   category: 'text' },
  { icon: '↕️', name: 'Line Sorter',         path: '/tools/line-sort',           category: 'text' },
  { icon: '📋', name: 'Markdown Preview',    path: '/tools/markdown-preview',    category: 'text' },
  { icon: '🔗', name: 'Slug Generator',      path: '/tools/slug-generator',      category: 'text' },
  { icon: '📊', name: 'Word Frequency',      path: '/tools/word-frequency',      category: 'text' },
  { icon: '📧', name: 'Email Extractor',     path: '/tools/email-extractor',     category: 'text' },
  { icon: '📖', name: 'Readability Score',   path: '/tools/readability-score',   category: 'text' },
  { icon: '📝', name: 'Resume Word Checker', path: '/tools/resume-word-checker', category: 'text' },
  { icon: '👤', name: 'Bio Generator',       path: '/tools/bio-generator',       category: 'text' },
  { icon: '🔊', name: 'Text to Speech',      path: '/tools/text-to-speech',      category: 'text' },
  // Developer
  { icon: '🗂️', name: 'JSON Formatter',     path: '/tools/json-formatter',      category: 'developer' },
  { icon: '🔀', name: 'Diff Checker',        path: '/tools/diff-checker',        category: 'developer' },
  { icon: '🔒', name: 'Base64',              path: '/tools/base64',              category: 'developer' },
  { icon: '🌐', name: 'HTML Entities',       path: '/tools/html-entities',       category: 'developer' },
  { icon: '🔑', name: 'JWT Decoder',         path: '/tools/jwt-decoder',         category: 'developer' },
  { icon: '🔑', name: 'JWT Encoder',         path: '/tools/jwt-encoder',         category: 'developer' },
  { icon: '🔍', name: 'Regex Tester',        path: '/tools/regex-tester',        category: 'developer' },
  { icon: '⏱️', name: 'Timestamp',           path: '/tools/timestamp',           category: 'developer' },
  { icon: '🗄️', name: 'SQL Formatter',      path: '/tools/sql-formatter',       category: 'developer' },
  { icon: '⏰', name: 'Cron Parser',         path: '/tools/cron-parser',         category: 'developer' },
  { icon: '📡', name: 'HTTP Status Codes',   path: '/tools/http-status',         category: 'developer' },
  { icon: '🔀', name: 'JSON Diff',           path: '/tools/json-diff',           category: 'developer' },
  { icon: '🌐', name: 'DNS Lookup',          path: '/tools/dns-lookup',          category: 'developer' },
  { icon: '🔒', name: 'SSL Decoder',         path: '/tools/ssl-decoder',         category: 'developer' },
  { icon: '🗺️', name: 'Unicode Char Map',   path: '/tools/unicode-char-map',    category: 'developer' },
  { icon: '🔍', name: 'JSON Schema Validator', path: '/tools/json-schema-validator', category: 'developer' },
  // Generators
  { icon: '🆔', name: 'UUID Generator',      path: '/tools/uuid-generator',      category: 'generators' },
  { icon: '#️⃣', name: 'Hash Generator',     path: '/tools/hash-generator',      category: 'generators' },
  { icon: '🎲', name: 'Random Number',       path: '/tools/random-number',       category: 'generators' },
  { icon: '🔐', name: 'Password Generator',  path: '/tools/password-generator',  category: 'generators' },
  { icon: '📷', name: 'QR Generator',        path: '/tools/qr-generator',        category: 'generators' },
  // Math
  { icon: '%',  name: 'Percentage Calc',     path: '/tools/percentage',          category: 'math' },
  { icon: '🔢', name: 'Number Base',         path: '/tools/number-base',         category: 'math' },
  { icon: '⚖️', name: 'BMI Calculator',     path: '/tools/bmi',                 category: 'math' },
  { icon: '🏦', name: 'Loan Calculator',     path: '/tools/loan-calculator',     category: 'math' },
  { icon: '📈', name: 'Compound Interest',   path: '/tools/compound-interest',   category: 'math' },
  { icon: '💰', name: 'VAT Calculator',      path: '/tools/vat-calculator',      category: 'math' },
  { icon: '💱', name: 'Currency Converter',  path: '/tools/currency-converter',  category: 'math' },
  // Time
  { icon: '🎂', name: 'Age Calculator',      path: '/tools/age-calculator',      category: 'time' },
  { icon: '📆', name: 'Date Difference',     path: '/tools/date-difference',     category: 'time' },
  { icon: '🌍', name: 'Time Zone Converter', path: '/tools/timezone',            category: 'time' },
  { icon: '⏳', name: 'Countdown Timer',     path: '/tools/countdown',           category: 'time' },
  { icon: '🍅', name: 'Pomodoro Timer',      path: '/tools/pomodoro',            category: 'time' },
  // Files
  { icon: '🖼️', name: 'Image Resizer',      path: '/tools/image-resizer',       category: 'files' },
  { icon: '🗜️', name: 'Image Compressor',  path: '/tools/image-compressor',    category: 'files' },
  { icon: '🔐', name: 'Image to Base64',     path: '/tools/image-to-base64',     category: 'files' },
  { icon: '🎨', name: 'Image Color Picker',  path: '/tools/image-color-picker',  category: 'files' },
  { icon: '📸', name: 'EXIF Viewer',         path: '/tools/exif-viewer',         category: 'files' },
  // Design
  { icon: '🌈', name: 'Gradient Generator',  path: '/tools/gradient-generator',  category: 'design' },
  { icon: '🌑', name: 'Box Shadow',          path: '/tools/box-shadow',          category: 'design' },
  { icon: '🎨', name: 'Palette Generator',   path: '/tools/palette-generator',   category: 'design' },
  { icon: '📐', name: 'Flexbox Playground',  path: '/tools/flexbox-playground',  category: 'design' },
  { icon: '▦',  name: 'Grid Generator',      path: '/tools/grid-generator',      category: 'design' },
  { icon: '🎨', name: 'Color Converter',     path: '/tools/color-converter',     category: 'design' },
  // AI
  { icon: '🤖', name: 'AI Model Comparison', path: '/tools/ai-model-comparison', category: 'ai' },
  { icon: '🪙', name: 'Token Counter',       path: '/tools/token-counter',       category: 'ai' },
  { icon: '✨', name: 'Prompt Improver',     path: '/tools/prompt-improver',     category: 'ai' },
  { icon: '🧱', name: 'System Prompt Builder', path: '/tools/system-prompt-builder', category: 'ai' },
]

export default function RelatedTools({ tools, category, exclude, max = 4 }) {
  let items = tools

  if (!items && category) {
    items = TOOL_CATALOG
      .filter(t => t.category === category && t.path !== exclude)
      .slice(0, max)
  }

  if (!items || items.length === 0) return null

  return (
    <div className="related-tools">
      <p className="related-tools-title">You might also like</p>
      <div className="related-tools-grid">
        {items.slice(0, max).map(t => (
          <Link key={t.path} to={t.path} className="related-tool-card">
            <span className="related-tool-icon">{t.icon}</span>
            <span>{t.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
