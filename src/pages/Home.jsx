import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

// Recently-added tools (shown with "New" badge)
const NEW_TOOLS = new Set([
  '/tools/unicode-char-map', '/tools/json-diff', '/tools/jwt-encoder',
  '/tools/ssl-decoder', '/tools/tweet-thread', '/tools/typing-speed',
  '/tools/dns-lookup', '/tools/ascii-art', '/tools/color-blindness',
  '/tools/resume-word-checker', '/tools/bio-generator', '/tools/keyboard-shortcuts',
  '/tools/json-schema-validator', '/tools/ai-model-comparison', '/tools/token-counter',
  '/tools/system-prompt-builder', '/tools/prompt-formatter', '/tools/prompt-improver',
  '/tools/linkedin-post-maker', '/tools/digital-signature',
  '/tools/image-compressor', '/tools/text-to-speech', '/tools/currency-converter',
])

// High-traffic / popular tools (shown with "🔥" badge)
const HOT_TOOLS = new Set([
  '/tools/password-generator', '/tools/json-formatter', '/tools/qr-generator',
  '/tools/base64', '/tools/uuid-generator', '/tools/hash-generator',
  '/tools/regex-tester', '/tools/jwt-decoder', '/tools/timestamp',
])

// Tool of the day — deterministic based on day-of-year so it rotates
const SPOTLIGHT_POOL = [
  // Developer
  { icon: '🔑', name: 'JWT Decoder',           desc: 'Decode JWT tokens entirely in your browser — nothing leaves your device.',     path: '/tools/jwt-decoder' },
  { icon: '🔍', name: 'Regex Tester',           desc: 'Test regular expressions with live match highlighting and group capture.',      path: '/tools/regex-tester' },
  { icon: '🗂️', name: 'JSON Formatter',        desc: 'Pretty-print and validate JSON with syntax highlighting and error detection.',  path: '/tools/json-formatter' },
  { icon: '🔀', name: 'JSON Diff',              desc: 'Compare two JSON objects and instantly see what changed.',                      path: '/tools/json-diff' },
  { icon: '🔒', name: 'SSL Certificate Decoder',desc: 'Paste a PEM cert and see its expiry, issuer and SAN fields.',                  path: '/tools/ssl-decoder' },
  { icon: '🔐', name: 'TOTP / OTP Generator',   desc: 'Generate time-based one-time passwords from a Base32 secret — fully offline.', path: '/tools/totp-generator' },
  { icon: '🏦', name: 'IBAN Validator',          desc: 'Validate any IBAN using the MOD-97 checksum algorithm — no server needed.',    path: '/tools/iban-validator' },
  { icon: '🎯', name: 'JSON Path Tester',        desc: 'Query JSON documents with JSONPath expressions and see results instantly.',     path: '/tools/json-path' },
  { icon: '⏰', name: 'Cron Parser',             desc: 'Paste any cron expression and get a plain-English explanation of the schedule.',path: '/tools/cron-parser' },
  { icon: '🌐', name: 'DNS Lookup',              desc: 'Query A, MX, TXT, CNAME and more records for any domain in your browser.',     path: '/tools/dns-lookup' },
  { icon: '🗺️', name: 'Unicode Char Map',       desc: 'Browse every Unicode character and click to copy instantly.',                  path: '/tools/unicode-char-map' },
  { icon: '🔑', name: 'JWT Encoder',             desc: 'Build and sign JWT tokens with HS256 directly in your browser.',               path: '/tools/jwt-encoder' },
  // Design & CSS
  { icon: '🎨', name: 'Palette Generator',       desc: 'Generate beautiful color palettes from a single base color.',                  path: '/tools/palette-generator' },
  { icon: '🌈', name: 'Gradient Generator',      desc: 'Build CSS gradients visually and copy the code with one click.',               path: '/tools/gradient-generator' },
  { icon: '📐', name: 'Flexbox Playground',      desc: 'Experiment with CSS Flexbox properties visually with live output.',            path: '/tools/flexbox-playground' },
  { icon: '🌑', name: 'Box Shadow Generator',    desc: 'Build layered CSS box-shadow values with a live preview.',                     path: '/tools/box-shadow' },
  { icon: '⬛', name: 'Border Radius Generator', desc: 'Create any CSS border-radius shape with live preview and instant copy.',       path: '/tools/border-radius' },
  { icon: '▦',  name: 'Grid Generator',          desc: 'Design CSS Grid layouts visually and copy the generated CSS.',                 path: '/tools/grid-generator' },
  { icon: '🎨', name: 'HTML Color Names',         desc: 'Browse all 140 named HTML/CSS colors with HEX values and one-click copy.',    path: '/tools/html-color-names' },
  { icon: '👁️', name: 'Color Blindness Simulator',desc: 'Preview images as people with different types of color blindness see them.', path: '/tools/color-blindness' },
  // Text
  { icon: '📖', name: 'Readability Score',        desc: 'Get Flesch Reading Ease and grade level scores for any piece of text.',       path: '/tools/readability-score' },
  { icon: '🐦', name: 'Tweet Thread Formatter',   desc: 'Split long text into a numbered Twitter/X thread, each under 280 chars.',    path: '/tools/tweet-thread' },
  { icon: '👤', name: 'Bio Generator',            desc: 'Fill in a few fields and get a polished professional bio in seconds.',        path: '/tools/bio-generator' },
  { icon: '📝', name: 'Resume Word Checker',      desc: 'Flag weak, vague, and overused buzzwords in your CV before you apply.',       path: '/tools/resume-word-checker' },
  { icon: '🐷', name: 'Pig Latin',                desc: 'Convert any English text to Pig Latin — great for kids and wordplay.',        path: '/tools/pig-latin' },
  { icon: '📊', name: 'Word Frequency',           desc: 'See how often each word appears in any text, ranked by count.',               path: '/tools/word-frequency' },
  // Math & Numbers
  { icon: '📈', name: 'Compound Interest',        desc: 'See how your investment grows over time with annual compounding.',            path: '/tools/compound-interest' },
  { icon: '🔬', name: 'Scientific Calculator',    desc: 'Trig, logarithms, powers, and constants — all in your browser.',             path: '/tools/scientific-calculator' },
  { icon: '🌀', name: 'Fibonacci Generator',      desc: 'Generate Fibonacci sequences and check if any number is a Fibonacci member.', path: '/tools/fibonacci' },
  { icon: '!',  name: 'Factorial / P / C',         desc: 'Calculate factorials, permutations, and combinations for any n and r.',      path: '/tools/factorial' },
  { icon: 'Ⅻ',  name: 'Roman Numerals',           desc: 'Convert any number to Roman numerals and back — supports up to 3,999.',       path: '/tools/roman-numeral' },
  // Time & Date
  { icon: '⏱️', name: 'Pomodoro Timer',           desc: 'Stay focused with the Pomodoro technique — no account or install needed.',   path: '/tools/pomodoro' },
  { icon: '🌍', name: 'Time Zone Converter',       desc: 'Compare times across multiple time zones side by side.',                     path: '/tools/timezone' },
  { icon: '📅', name: 'Working Days Calculator',   desc: 'Count working days between dates, excluding weekends and public holidays.',  path: '/tools/working-days' },
  { icon: '🗓️', name: 'Week Number',              desc: 'Find the ISO week number for any date — useful for project planning.',       path: '/tools/week-number' },
  // Images & Files
  { icon: '📸', name: 'EXIF Viewer',               desc: 'Extract camera metadata from any JPEG — shutter speed, GPS and more.',      path: '/tools/exif-viewer' },
  { icon: '⭐', name: 'Favicon Generator',          desc: 'Turn any emoji into a favicon and download it at multiple sizes.',          path: '/tools/favicon-generator' },
  { icon: '🎨', name: 'Image Color Picker',         desc: 'Click anywhere on an uploaded image to instantly pick its color value.',    path: '/tools/image-color-picker' },
  // Generators
  { icon: '🎭', name: 'Fake Data Generator',        desc: 'Generate realistic fake names, emails, addresses and phone numbers.',       path: '/tools/fake-data-generator' },
  { icon: '👤', name: 'Avatar Generator',           desc: 'Create placeholder avatars from initials, geometric patterns, or pixel art.',path: '/tools/avatar-generator' },
  { icon: '🎨', name: 'ASCII Art Generator',        desc: 'Convert any text into ASCII art using Unicode block character styles.',     path: '/tools/ascii-art' },
  // AI Tools
  { icon: '🤖', name: 'Prompt Improver',            desc: 'Strengthen any AI prompt using best-practice rules automatically.',        path: '/tools/prompt-improver' },
  { icon: '🧱', name: 'System Prompt Builder',      desc: 'Build effective system prompts with persona, tone, and format controls.',  path: '/tools/system-prompt-builder' },
  { icon: '🤖', name: 'AI Model Comparison',        desc: 'Compare leading LLMs by context window, cost, and best use cases.',        path: '/tools/ai-model-comparison' },
  { icon: '🪙', name: 'Token Counter',              desc: 'Estimate token counts and API cost for GPT, Claude, and Gemini models.',   path: '/tools/token-counter' },
  // Security / Misc
  { icon: '💳', name: 'Credit Card Validator',      desc: 'Validate card numbers with the Luhn algorithm — offline and private.',     path: '/tools/credit-card-validator' },
  { icon: '⌨️', name: 'Typing Speed Test',          desc: 'Find out your real WPM with real-time accuracy feedback.',                 path: '/tools/typing-speed' },
  { icon: '⌨️', name: 'Keyboard Shortcuts',         desc: 'Cheatsheets for VS Code, Chrome, Windows, Mac, and Vim — always handy.',  path: '/tools/keyboard-shortcuts' },
]

