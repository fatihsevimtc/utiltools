import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { CATEGORIES } from '../src/toolCategories.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'https://utiltools.org'
const today = new Date().toISOString().slice(0, 10)

const STATIC_PAGES = [
  { loc: '/',        changefreq: 'weekly',  priority: '1.0' },
  { loc: '/about',   changefreq: 'monthly', priority: '0.5' },
  { loc: '/privacy', changefreq: 'yearly',  priority: '0.3' },
  { loc: '/suggest', changefreq: 'yearly',  priority: '0.4' },
]

// Collect unique tool paths preserving category order
const seen = new Set()
const toolPaths = []
for (const cat of CATEGORIES) {
  for (const path of cat.tools) {
    if (!seen.has(path)) {
      seen.add(path)
      toolPaths.push(path)
    }
  }
}

function urlTag({ loc, changefreq, priority }) {
  return `  <url><loc>${BASE_URL}${loc}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
}

const staticBlock = STATIC_PAGES.map(p => `  <url>\n    <loc>${BASE_URL}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n')

const toolsBlock = toolPaths.map(path => urlTag({ loc: path, changefreq: 'monthly', priority: '0.8' })).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${staticBlock}

${toolsBlock}

</urlset>`

const out = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(out, xml, 'utf8')
console.log(`sitemap.xml generated with ${toolPaths.length} tools (${today})`)
