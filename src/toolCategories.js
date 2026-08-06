/**
 * Shared tool-category metadata used by both Home.jsx and Layout.jsx.
 * Keeps the single source of truth for category labels and tool→category mapping.
 */

export const CATEGORIES = [
  {
    id: 'text',
    label: '📝 Text',
    tools: [
      '/tools/word-counter', '/tools/case-converter',
      '/tools/lorem-ipsum', '/tools/text-repeater', '/tools/string-reverse',
      '/tools/duplicate-remover', '/tools/line-sort', '/tools/markdown-preview',
      '/tools/slug-generator', '/tools/word-frequency', '/tools/text-to-binary',
      '/tools/morse-code', '/tools/palindrome', '/tools/anagram',
      '/tools/whitespace-remover', '/tools/email-extractor', '/tools/url-extractor',
      '/tools/number-extractor', '/tools/line-break-remover', '/tools/sentence-counter',
      '/tools/text-to-hashtags', '/tools/title-case-apa', '/tools/pig-latin',
      '/tools/readability-score', '/tools/tweet-thread', '/tools/resume-word-checker',
      '/tools/bio-generator',
    ],
  },
  {
    id: 'developer',
    label: '🛠️ Developer',
    tools: [
      '/tools/json-formatter', '/tools/diff-checker', '/tools/base64',
      '/tools/html-entities', '/tools/jwt-decoder', '/tools/regex-tester',
      '/tools/color-converter', '/tools/timestamp', '/tools/css-minifier',
      '/tools/css-formatter', '/tools/js-minifier', '/tools/html-minifier',
      '/tools/html-to-markdown', '/tools/markdown-to-html', '/tools/xml-formatter',
      '/tools/xml-to-json', '/tools/json-to-xml', '/tools/json-to-csv',
      '/tools/csv-to-json', '/tools/yaml-to-json', '/tools/json-to-yaml',
      '/tools/sql-formatter', '/tools/cron-parser', '/tools/url-parser',
      '/tools/url-builder', '/tools/http-status', '/tools/json-path',
      '/tools/totp-generator', '/tools/hex-calculator', '/tools/iban-validator',
      '/tools/credit-card-validator', '/tools/data-uri-encoder', '/tools/fake-data-generator',
      '/tools/jwt-encoder', '/tools/json-schema-validator', '/tools/json-diff',
      '/tools/dns-lookup', '/tools/ssl-decoder', '/tools/unicode-char-map',
    ],
  },
  {
    id: 'generators',
    label: '⚡ Generators',
    tools: [
      '/tools/qr-generator', '/tools/password-generator',
      '/tools/uuid-generator', '/tools/hash-generator', '/tools/random-number',
      '/tools/avatar-generator', '/tools/logo-maker', '/tools/linkedin-post-maker',
      '/tools/typing-speed', '/tools/ascii-art',
    ],
  },
  {
    id: 'math',
    label: '🔢 Math & Numbers',
    tools: [
      '/tools/percentage', '/tools/unit-converter', '/tools/number-base', '/tools/roman-numeral',
      '/tools/binary-calculator', '/tools/prime-checker', '/tools/gcd-lcm',
      '/tools/fibonacci', '/tools/bmi', '/tools/tip-calculator',
      '/tools/loan-calculator', '/tools/compound-interest', '/tools/vat-calculator',
      '/tools/scientific-calculator', '/tools/factorial',
    ],
  },
  {
    id: 'time',
    label: '📅 Time & Date',
    tools: [
      '/tools/age-calculator', '/tools/date-difference', '/tools/timezone',
      '/tools/countdown', '/tools/stopwatch', '/tools/working-days',
      '/tools/week-number', '/tools/pomodoro',
    ],
  },
  {
    id: 'files',
    label: '🖼️ Images & Files',
    tools: [
      '/tools/digital-signature',
      '/tools/image-resizer', '/tools/file-size', '/tools/image-to-base64',
      '/tools/base64-to-image', '/tools/image-color-picker', '/tools/favicon-generator',
      '/tools/exif-viewer',
    ],
  },
  {
    id: 'design',
    label: '🎨 Design & CSS',
    tools: [
      '/tools/gradient-generator', '/tools/box-shadow', '/tools/border-radius',
      '/tools/palette-generator', '/tools/flexbox-playground', '/tools/grid-generator',
      '/tools/svg-optimizer', '/tools/html-color-names',
    ],
  },
  {
    id: 'seo',
    label: '🔍 SEO & Marketing',
    tools: [
      '/tools/meta-tag-generator', '/tools/og-preview', '/tools/robots-txt',
      '/tools/sitemap-generator',
    ],
  },
  {
    id: 'misc',
    label: '🎯 Misc & Fun',
    tools: [
      '/tools/typing-speed', '/tools/ascii-art', '/tools/keyboard-shortcuts',
      '/tools/color-blindness',
    ],
  },
  {
    id: 'ai',
    label: '🤖 AI Tools',
    tools: [
      '/tools/ai-model-comparison', '/tools/token-counter', '/tools/system-prompt-builder',
      '/tools/prompt-formatter', '/tools/prompt-improver',
    ],
  },
]

/** Map of tool path → category id, e.g. '/tools/jwt-decoder' → 'developer' */
export const TOOL_CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.flatMap(cat => cat.tools.map(path => [path, cat.id]))
)

/** Map of category id → label, e.g. 'developer' → '🛠️ Developer' */
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map(cat => [cat.id, cat.label])
)
