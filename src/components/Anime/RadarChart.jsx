import styles from './RadarChart.module.css'

const SIZE   = 260
const CENTER = SIZE / 2
const LEVELS = 4

function polarToXY(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

function buildPolygon(values, maxR) {
  const n = values.length
  return values
    .map((v, i) => {
      const angle = (360 / n) * i
      const r = (v / 100) * maxR
      const { x, y } = polarToXY(angle, r)
      return `${x},${y}`
    })
    .join(' ')
}

export default function RadarChart({ axes }) {
  const n    = axes.length
  const maxR = CENTER - 28

  const gridPolygons = Array.from({ length: LEVELS }, (_, li) => {
    const r = (maxR / LEVELS) * (li + 1)
    return axes
      .map((_, i) => {
        const { x, y } = polarToXY((360 / n) * i, r)
        return `${x},${y}`
      })
      .join(' ')
  })

  const dataPolygon = buildPolygon(axes.map((a) => a.value), maxR)

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg}>
        {/* 网格 */}
        {gridPolygons.map((pts, li) => (
          <polygon
            key={li}
            points={pts}
            fill="none"
            stroke="rgba(79,158,255,0.12)"
            strokeWidth="1"
          />
        ))}

        {/* 轴线 */}
        {axes.map((_, i) => {
          const { x, y } = polarToXY((360 / n) * i, maxR)
          return (
            <line
              key={i}
              x1={CENTER} y1={CENTER}
              x2={x}      y2={y}
              stroke="rgba(79,158,255,0.15)"
              strokeWidth="1"
            />
          )
        })}

        {/* 数据填充 */}
        <polygon
          points={dataPolygon}
          fill="rgba(79,158,255,0.12)"
          stroke="rgba(79,158,255,0.7)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {axes.map((a, i) => {
          const r = (a.value / 100) * maxR
          const { x, y } = polarToXY((360 / n) * i, r)
          return (
            <circle key={i} cx={x} cy={y} r="3.5"
              fill="var(--accent)"
              stroke="rgba(9,9,15,0.8)"
              strokeWidth="1.5"
            />
          )
        })}

        {/* 轴标签 */}
        {axes.map((a, i) => {
          const { x, y } = polarToXY((360 / n) * i, maxR + 20)
          const anchor =
            Math.abs(x - CENTER) < 4 ? 'middle' :
            x < CENTER ? 'end' : 'start'
          return (
            <text
              key={i}
              x={x} y={y + 4}
              textAnchor={anchor}
              className={styles.label}
            >
              {a.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
