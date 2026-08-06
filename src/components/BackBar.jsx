import { Link } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'

/**
 * A small back-link shown at the top of every tool page.
 * Automatically reads the category from the Layout outlet context,
 * so no props need to be passed from individual tool pages.
 *
 * Falls back to "Back to all tools" for pages without a category
 * (About, Privacy, Suggest) or when used outside a Layout outlet.
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

  if (category && categoryLabel) {
    return (
      <Link to={`/?cat=${category}`} className="back-bar">
        ← Back to {categoryLabel}
      </Link>
    )
  }

  return (
    <Link to="/" className="back-bar">
      ← Back to all tools
    </Link>
  )
}