function getSpotlight() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return SPOTLIGHT_POOL[dayOfYear % SPOTLIGHT_POOL.length]
}

// A curated short list for the hero marquee — readable at a slow scroll speed
const MARQUEE_ITEMS = [
  { icon: '📝', name: 'Word Counter',        path: '/tools/word-counter' },
  { icon: '🔒', name: 'Base64 Encode',       path: '/tools/base64' },
  { icon: '🗂️', name: 'JSON Formatter',     path: '/tools/json-formatter' },
  { icon: '🎨', name: 'Gradient Generator',  path: '/tools/gradient-generator' },
  { icon: '🔑', name: 'JWT Decoder',         path: '/tools/jwt-decoder' },
  { icon: '📷', name: 'QR Generator',        path: '/tools/qr-generator' },
  { icon: '🔐', name: 'Password Generator',  path: '/tools/password-generator' },
  { icon: '⏱️', name: 'Pomodoro Timer',     path: '/tools/pomodoro' },
  { icon: '🆔', name: 'UUID Generator',      path: '/tools/uuid-generator' },
  { icon: '🎨', name: 'Color Converter',     path: '/tools/color-converter' },
  { icon: '📐', name: 'Unit Converter',      path: '/tools/unit-converter' },
  { icon: '🌍', name: 'Time Zone Converter', path: '/tools/timezone' },
  { icon: '🔍', name: 'Regex Tester',        path: '/tools/regex-tester' },
  { icon: '📊', name: 'CSV → JSON',          path: '/tools/csv-to-json' },
  { icon: '🌈', name: 'Palette Generator',   path: '/tools/palette-generator' },
  { icon: '⚖️', name: 'BMI Calculator',     path: '/tools/bmi' },
  { icon: '🗄️', name: 'SQL Formatter',      path: '/tools/sql-formatter' },
  { icon: '📸', name: 'EXIF Viewer',         path: '/tools/exif-viewer' },
  { icon: '🤖', name: 'Prompt Improver',     path: '/tools/prompt-improver' },
  { icon: '🔀', name: 'Diff Checker',        path: '/tools/diff-checker' },
  { icon: '🎂', name: 'Age Calculator',      path: '/tools/age-calculator' },
  { icon: '📡', name: 'Morse Code',          path: '/tools/morse-code' },
  { icon: '#️⃣', name: 'Hash Generator',    path: '/tools/hash-generator' },
  { icon: '🖼️', name: 'Image Resizer',      path: '/tools/image-resizer' },
  { icon: '🪙', name: 'Token Counter',       path: '/tools/token-counter' },
  { icon: '🔢', name: 'Number Base',         path: '/tools/number-base' },
  { icon: '📋', name: 'Markdown Preview',    path: '/tools/markdown-preview' },
  { icon: '🌑', name: 'Box Shadow',          path: '/tools/box-shadow' },
  { icon: '🔗', name: 'URL Parser',          path: '/tools/url-parser' },
  { icon: '💰', name: 'VAT Calculator',      path: '/tools/vat-calculator' },
  { icon: '🗜️', name: 'Image Compressor',   path: '/tools/image-compressor' },
  { icon: '🔊', name: 'Text to Speech',      path: '/tools/text-to-speech' },
  { icon: '💱', name: 'Currency Converter',  path: '/tools/currency-converter' },
]

