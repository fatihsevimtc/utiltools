import { Link } from 'react-router-dom'

/**
 * A small "← Back to all tools" link shown at the top of every
 * tool page and secondary page (About, Suggest, Privacy).
 */
export default function BackBar() {
  return (
    <Link to="/" className="back-bar">
      ← Back to all tools
    </Link>
  )
}
