'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'

type RecentEvent = {
  id: string
  run_id: string
  framework: string
  model_name: string
  tokens_before: number
  tokens_after: number
  task_success: number
  timestamp: string
}

const API_URL = process.env.NEXT_PUBLIC_DASHBOARD_API_URL ?? 'http://localhost:8000'
const PROJECT_ID = process.env.NEXT_PUBLIC_DEMO_PROJECT_ID ?? ''
const JWT = process.env.NEXT_PUBLIC_DEMO_JWT ?? ''

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<RecentEvent[]>([])
  const [prevIds, setPrevIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchEvents = async () => {
      if (!PROJECT_ID || !JWT) return
      try {
        const res = await fetch(
          `${API_URL}/api/events/recent?project_id=${PROJECT_ID}&limit=10`,
          { headers: { Authorization: `Bearer ${JWT}` } }
        )
        if (!res.ok) return
        const data: RecentEvent[] = await res.json()
        setEvents(data)
        // Toast new events
        const newEvents = data.filter((e) => !prevIds.has(e.id))
        newEvents.forEach((e) => {
          const saved = e.tokens_before - e.tokens_after
          const cost = (saved * 0.000003).toFixed(4)
          if (e.task_success) {
            toast.success(`${e.framework} run saved ${saved.toLocaleString()} tokens ($${cost})`)
          } else {
            toast.error(`${e.framework} run failed — budget exceeded`)
          }
        })
        setPrevIds(new Set(data.map((e) => e.id)))
      } catch {}
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      data-testid="activity-feed"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Live Activity</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            className="pulse-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>LIVE</span>
        </div>
      </div>
      {/* Events */}
      <AnimatePresence>
        {events.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Waiting for runs…
          </p>
        ) : (
          events.map((ev) => {
            const saved = ev.tokens_before - ev.tokens_after
            const cost = (saved * 0.000003).toFixed(4)
            const success = Boolean(ev.task_success)
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: success ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {success ? '⚡' : '⚠️'}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text)' }}>
                    {success
                      ? `${ev.framework} run saved ${saved.toLocaleString()} tokens`
                      : `${ev.framework} run failed`}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 2,
                      fontSize: 11,
                      color: 'var(--muted)',
                    }}
                  >
                    <span>{ev.model_name}</span>
                    <span>{timeAgo(ev.timestamp)}</span>
                    {success && <span style={{ color: '#34d399' }}>−${cost}</span>}
                    {!success && <span style={{ color: '#f43f5e' }}>task failed</span>}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </AnimatePresence>
    </div>
  )
}