const FEATURED = [
  { icon: '📝', name: 'Word Counter',       desc: 'Live word, character & reading-time counts.',             path: '/tools/word-counter' },
  { icon: '🖼️', name: 'Image Resizer',     desc: 'Resize images instantly in your browser — no upload.',    path: '/tools/image-resizer' },
  { icon: '🗂️', name: 'JSON Formatter',    desc: 'Pretty-print and validate JSON with error highlighting.',  path: '/tools/json-formatter' },
  { icon: '🔀', name: 'Diff Checker',       desc: 'Paste two texts and see exactly what changed.',            path: '/tools/diff-checker' },
  { icon: '📷', name: 'QR Generator',       desc: 'Turn any URL or text into a downloadable QR code.',        path: '/tools/qr-generator' },
  { icon: '🔐', name: 'Password Generator', desc: 'Secure passwords and passphrases with a strength meter.',  path: '/tools/password-generator' },
  { icon: '✍️', name: 'Digital Signature',  desc: 'Draw and download your signature as PNG, JPG, or SVG.',   path: '/tools/digital-signature' },
  { icon: '📐', name: 'Unit Converter',     desc: 'Convert length, weight, temperature, speed and more.',    path: '/tools/unit-converter' },
]

const CATEGORIES = [
  {
    id: 'text',
    label: '📝 Text',
    tools: [
      { icon: '📄', name: 'Lorem Ipsum',         desc: 'Generate placeholder text.',                            path: '/tools/lorem-ipsum' },
      { icon: '📝', name: 'Word Counter',        desc: 'Live word, character & reading-time counts.',           path: '/tools/word-counter' },
      { icon: '🔤', name: 'Case Converter',      desc: 'UPPER, lower, Title, camelCase, snake_case and more.',  path: '/tools/case-converter' },
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
      { icon: '📖', name: 'Readability Score',    desc: 'Flesch Reading Ease and grade level for any text.',      path: '/tools/readability-score' },
      { icon: '🐦', name: 'Tweet Thread Formatter', desc: 'Split long text into a Twitter/X thread under 280 chars.', path: '/tools/tweet-thread' },
      { icon: '📝', name: 'Resume Word Checker',  desc: 'Flag weak, vague, and clichéd language in your resume.', path: '/tools/resume-word-checker' },
      { icon: '👤', name: 'Bio Generator',        desc: 'Generate a polished professional bio in seconds.',        path: '/tools/bio-generator' },
      { icon: '🔊', name: 'Text to Speech',       desc: 'Listen to any text using your browser\'s built-in speech engine.', path: '/tools/text-to-speech' },
    ],
  },
  {
    id: 'developer',
    label: '🛠️ Developer',
    tools: [
      { icon: '🌐', name: 'HTML Entities',        desc: 'Encode/decode HTML special characters.',                path: '/tools/html-entities' },
      { icon: '🔒', name: 'Base64 / URL Encode', desc: 'Encode and decode Base64 or URL-encoded strings.',       path: '/tools/base64' },
      { icon: '🗂️', name: 'JSON Formatter',     desc: 'Pretty-print and validate JSON with error highlighting.',  path: '/tools/json-formatter' },
      { icon: '🔀', name: 'Diff Checker',        desc: 'Paste two texts and see exactly what changed.',            path: '/tools/diff-checker' },
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
      { icon: '🔑', name: 'JWT Encoder',           desc: 'Build and sign JWT tokens with HS256 in your browser.',   path: '/tools/jwt-encoder' },
      { icon: '🔍', name: 'JSON Schema Validator', desc: 'Validate JSON data against a JSON Schema.',               path: '/tools/json-schema-validator' },
      { icon: '🔀', name: 'JSON Diff',             desc: 'Compare two JSON objects and see what changed.',           path: '/tools/json-diff' },
      { icon: '🌐', name: 'DNS Lookup',            desc: 'Query A, MX, TXT, CNAME and more for any domain.',        path: '/tools/dns-lookup' },
      { icon: '🔒', name: 'SSL Certificate Decoder', desc: 'Decode a PEM certificate to view expiry and fields.',   path: '/tools/ssl-decoder' },
      { icon: '🗺️', name: 'Unicode Char Map',     desc: 'Browse Unicode blocks and click to copy any character.',  path: '/tools/unicode-char-map' },
    ],
  },
  {
    id: 'generators',
    label: '⚡ Generators',
    tools: [
      { icon: '🆔', name: 'UUID Generator',       desc: 'Random v4 UUIDs in bulk.',                              path: '/tools/uuid-generator' },
      { icon: '#️⃣', name: 'Hash Generator',      desc: 'SHA-1 / SHA-256 / SHA-512.',                           path: '/tools/hash-generator' },
      { icon: '📷', name: 'QR Generator',        desc: 'Turn any URL or text into a downloadable QR code.',      path: '/tools/qr-generator' },
      { icon: '🔐', name: 'Password Generator',  desc: 'Secure passwords and passphrases with a strength meter.',path: '/tools/password-generator' },
      { icon: '🎲', name: 'Random Number',        desc: 'Random numbers in a range.',                            path: '/tools/random-number' },
      { icon: '👤', name: 'Avatar Generator',     desc: 'Generate placeholder avatars from initials or patterns.', path: '/tools/avatar-generator' },
      { icon: '🎨', name: 'Logo Maker',            desc: 'Design a simple logo with shapes, gradients, and fonts.', path: '/tools/logo-maker' },
      { icon: '💼', name: 'LinkedIn Post Maker',   desc: 'Format LinkedIn posts with Unicode bold, emojis, and CTAs.', path: '/tools/linkedin-post-maker' },
      { icon: '⌨️', name: 'Typing Speed Test',    desc: 'Test your WPM and accuracy with real-time feedback.',     path: '/tools/typing-speed' },
      { icon: '🎨', name: 'ASCII Art Generator',  desc: 'Convert text to ASCII art using Unicode block characters.',path: '/tools/ascii-art' },
    ],
  },
  {
    id: 'math',
    label: '🔢 Math & Numbers',
    tools: [
      { icon: '%',  name: 'Percentage Calc',      desc: 'X% of Y, % change and more.',                           path: '/tools/percentage' },
      { icon: '📐', name: 'Unit Converter',       desc: 'Convert length, weight, temperature, speed and more.',   path: '/tools/unit-converter' },
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
      { icon: '💱', name: 'Currency Converter',    desc: 'Convert between 170+ currencies with live exchange rates.', path: '/tools/currency-converter' },
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
      { icon: '✍️', name: 'Digital Signature',    desc: 'Draw and download your signature as PNG, JPG, or SVG.',  path: '/tools/digital-signature' },
      { icon: '🖼️', name: 'Image Resizer',       desc: 'Resize images in-browser.',                             path: '/tools/image-resizer' },
      { icon: '💾', name: 'File Size Converter',  desc: 'Bytes, KB, MB, GB and more.',                           path: '/tools/file-size' },
      { icon: '🔐', name: 'Image to Base64',      desc: 'Convert any image to a Base64 data URI.',               path: '/tools/image-to-base64' },
      { icon: '🖼️', name: 'Base64 to Image',     desc: 'Preview and download an image from Base64.',            path: '/tools/base64-to-image' },
      { icon: '🎨', name: 'Image Color Picker',   desc: 'Click anywhere on an image to pick a color.',           path: '/tools/image-color-picker' },
      { icon: '⭐', name: 'Favicon Generator',    desc: 'Create emoji favicons and download at multiple sizes.',  path: '/tools/favicon-generator' },
      { icon: '📸', name: 'EXIF Viewer',          desc: 'Extract EXIF metadata from JPEG images in your browser.', path: '/tools/exif-viewer' },
      { icon: '🗜️', name: 'Image Compressor',   desc: 'Compress JPEG, PNG, and WebP images entirely in your browser.', path: '/tools/image-compressor' },
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
    id: 'seo',
    label: '🔍 SEO & Marketing',
    tools: [
      { icon: '🏷️', name: 'Meta Tag Generator',   desc: 'Generate SEO, Open Graph and Twitter Card meta tags.',   path: '/tools/meta-tag-generator' },
      { icon: '👁️', name: 'OG Preview',           desc: 'Preview how your page looks when shared on social media.', path: '/tools/og-preview' },
      { icon: '🤖', name: 'robots.txt Generator', desc: 'Build a robots.txt file to control bot crawling.',        path: '/tools/robots-txt' },
      { icon: '🗺️', name: 'Sitemap Generator',    desc: 'Build an XML sitemap for search engine indexing.',        path: '/tools/sitemap-generator' },
    ],
  },
  {
    id: 'misc',
    label: '🎯 Misc & Fun',
    tools: [
      { icon: '⌨️', name: 'Typing Speed Test',    desc: 'Test your WPM and accuracy with real-time feedback.',     path: '/tools/typing-speed' },
      { icon: '🎨', name: 'ASCII Art Generator',  desc: 'Convert text to ASCII art using Unicode block characters.',path: '/tools/ascii-art' },
      { icon: '⌨️', name: 'Keyboard Shortcuts',   desc: 'Cheatsheets for VS Code, Chrome, Windows, Mac and Vim.',  path: '/tools/keyboard-shortcuts' },
      { icon: '👁️', name: 'Color Blindness Sim',  desc: 'Preview images as people with color blindness see them.', path: '/tools/color-blindness' },
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
  { name: 'PDF Merge' },
  { name: 'PDF to Text' },
  { name: 'PDF Page Count' },
]

// Deduplicate by path — FEATURED + CATEGORIES can overlap
const _allToolsRaw = [
  ...FEATURED,
  ...CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, category: c.label }))),
]
const seen = new Set()
const ALL_TOOLS = _allToolsRaw.filter(t => {
  if (!t.path || seen.has(t.path)) return false
  seen.add(t.path)
  return true
})

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
  const [searchParams] = useSearchParams()
  const [query, setQuery]         = useState('')
  const [activeCat, setActiveCat] = useState(() => searchParams.get('cat') || null)
  const [favPaths, setFavPaths]   = useState(loadFavs)
  const [recentPaths, setRecentPaths] = useState(loadRecent)
  const [catsExpanded, setCatsExpanded] = useState(false)
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 640)
  const searchRef = useRef(null)

  // ── Marquee drag-to-scroll (mouse + touch) ─────────────────────────────
  const marqueeTrackRef = useRef(null)
  const marqueeWrapRef  = useRef(null)

  // Pause on hover (desktop), resume on leave
  const onMarqueeEnter = useCallback(() => {
    const track = marqueeTrackRef.current
    if (track) track.style.animationPlayState = 'paused'
  }, [])

  const onMarqueeLeave = useCallback(() => {
    const track = marqueeTrackRef.current
    if (track && !marqueeWrapRef.current?.classList.contains('is-dragging')) {
      track.style.animationPlayState = ''
    }
  }, [])

  // Shared drag logic — works for both mouse and touch
  const startDrag = useCallback((clientX, isTouch = false) => {
    const track = marqueeTrackRef.current
    const wrap  = marqueeWrapRef.current
    if (!track || !wrap) return

    // Lazily captured once dragging actually starts
    let startTranslate = null
    let moved = false

    function beginDrag() {
      const matrix = new DOMMatrixReadOnly(window.getComputedStyle(track).transform)
      startTranslate = matrix.m41
      track.style.animation = 'none'
      track.style.transform = `translateX(${startTranslate}px)`
    }

    function resumeAnimation() {
      const matrix2   = new DOMMatrixReadOnly(window.getComputedStyle(track).transform)
      const endX      = matrix2.m41
      const halfWidth = track.scrollWidth / 2
      let offset = endX % halfWidth
      if (offset > 0) offset -= halfWidth
      const progress = Math.abs(offset) / halfWidth
      const delay    = -(progress * 40)
      track.style.transform = ''
      track.style.animation = ''
      track.style.animationDelay = `${delay}s`
    }

    function onMove(x) {
      const delta = x - clientX
      if (!moved && Math.abs(delta) > 5) {
        moved = true
        beginDrag()
        wrap.classList.add('is-dragging')
      }
      if (moved) {
        track.style.transform = `translateX(${startTranslate + delta}px)`
      }
    }

    function onEnd() {
      wrap.classList.remove('is-dragging')
      if (moved) {
        resumeAnimation()
      }
      // On touch, always resume animation (no hover state on mobile)
      if (isTouch) {
        track.style.animationPlayState = ''
      }
    }

    // Mouse handlers
    function onMouseMove(ev) { onMove(ev.clientX) }
    function onMouseUp()     { onEnd(); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }

    // Touch handlers
    function onTouchMove(ev) { onMove(ev.touches[0].clientX) }
    function onTouchEnd()    { onEnd(); window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', onTouchEnd) }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend',  onTouchEnd)
  }, [])

  const onMarqueeMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    startDrag(e.clientX)
  }, [startDrag])

  const onMarqueeTouchStart = useCallback((e) => {
    startDrag(e.touches[0].clientX, true)
  }, [startDrag])

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

  const spotlight = useMemo(() => getSpotlight(), [])

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

      {/* ── MARQUEE STRIP ── */}
      {!query && (
        <div
          className="hero-marquee"
          ref={marqueeWrapRef}
          onMouseEnter={onMarqueeEnter}
          onMouseLeave={onMarqueeLeave}
          onMouseDown={onMarqueeMouseDown}
          onTouchStart={onMarqueeTouchStart}
        >
          <div className="hero-marquee-track" ref={marqueeTrackRef}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <Link key={i} to={t.path} className="hero-marquee-item">
                <span>{t.icon}</span> {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}

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
          {/* Tool of the day spotlight */}
          <div className="tool-spotlight">
            <p className="tool-spotlight-label">✨ Tool of the day</p>
            <div className="tool-spotlight-icon">{spotlight.icon}</div>
            <p className="tool-spotlight-name">{spotlight.name}</p>
            <p className="tool-spotlight-desc">{spotlight.desc}</p>
            <Link to={spotlight.path} className="tool-spotlight-link">Try it →</Link>
          </div>

          <div className="sidebar-divider" />

          {/* Stats */}
          <div className="sidebar-stat-box">
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="sidebar-stat-value">{totalTools}</div>
                <div className="sidebar-stat-label">Tools</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="sidebar-stat-value">{CATEGORIES.length}</div>
                <div className="sidebar-stat-label">Categories</div>
              </div>
            </div>
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
  const isNew = NEW_TOOLS.has(tool.path)
  const isHot = HOT_TOOLS.has(tool.path)

  // Extract category id from the category label (e.g. "📝 Text" → "text")
  const catId = tool.category
    ? tool.category.replace(/^[^\s]+\s/, '').toLowerCase()
    : undefined

  return (
    <Link
      to={tool.path}
      className="tool-card"
      onClick={() => onClick(tool.path)}
      style={{ position: 'relative' }}
      data-cat={catId}
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
      {isNew && <span className="tool-badge tool-badge--new">✦ New</span>}
      {!isNew && isHot && <span className="tool-badge tool-badge--hot">🔥 Popular</span>}
      {!isNew && !isHot && tool.category && (
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 'auto' }}>
          {tool.category}
        </span>
      )}
    </Link>
  )
}
