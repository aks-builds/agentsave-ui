'use client'

import { useState } from 'react'
import {
  ComposedChart, Area, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

export type DataPoint = { date: string; saved: number; baseline: number }

type Tab = 'area' | 'line' | 'bar'

type TokensAreaChartProps = {
  data: DataPoint[]
}

const TOOLTIP_STYLE = {
  background: '#0d0d1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#f0f0f8',
  fontSize: '12px',
}

export default function TokensAreaChart({ data }: TokensAreaChartProps) {
  const [tab, setTab] = useState<Tab>('area')

  const renderChart = () => {
    const common = {
      isAnimationActive: true,
      animationDuration: 1000,
      animationEasing: 'ease-out' as const,
    }

    if (tab === 'area') {
      return (
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
          <Area
            type="monotone"
            dataKey="baseline"
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            fill="url(#gradBaseline)"
            opacity={0.5}
            {...common}
          />
          <Area
            type="monotone"
            dataKey="saved"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#gradSaved)"
            {...common}
          />
        </ComposedChart>
      )
    }

    if (tab === 'line') {
      return (
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            {...common}
          />
          <Line
            type="monotone"
            dataKey="saved"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            {...common}
          />
        </ComposedChart>
      )
    }

    // bar
    return (
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar dataKey="baseline" fill="#10b981" opacity={0.5} radius={[3,3,0,0]} {...common} />
        <Bar dataKey="saved" fill="#6366f1" radius={[3,3,0,0]} {...common} />
      </ComposedChart>
    )
  }

  return (
    <div data-testid="tokens-area-chart">
      {/* Tab toggle */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '3px',
          width: 'fit-content',
        }}
      >
        {(['area', 'line', 'bar'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: t === tab ? 500 : 400,
              color: t === tab ? '#a78bfa' : 'var(--muted)',
              background: t === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 150ms ease',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
