import { Link } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'

/**
 * Breadcrumb bar shown at the top of every tool page.
 * When a category is known: All tools › Category
 * Otherwise: All tools
 */
export default function BackBar() {
  let context = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useOutletContext()
  } catch {
    // Not rendered inside an Outlet — static pages outside Layout
  }

  const { category, categoryLabel } = context || {}

  return (
    <nav className="back-bar" aria-label="Breadcrumb">
      <Link to="/">← All tools</Link>
      {category && categoryLabel && (
        <>
          <span className="back-bar-sep" aria-hidden="true">›</span>
          <Link to={`/?cat=${category}`}>{categoryLabel}</Link>
        </>
      )}
    </nav>
  )
}
