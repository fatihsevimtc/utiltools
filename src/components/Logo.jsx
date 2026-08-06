/**
 * Logo — icon grid + wordmark.
 * Uses a flex row (HTML) instead of SVG text so vertical alignment is
 * consistent across all browsers and iOS Safari (SVG dominantBaseline
 * is unreliable on WebKit).
 */
export default function Logo({ height = 32 }) {
  const h = height
  const iconSize = h * 0.72
  const cellSize = iconSize * 0.44
  const gap = iconSize * 0.12   // gap between the 2 cells in the grid
  const iconY = (h - iconSize) / 2

  // Total icon width (2 cells + gap between them)
  const iconW = cellSize * 2 + gap
  const textGap = h * 0.18

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: textGap,
        height: h,
        lineHeight: 1,
      }}
    >
      {/* ── Icon: 2×2 grid ── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconW}
        height={iconSize}
        viewBox={`0 0 ${iconW} ${iconSize}`}
        aria-hidden="true"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <rect x={0}              y={0}                        width={cellSize} height={cellSize} rx={cellSize * 0.22} fill="currentColor" opacity="0.45" />
        <rect x={cellSize + gap} y={0}                        width={cellSize} height={cellSize} rx={cellSize * 0.22} fill="#6c63ff" />
        <rect x={0}              y={cellSize + gap}            width={cellSize} height={cellSize} rx={cellSize * 0.22} fill="#6c63ff" opacity="0.7" />
        <rect x={cellSize + gap} y={cellSize + gap}            width={cellSize} height={cellSize} rx={cellSize * 0.22} fill="currentColor" opacity="0.25" />
      </svg>

      {/* ── Wordmark (HTML so alignment is always correct on iOS) ── */}
      <span
        aria-label="UtilTools"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: h * 0.62,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'currentColor' }}>util</span>
        <span style={{ color: '#6c63ff' }}>tools</span>
      </span>
    </span>
  )
}
