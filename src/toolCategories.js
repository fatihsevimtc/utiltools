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
      '/tools/bio-generator', '/tools/text-to-speech',
      '/tools/kebab-camel', '/tools/vowel-counter', '/tools/empty-line-remover',
      '/tools/text-splitter', '/tools/character-remover', '/tools/prefix-suffix',
      '/tools/find-replace', '/tools/repeated-words', '/tools/text-joiner',
      '/tools/truncate-text', '/tools/emoji-remover', '/tools/alternating-case',
      '/tools/text-padder',
        '/tools/character-counter', '/tools/line-counter', '/tools/text-to-one-line',
      '/tools/special-char-remover', '/tools/wrap-text', '/tools/comma-separator',
      '/tools/tabs-to-spaces',
      '/tools/unicode-text-converter', '/tools/zalgo-text', '/tools/censor-text',
      '/tools/indent-text',
      '/tools/text-align', '/tools/random-sentence', '/tools/word-randomizer',
    ],
  },
  {
    id: 'developer',
    label: '🛠️ Developer',
    tools: [
      '/tools/json-formatter', '/tools/diff-checker', '/tools/base64',
        '/tools/html-entities', '/tools/jwt-decoder', '/tools/regex-tester', '/tools/regex-replacer',
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
      '/tools/js-formatter', '/tools/html-formatter', '/tools/sql-minifier',
      '/tools/graphql-formatter', '/tools/regex-to-english', '/tools/glob-tester',
      '/tools/query-string', '/tools/mime-lookup', '/tools/ip-info', '/tools/user-agent',
      '/tools/toml-to-json', '/tools/css-to-tailwind', '/tools/rsa-generator',
      '/tools/isbn-validator', '/tools/bcrypt', '/tools/css-variables',
        '/tools/list-to-array', '/tools/port-checker',
      '/tools/json-key-sorter', '/tools/json-unescape',
      '/tools/json-to-php', '/tools/table-converter', '/tools/schema-markup',
      '/tools/pwa-manifest', '/tools/syntax-highlighter',
    ],
  },
  {
    id: 'generators',
    label: '⚡ Generators',
    tools: [
      '/tools/qr-generator', '/tools/password-generator',
      '/tools/uuid-generator', '/tools/hash-generator', '/tools/random-number',
      '/tools/avatar-generator', '/tools/logo-maker', '/tools/linkedin-post-maker',
      '/tools/typing-speed', '/tools/ascii-art', '/tools/invoice-maker',
      '/tools/sequence-generator', '/tools/random-picker',
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
      '/tools/scientific-calculator', '/tools/factorial', '/tools/currency-converter',
      '/tools/matrix-calculator', '/tools/discount-calculator',
      '/tools/number-to-words', '/tools/number-sorter',
        '/tools/sales-tax', '/tools/margin-calculator', '/tools/gst-calculator',
        '/tools/area-calculator', '/tools/prime-factorization',      '/tools/probability', '/tools/paypal-fee', '/tools/cpm-calculator',
      '/tools/confidence-interval',
    ],
  },
  {
    id: 'time',
    label: '📅 Time & Date',
    tools: [
      '/tools/age-calculator', '/tools/date-difference', '/tools/timezone',
      '/tools/countdown', '/tools/stopwatch', '/tools/working-days',
      '/tools/week-number', '/tools/pomodoro', '/tools/calendar',
        '/tools/world-clock', '/tools/sleep-calculator',
    ],
  },
  {
    id: 'files',
    label: '🖼️ Images & Files',
    tools: [
      '/tools/digital-signature',
      '/tools/image-resizer', '/tools/file-size', '/tools/image-to-base64',
      '/tools/base64-to-image', '/tools/image-color-picker', '/tools/favicon-generator',
      '/tools/exif-viewer', '/tools/image-compressor',
      '/tools/image-cropper', '/tools/png-to-jpeg', '/tools/webp-converter',
      '/tools/ean-barcode', '/tools/docx-word-count',
      '/tools/pdf-page-count', '/tools/pdf-to-text', '/tools/pdf-merge',
      '/tools/flip-rotate-image',
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
        '/tools/sitemap-generator', '/tools/privacy-policy-generator',
        '/tools/utm-builder', '/tools/terms-generator', '/tools/disclaimer-generator',
    ],
  },
  {
    id: 'misc',
    label: '🎯 Misc & Fun',
    tools: [
      '/tools/keyboard-shortcuts', '/tools/color-blindness',
        '/tools/simple-note', '/tools/tone-generator',
        '/tools/shoe-size', '/tools/subtitle-converter', '/tools/metronome',
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
