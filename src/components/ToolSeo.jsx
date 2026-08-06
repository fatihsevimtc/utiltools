import { useLocation } from 'react-router-dom'
import { TOOL_SEO } from '../toolSeoData'

/**
 * Renders an SEO content block (about paragraph + FAQ accordion)
 * for the current tool page. Returns null if no data exists for the path.
 *
 * Usage: drop <ToolSeo /> anywhere in a tool page — no props needed.
 */
export default function ToolSeo() {
  const { pathname } = useLocation()
  const data = TOOL_SEO[pathname]
  if (!data) return null

  return (
    <div className="tool-seo" aria-label="About this tool">
      {data.about && (
        <p className="tool-seo-about">{data.about}</p>
      )}
      {data.faqs?.length > 0 && (
        <div className="tool-seo-faqs">
          <h2 className="tool-seo-heading">Frequently asked questions</h2>
          {data.faqs.map((faq, i) => (
            <details key={i} className="tool-seo-faq">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
