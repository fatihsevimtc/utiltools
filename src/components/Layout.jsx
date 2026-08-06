import { useState, useEffect, useCallback } from 'react'
import { Link, Outlet, useLocation, NavLink } from 'react-router-dom'
import { useTheme } from '../useTheme'
import Logo from './Logo'
import { TOOL_CATEGORY_MAP, CATEGORY_LABEL } from '../toolCategories'

const TOOL_NAMES = {
  '/tools/word-counter':           'Word Counter',
  '/tools/case-converter':         'Case Converter',
  '/tools/json-formatter':         'JSON Formatter',
  '/tools/diff-checker':           'Diff Checker',
  '/tools/qr-generator':           'QR Generator',
  '/tools/password-generator':     'Password Generator',
  '/tools/unit-converter':         'Unit Converter',
  '/tools/base64':                 'Base64 / URL Encode',
  '/tools/lorem-ipsum':            'Lorem Ipsum',
  '/tools/text-repeater':          'Text Repeater',
  '/tools/string-reverse':         'String Reverse',
  '/tools/duplicate-remover':      'Duplicate Remover',
  '/tools/line-sort':              'Line Sorter',
  '/tools/markdown-preview':       'Markdown Preview',
  '/tools/slug-generator':         'Slug Generator',
  '/tools/word-frequency':         'Word Frequency',
  '/tools/text-to-binary':         'Text ↔ Binary',
  '/tools/morse-code':             'Morse Code',
  '/tools/palindrome':             'Palindrome Checker',
  '/tools/anagram':                'Anagram Checker',
  '/tools/whitespace-remover':     'Whitespace Remover',
  '/tools/email-extractor':        'Email Extractor',
  '/tools/url-extractor':          'URL Extractor',
  '/tools/number-extractor':       'Number Extractor',
  '/tools/line-break-remover':     'Line Break Remover',
  '/tools/sentence-counter':       'Sentence Counter',
  '/tools/text-to-hashtags':       'Text to Hashtags',
  '/tools/title-case-apa':         'Title Case (APA)',
  '/tools/pig-latin':              'Pig Latin',
  '/tools/html-entities':          'HTML Entities',
  '/tools/jwt-decoder':            'JWT Decoder',
  '/tools/regex-tester':           'Regex Tester',
  '/tools/color-converter':        'Color Converter',
  '/tools/timestamp':              'Timestamp Converter',
  '/tools/css-minifier':           'CSS Minifier',
  '/tools/css-formatter':          'CSS Formatter',
  '/tools/js-minifier':            'JS Minifier',
  '/tools/html-minifier':          'HTML Minifier',
  '/tools/html-to-markdown':       'HTML → Markdown',
  '/tools/markdown-to-html':       'Markdown → HTML',
  '/tools/xml-formatter':          'XML Formatter',
  '/tools/xml-to-json':            'XML → JSON',
  '/tools/json-to-xml':            'JSON → XML',
  '/tools/json-to-csv':            'JSON → CSV',
  '/tools/csv-to-json':            'CSV → JSON',
  '/tools/yaml-to-json':           'YAML → JSON',
  '/tools/json-to-yaml':           'JSON → YAML',
  '/tools/sql-formatter':          'SQL Formatter',
  '/tools/cron-parser':            'Cron Parser',
  '/tools/url-parser':             'URL Parser',
  '/tools/url-builder':            'URL Builder',
  '/tools/http-status':            'HTTP Status Codes',
  '/tools/json-path':              'JSON Path Tester',
  '/tools/totp-generator':         'TOTP / OTP Generator',
  '/tools/hex-calculator':         'Hex Calculator',
  '/tools/iban-validator':         'IBAN Validator',
  '/tools/credit-card-validator':  'Credit Card Validator',
  '/tools/data-uri-encoder':       'Data URI Encoder',
  '/tools/fake-data-generator':    'Fake Data Generator',
  '/tools/uuid-generator':         'UUID Generator',
  '/tools/hash-generator':         'Hash Generator',
  '/tools/random-number':          'Random Number',
  '/tools/avatar-generator':       'Avatar Generator',
  '/tools/logo-maker':             'Logo Maker',
  '/tools/linkedin-post-maker':    'LinkedIn Post Maker',
  '/tools/percentage':             'Percentage Calc',
  '/tools/number-base':            'Number Base',
  '/tools/roman-numeral':          'Roman Numerals',
  '/tools/binary-calculator':      'Binary Calculator',
  '/tools/prime-checker':          'Prime Checker',
  '/tools/gcd-lcm':                'GCD / LCM',
  '/tools/fibonacci':              'Fibonacci Generator',
  '/tools/bmi':                    'BMI Calculator',
  '/tools/tip-calculator':         'Tip Calculator',
  '/tools/loan-calculator':        'Loan Calculator',
  '/tools/compound-interest':      'Compound Interest',
  '/tools/vat-calculator':         'VAT Calculator',
  '/tools/scientific-calculator':  'Scientific Calculator',
  '/tools/factorial':              'Factorial / P / C',
  '/tools/age-calculator':         'Age Calculator',
  '/tools/date-difference':        'Date Difference',
  '/tools/timezone':               'Time Zone Converter',
  '/tools/countdown':              'Countdown Timer',
  '/tools/stopwatch':              'Stopwatch',
  '/tools/working-days':           'Working Days',
  '/tools/week-number':            'Week Number',
  '/tools/pomodoro':               'Pomodoro Timer',
  '/tools/image-resizer':          'Image Resizer',
  '/tools/file-size':              'File Size Converter',
  '/tools/image-to-base64':        'Image to Base64',
  '/tools/base64-to-image':        'Base64 to Image',
  '/tools/image-color-picker':     'Image Color Picker',
  '/tools/favicon-generator':      'Favicon Generator',
  '/tools/exif-viewer':            'EXIF Viewer',
  '/tools/gradient-generator':     'Gradient Generator',
  '/tools/box-shadow':             'Box Shadow Generator',
  '/tools/border-radius':          'Border Radius',
  '/tools/palette-generator':      'Palette Generator',
  '/tools/flexbox-playground':     'Flexbox Playground',
  '/tools/grid-generator':         'Grid Generator',
  '/tools/svg-optimizer':          'SVG Optimizer',
  '/tools/html-color-names':       'HTML Color Names',
  '/tools/ai-model-comparison':    'AI Model Comparison',
  '/tools/token-counter':          'Token Counter',
  '/tools/system-prompt-builder':  'System Prompt Builder',
  '/tools/prompt-formatter':       'Prompt Formatter',
  '/tools/prompt-improver':        'Prompt Improver',
  '/tools/meta-tag-generator':     'Meta Tag Generator',
  '/tools/og-preview':             'OG Preview',
  '/tools/robots-txt':             'robots.txt Generator',
  '/tools/sitemap-generator':      'Sitemap Generator',
  '/tools/readability-score':      'Readability Score',
  '/tools/unicode-char-map':       'Unicode Char Map',
  '/tools/json-diff':              'JSON Diff',
  '/tools/jwt-encoder':            'JWT Encoder',
  '/tools/ssl-decoder':            'SSL Certificate Decoder',
  '/tools/tweet-thread':           'Tweet Thread Formatter',
  '/tools/typing-speed':           'Typing Speed Test',
  '/tools/dns-lookup':             'DNS Lookup',
  '/tools/ascii-art':              'ASCII Art Generator',
  '/tools/color-blindness':        'Color Blindness Simulator',
  '/tools/resume-word-checker':    'Resume Word Checker',
  '/tools/bio-generator':          'Bio Generator',
  '/tools/keyboard-shortcuts':     'Keyboard Shortcuts',
  '/tools/json-schema-validator':  'JSON Schema Validator',
}

