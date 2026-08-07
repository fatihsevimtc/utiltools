import { useState } from 'react'
import BackBar from '../../components/BackBar'

const MIME_TABLE = [
  { ext: 'txt',   mime: 'text/plain' },
  { ext: 'html',  mime: 'text/html' },
  { ext: 'htm',   mime: 'text/html' },
  { ext: 'css',   mime: 'text/css' },
  { ext: 'js',    mime: 'text/javascript' },
  { ext: 'ts',    mime: 'text/typescript' },
  { ext: 'jsx',   mime: 'text/javascript' },
  { ext: 'tsx',   mime: 'text/typescript' },
  { ext: 'json',  mime: 'application/json' },
  { ext: 'xml',   mime: 'application/xml' },
  { ext: 'csv',   mime: 'text/csv' },
  { ext: 'pdf',   mime: 'application/pdf' },
  { ext: 'zip',   mime: 'application/zip' },
  { ext: 'tar',   mime: 'application/x-tar' },
  { ext: 'gz',    mime: 'application/gzip' },
  { ext: 'mp3',   mime: 'audio/mpeg' },
  { ext: 'mp4',   mime: 'video/mp4' },
  { ext: 'wav',   mime: 'audio/wav' },
  { ext: 'ogg',   mime: 'audio/ogg' },
  { ext: 'png',   mime: 'image/png' },
  { ext: 'jpg',   mime: 'image/jpeg' },
  { ext: 'jpeg',  mime: 'image/jpeg' },
  { ext: 'gif',   mime: 'image/gif' },
  { ext: 'webp',  mime: 'image/webp' },
  { ext: 'svg',   mime: 'image/svg+xml' },
  { ext: 'ico',   mime: 'image/x-icon' },
  { ext: 'woff',  mime: 'font/woff' },
  { ext: 'woff2', mime: 'font/woff2' },
  { ext: 'ttf',   mime: 'font/ttf' },
  { ext: 'otf',   mime: 'font/otf' },
  { ext: 'eot',   mime: 'application/vnd.ms-fontobject' },
  { ext: 'doc',   mime: 'application/msword' },
  { ext: 'docx',  mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { ext: 'xls',   mime: 'application/vnd.ms-excel' },
  { ext: 'xlsx',  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { ext: 'ppt',   mime: 'application/vnd.ms-powerpoint' },
  { ext: 'pptx',  mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { ext: 'epub',  mime: 'application/epub+zip' },
  { ext: 'apk',   mime: 'application/vnd.android.package-archive' },
  { ext: 'exe',   mime: 'application/vnd.microsoft.portable-executable' },
  { ext: 'dmg',   mime: 'application/x-apple-diskimage' },
  { ext: 'iso',   mime: 'application/x-iso9660-image' },
  { ext: 'sql',   mime: 'application/sql' },
  { ext: 'md',    mime: 'text/markdown' },
  { ext: 'yaml',  mime: 'application/yaml' },
  { ext: 'yml',   mime: 'application/yaml' },
  { ext: 'toml',  mime: 'application/toml' },
  { ext: 'sh',    mime: 'application/x-sh' },
  { ext: 'bat',   mime: 'application/x-msdos-program' },
  { ext: 'py',    mime: 'text/x-python' },
  { ext: 'rb',    mime: 'text/x-ruby' },
  { ext: 'php',   mime: 'text/x-php' },
  { ext: 'c',     mime: 'text/x-c' },
  { ext: 'cpp',   mime: 'text/x-c++' },
  { ext: 'java',  mime: 'text/x-java-source' },
  { ext: 'go',    mime: 'text/x-go' },
  { ext: 'rs',    mime: 'text/x-rust' },
]

export default function MimeLookup() {
  const [search, setSearch] = useState('')

  const q = search.trim().toLowerCase().replace(/^\./, '')
  const filtered = q
    ? MIME_TABLE.filter(r => r.ext.includes(q) || r.mime.includes(q))
    : MIME_TABLE

  return (
    <div className="tool-page">
      <BackBar />
      <h1>MIME Type Lookup</h1>
      <p className="tool-description">Look up MIME types by file extension or content type.</p>

      <label htmlFor="mime-search">Search by extension or MIME type</label>
      <input
        id="mime-search"
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="pdf or application/json"
        style={{ fontSize: '0.95rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface2, #f0f0f0)' }}>
              <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)', width: '100px' }}>Extension</th>
              <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>MIME Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.ext}>
                <td style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--border, #ddd)', color: 'var(--accent, #6366f1)', fontWeight: 600 }}>.{r.ext}</td>
                <td style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--border, #ddd)' }}>{r.mime}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', opacity: 0.5, border: '1px solid var(--border, #ddd)' }}>No results for "{q}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>{filtered.length} of {MIME_TABLE.length} entries shown</p>
    </div>
  )
}
