'use client'

type Slice = { name: string; value: number; color: string }

type FrameworkDonutProps = {
  data: Slice[]
  total: number
}

const FRAMEWORK_COLORS: Record<string, string> = {
  langchain:  '#6366f1',
  langgraph:  '#f43f5e',
  autogen:    '#f59e0b',
  crewai:     '#10b981',
  smolagents: '#8b5cf6',
  raw:        '#6b7280',
}

export { FRAMEWORK_COLORS }

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(cx, cy, r, startAngle)
  const end = polarToXY(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export default function FrameworkDonut({ data, total }: FrameworkDonutProps) {
  const cx = 70, cy = 70, r = 52, strokeW = 18
  let currentAngle = 0
  const totalVal = data.reduce((s, d) => s + d.value, 0) || 1

  return (
    <div data-testid="framework-donut">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW} />
        {/* Slices */}
        {data.map((slice) => {
          const angle = (slice.value / totalVal) * 360
          const path = describeArc(cx, cy, r, currentAngle, currentAngle + angle - 2)
          currentAngle += angle
          return (
            <path
              key={slice.name}
              d={path}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          )
        })}
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#a78bfa" fontSize="18" fontWeight="900">
          {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#6b6b80" fontSize="9">tokens</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#6b6b80" fontSize="9">saved</text>
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
        {data.map((slice) => (
          <div key={slice.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: slice.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{slice.name}</span>
            </div>
            <span style={{ color: slice.color, fontWeight: 700 }}>
              {Math.round((slice.value / totalVal) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
