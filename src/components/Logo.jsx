/**
 * SVG wordmark logo — works on both dark and light themes.
 * Icon: a 2×2 grid of rounded squares with the top-right one accented,
 *       suggesting a "tools panel" or "dashboard".
 * Text: util (currentColor) + tools (accent purple)
 */
export default function Logo({ height = 32 }) {
  const h = height
  const iconSize = h * 0.72
  const gap = h * 0.18
  const iconY = (h - iconSize) / 2  // vertically centre the icon grid

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h}
      viewBox={`0 0 ${h * 5.4} ${h}`}
      aria-label="UtilTools"
      role="img"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* ── Icon: 2×2 grid of rounded squares ── */}
      <rect x={h * 0.04}                  y={iconY}                        width={iconSize * 0.44} height={iconSize * 0.44} rx={iconSize * 0.1} fill="currentColor" opacity="0.45" />
      <rect x={h * 0.04 + iconSize * 0.56} y={iconY}                        width={iconSize * 0.44} height={iconSize * 0.44} rx={iconSize * 0.1} fill="#6c63ff" />
      <rect x={h * 0.04}                  y={iconY + iconSize * 0.56}      width={iconSize * 0.44} height={iconSize * 0.44} rx={iconSize * 0.1} fill="#6c63ff" opacity="0.7" />
      <rect x={h * 0.04 + iconSize * 0.56} y={iconY + iconSize * 0.56}      width={iconSize * 0.44} height={iconSize * 0.44} rx={iconSize * 0.1} fill="currentColor" opacity="0.25" />

      {/* ── Wordmark ── */}
      <text
        x={iconSize + gap}
        y={h * 0.5}
        dominantBaseline="central"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize={h * 0.62}
        letterSpacing="-0.02em"
      >
        <tspan fill="currentColor">util</tspan><tspan fill="#6c63ff">tools</tspan>
      </text>
    </svg>
  )
}
