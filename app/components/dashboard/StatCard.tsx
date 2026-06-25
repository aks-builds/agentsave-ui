'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate, Variants } from 'framer-motion'

export type StatCardProps = {
  title: string
  value: number
  subtitle: string
  accent: string
  accentGlow: string
  icon: React.ReactNode
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  sparkData: number[]
  testId: string
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function Sparkline({ data, accent }: { data: number[]; accent: string }) {
  const max = Math.max(...data, 1)
  const width = 100
  const height = 32
  const step = width / (data.length - 1)

  const points = data
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(' ')

  const fillPoints = `0,${height} ${points} ${width},${height}`

  // Extract first color from gradient for stroke
  const strokeColor = accent.includes('#') ? accent.match(/#[0-9a-fA-F]{6}/)?.[0] ?? '#6366f1' : '#6366f1'
  const gradId = `spark-${strokeColor.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="32" preserveAspectRatio="none" style={{ marginTop: '8px' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    })
    return controls.stop
  }, [value, motionVal])

  return <span>{display}</span>
}

export default function StatCard({
  title, value, subtitle, accent, accentGlow, icon, change, changeType, sparkData, testId,
}: StatCardProps) {
  const changeColor =
    changeType === 'positive' ? '#10b981' :
    changeType === 'negative' ? '#f43f5e' :
    'var(--muted)'

  return (
    <motion.div
      className="stat-card"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      data-testid={testId}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'default',
        transition: 'border-color 200ms ease',
        '--card-gradient': accent,
        '--card-glow': accentGlow,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </p>
        <span
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: accentGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </span>
      </div>

      {/* Value */}
      <p
        data-testid={`${testId}-value`}
        style={{
          fontSize: '32px',
          fontWeight: 900,
          color: 'var(--text)',
          margin: '0 0 4px',
          lineHeight: 1,
        }}
      >
        <AnimatedNumber value={value} />
      </p>

      {/* Subtitle */}
      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>{subtitle}</p>

      {/* Change row */}
      <p style={{ fontSize: '12px', color: changeColor, margin: '8px 0 0', fontWeight: 500 }}>
        {change}
      </p>

      {/* Sparkline */}
      <Sparkline data={sparkData} accent={accent} />
    </motion.div>
  )
}
