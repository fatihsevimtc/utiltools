import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const TOOL_NAMES = {
  '/tools/word-counter':       'Word Counter',
  '/tools/case-converter':     'Case Converter',
  '/tools/json-formatter':     'JSON Formatter',
  '/tools/diff-checker':       'Diff Checker',
  '/tools/qr-generator':       'QR Generator',
  '/tools/password-generator': 'Password Generator',
  '/tools/unit-converter':     'Unit Converter',
  '/tools/base64':             'Base64 / URL Encode',
}

export default function Layout() {
  const location = useLocation()
  const isToolPage = location.pathname.startsWith('/tools/')
  const toolName = TOOL_NAMES[location.pathname]
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* Left: logo + breadcrumb */}
          <div className="header-left">
            <Link to="/" className="logo" onClick={closeMenu}>
              util<span>tools</span>
            </Link>
            {isToolPage && toolName && (
              <div className="breadcrumb">
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{toolName}</span>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="nav nav-desktop">
            <Link to="/suggest">Suggest a tool</Link>
            <Link to="/about">About</Link>
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

          {/* Mobile: donate button always visible + hamburger */}
          <div className="nav-mobile">
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
          <nav className="mobile-menu">
            <Link to="/" onClick={closeMenu}>All tools</Link>
            <Link to="/suggest" onClick={closeMenu}>Suggest a tool</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/privacy" onClick={closeMenu}>Privacy</Link>
          </nav>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>All processing happens in your browser — your data never leaves your device.</p>
          <div className="footer-links">
            <Link to="/">All tools</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/about">About</Link>
            <Link to="/suggest">Suggest a tool</Link>
            <a href="https://ko-fi.com/utiltools" target="_blank" rel="noopener noreferrer">
              ♥ Donate
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