export default function Layout() {
  const location = useLocation()
  const isToolPage = location.pathname.startsWith('/tools/')
  const toolName = TOOL_NAMES[location.pathname]
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (toolName) {
      document.title = `${toolName} — UtilTools`
    } else if (location.pathname === '/about') {
      document.title = 'About — UtilTools'
    } else if (location.pathname === '/suggest') {
      document.title = 'Suggest a Tool — UtilTools'
    } else if (location.pathname === '/privacy') {
      document.title = 'Privacy — UtilTools'
    } else {
      document.title = 'UtilTools — Free Browser Utilities'
    }
  }, [location.pathname, toolName])

  // Back to top visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function closeMenu() { setMenuOpen(false) }

  const navActiveClass = ({ isActive }) => isActive ? 'nav-active' : undefined

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* Left: logo + breadcrumb */}
          <div className="header-left">
            <Link to="/" className="logo" onClick={closeMenu}>
              <Logo height={32} />
            </Link>
            {isToolPage && toolName && (
              <div className="breadcrumb">
                <span className="breadcrumb-sep">›</span>
                <Link to="/" className="breadcrumb-home" title="All tools">All tools</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{toolName}</span>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="nav nav-desktop" aria-label="Main navigation">
            <NavLink to="/suggest" className={navActiveClass}>Suggest a tool</NavLink>
            <NavLink to="/about" className={navActiveClass}>About</NavLink>
            <a
              href="https://github.com/fatihsevimtc/utiltools"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
              title="View source and contribute on GitHub"
              aria-label="GitHub repository"
            >
              <svg height="18" width="18" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                  -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                  .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                  .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                  0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a
              href="https://ko-fi.com/utiltools"
              target="_blank"
              rel="noopener noreferrer"
              className="kofi-btn"
              title="Like this site? A small donation keeps it running"
            >
              ♥ Donate
            </a>
          </nav>

          {/* Mobile: theme toggle + donate + hamburger */}
          <div className="nav-mobile">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a
              href="https://ko-fi.com/utiltools"
              target="_blank"
              rel="noopener noreferrer"
              className="kofi-btn"
            >
              ♥ Donate
            </a>
            <button
              className="hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            <Link to="/" onClick={closeMenu}>All tools</Link>
            <Link to="/suggest" onClick={closeMenu}>Suggest a tool</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/privacy" onClick={closeMenu}>Privacy</Link>
            <a
              href="https://github.com/fatihsevimtc/utiltools"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              GitHub
            </a>
          </nav>
        )}
      </header>

      <main className="main-content">
        <Outlet context={{ category: TOOL_CATEGORY_MAP[location.pathname], categoryLabel: CATEGORY_LABEL[TOOL_CATEGORY_MAP[location.pathname]] }} />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>All processing happens in your browser — your data never leaves your device.</p>
          <div className="footer-links">
            <Link to="/">All tools</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/about">About</Link>
            <Link to="/suggest">Suggest a tool</Link>
            <a href="https://github.com/fatihsevimtc/utiltools" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://ko-fi.com/utiltools" target="_blank" rel="noopener noreferrer">
              ♥ Donate
            </a>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        className={`back-to-top${showBackToTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  )
}
