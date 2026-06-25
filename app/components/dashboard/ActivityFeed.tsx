'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'

type RunRow = {
  run_id: string
  framework: string
  model_name: string
  tokens_before: number
  tokens_after: number
  task_success: boolean
  timestamp: string
}

// Client-side fetch — needs NEXT_PUBLIC_ prefix so Next.js exposes these to the browser
const API_URL = process.env.NEXT_PUBLIC_AGENTSAVE_API_URL ?? 'http://localhost:8000'
const API_KEY = process.env.NEXT_PUBLIC_AGENTSAVE_API_KEY ?? ''

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function ActivityFeed() {
  const [runs, setRuns] = useState<RunRow[]>([])
  const [prevIds, setPrevIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchRuns = async () => {
      if (!API_KEY) return
      try {
        const res = await fetch(`${API_URL}/api/runs?per_page=10`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const newRuns: RunRow[] = data.runs ?? []
        setRuns(newRuns)
        // Toast runs that appeared since last poll
        const fresh = newRuns.filter((r) => !prevIds.has(r.run_id))
        fresh.forEach((r) => {
          const saved = r.tokens_before - r.tokens_after
          const cost = (saved * 0.000003).toFixed(4)
          if (r.task_success) {
            toast.success(`${r.framework} saved ${saved.toLocaleString()} tokens ($${cost})`)
          } else {
            toast.error(`${r.framework} run failed — budget exceeded`)
          }
        })
        setPrevIds(new Set(newRuns.map((r) => r.run_id)))
      } catch {}
    }

    fetchRuns()
    const interval = setInterval(fetchRuns, 5000)
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
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}
          />
          <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>LIVE</span>
        </div>
      </div>
      {/* Runs */}
      <AnimatePresence>
        {runs.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            {API_KEY ? 'Waiting for runs…' : 'Set NEXT_PUBLIC_AGENTSAVE_API_KEY to enable live feed'}
          </p>
        ) : (
          runs.map((r) => {
            const saved = r.tokens_before - r.tokens_after
            const cost = (saved * 0.000003).toFixed(4)
            return (
              <motion.div
                key={r.run_id}
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
                    background: r.task_success ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {r.task_success ? '⚡' : '⚠️'}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text)' }}>
                    {r.task_success
                      ? `${r.framework} saved ${saved.toLocaleString()} tokens`
                      : `${r.framework} run failed`}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2, fontSize: 11, color: 'var(--muted)' }}>
                    <span>{r.model_name}</span>
                    <span>{timeAgo(r.timestamp)}</span>
                    {r.task_success && <span style={{ color: '#34d399' }}>−${cost}</span>}
                    {!r.task_success && <span style={{ color: '#f43f5e' }}>task failed</span>}
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
