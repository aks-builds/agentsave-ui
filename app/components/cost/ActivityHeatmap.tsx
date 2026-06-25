'use client'

import { Fragment } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export default function ActivityHeatmap() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div data-testid="activity-heatmap">
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px repeat(28, 1fr)',
              gap: 3,
              minWidth: 400,
            }}
          >
            {DAYS.map((day, r) => (
              <Fragment key={`row-${day}`}>
                <div
                  style={{
                    fontSize: 9,
                    color: 'var(--muted)',
                    fontFamily: 'JetBrains Mono, monospace',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {day}
                </div>
                {Array.from({ length: 28 }, (_, c) => {
                  const intensity = seededRandom(r * 28 + c)
                  return (
                    <Tooltip.Root key={`${r}-${c}`}>
                      <Tooltip.Trigger asChild>
                        <div
                          style={{
                            height: 14,
                            borderRadius: 3,
                            background: `rgba(99,102,241,${intensity.toFixed(2)})`,
                            cursor: 'default',
                          }}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          style={{
                            background: '#0d0d1a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 11,
                            color: '#f0f0f8',
                            zIndex: 100,
                          }}
                          sideOffset={4}
                        >
                          {day}, Week {Math.floor(c / 7) + 1} — {Math.round(intensity * 10)} runs
                          <Tooltip.Arrow style={{ fill: '#0d0d1a' }} />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 10,
            justifyContent: 'flex-end',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Less</span>
          {[0.1, 0.3, 0.6, 0.8, 1.0].map((o) => (
            <div
              key={o}
              style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(99,102,241,${o})` }}
            />
          ))}
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>More</span>
        </div>
      </div>
    </Tooltip.Provider>
  )
}
