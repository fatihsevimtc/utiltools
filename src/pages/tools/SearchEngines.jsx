import { useState } from 'react'
import BackBar from '../../components/BackBar'
import RelatedTools from '../../components/RelatedTools'
import ToolSeo from '../../components/ToolSeo'

export default function SearchEngines() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const engines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', category: 'general', icon: '🌐' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', category: 'general', icon: '🔍' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', category: 'privacy', icon: '🦆' },
    { name: 'GitHub', url: 'https://github.com/search?q=', category: 'code', icon: '💻' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=', category: 'code', icon: '📚' },
    { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', category: 'video', icon: '🎥' },
    { name: 'Reddit', url: 'https://www.reddit.com/search/?q=', category: 'community', icon: '🤖' },
    { name: 'Twitter/X', url: 'https://twitter.com/search?q=', category: 'social', icon: '🐦' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search=', category: 'reference', icon: '📖' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/input/?i=', category: 'academic', icon: '🧮' },
    { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=', category: 'academic', icon: '🎓' },
    { name: 'arXiv', url: 'https://arxiv.org/search/?query=', category: 'academic', icon: '📄' },
    { name: 'NPM', url: 'https://www.npmjs.com/search?q=', category: 'code', icon: '📦' },
    { name: 'PyPI', url: 'https://pypi.org/search/?q=', category: 'code', icon: '🐍' },
    { name: 'Docker Hub', url: 'https://hub.docker.com/search?q=', category: 'code', icon: '🐳' },
    { name: 'Medium', url: 'https://medium.com/search?q=', category: 'community', icon: '✍️' },
    { name: 'Dev.to', url: 'https://dev.to/search?q=', category: 'community', icon: '👨‍💻' },
    { name: 'Hacker News', url: 'https://hn.algolia.com/?q=', category: 'community', icon: '📰' },
  ]

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'code', label: 'Code & Packages' },
    { value: 'academic', label: 'Academic' },
    { value: 'community', label: 'Community' },
    { value: 'video', label: 'Video' },
    { value: 'privacy', label: 'Privacy-focused' },
  ]

  const filtered = category === 'all' ? engines : engines.filter(e => e.category === category)

  return (
    <div className="tool-page">
      <BackBar />
      <h1>Special Search Engines</h1>
      <p className="tool-description">Curated directory of specialized search engines for code, academic papers, videos, and more.</p>

      <label htmlFor="search-query">Search Query</label>
      <input 
        id="search-query"
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Enter your search term..."
      />

      <label htmlFor="category-filter">Filter by Category</label>
      <select id="category-filter" value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.map(engine => (
          <a 
            key={engine.name}
            href={query ? engine.url + encodeURIComponent(query) : engine.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1.5rem 1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid var(--border)',
              transition: 'transform 0.2s, border-color 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = 'var(--primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{engine.icon}</div>
            <div style={{ fontWeight: '600' }}>{engine.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
              {engine.category}
            </div>
          </a>
        ))}
      </div>

      <RelatedTools category="misc" exclude="/tools/search-engines" />
      <ToolSeo />
    </div>
  )
}
