'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export type RunRow = {
  id: string
  run_id: string
  framework: string
  model_name: string
  tokens_before: number
  tokens_after: number
  task_success: boolean
  timestamp: string
}

type RunsTableProps = {
  runs: RunRow[]
  showPagination?: boolean
}

const FRAMEWORK_BADGE: Record<string, { bg: string; color: string }> = {
  langchain:  { bg: 'rgba(99,102,241,0.15)',  color: '#a78bfa' },
  autogen:    { bg: 'rgba(16,185,129,0.15)',  color: '#34d399' },
  crewai:     { bg: 'rgba(244,63,94,0.15)',   color: '#fb7185' },
  langgraph:  { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  smolagents: { bg: 'rgba(139,92,246,0.15)',  color: '#c4b5fd' },
  raw:        { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
}

const PAGE_SIZE = 10

export default function RunsTable({ runs, showPagination = false }: RunsTableProps) {
  const [page, setPage] = useState(0)

  const paginated = showPagination
    ? runs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : runs

  const totalPages = Math.ceil(runs.length / PAGE_SIZE)

  const th: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--muted)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  }

  const td: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: '13px',
  }

  return (
    <div data-testid="runs-table" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Status</th>
            <th style={th}>Framework</th>
            <th style={th}>Model</th>
            <th style={th}>Tokens Before</th>
            <th style={th}>Tokens After</th>
            <th style={th}>Saved</th>
            <th style={th}>Reduction</th>
            <th style={th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((row) => {
            const saved = row.tokens_before - row.tokens_after
            const reduction = row.tokens_before > 0
              ? Math.round((saved / row.tokens_before) * 100)
              : 0
            const badge = FRAMEWORK_BADGE[row.framework] ?? FRAMEWORK_BADGE.raw
            let timeAgo = '—'
            try {
              timeAgo = formatDistanceToNow(new Date(row.timestamp), { addSuffix: true })
            } catch {}

            return (
              <tr
                key={row.id}
                data-testid="run-row"
                style={{ transition: 'background 150ms ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {/* Status */}
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: row.task_success ? '#10b981' : '#f43f5e',
                        boxShadow: `0 0 6px ${row.task_success ? '#10b981' : '#f43f5e'}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: row.task_success ? '#10b981' : '#f43f5e', fontSize: '13px' }}>
                      {row.task_success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </td>

                {/* Framework badge */}
                <td style={td}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: badge.bg,
                      color: badge.color,
                      textTransform: 'capitalize',
                    }}
                  >
                    {row.framework}
                  </span>
                </td>

                {/* Model */}
                <td style={td}>
                  <span className="font-mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {row.model_name}
                  </span>
                </td>

                {/* Tokens before */}
                <td style={td}>
                  <span className="font-mono" style={{ fontSize: '13px', color: 'var(--text)' }}>
                    {row.tokens_before.toLocaleString()}
                  </span>
                </td>

                {/* Tokens after */}
                <td style={td}>
                  <span className="font-mono" style={{ fontSize: '13px', color: 'var(--text)' }}>
                    {row.tokens_after.toLocaleString()}
                  </span>
                </td>

                {/* Saved */}
                <td style={td}>
                  <span className="font-mono" style={{ fontSize: '13px', color: '#34d399' }}>
                    −{saved.toLocaleString()}
                  </span>
                </td>

                {/* Reduction */}
                <td style={td}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: reduction > 0 ? '#10b981' : 'var(--muted)',
                    }}
                  >
                    {reduction > 0 ? `${reduction}%` : '0%'}
                  </span>
                </td>

                {/* Time */}
                <td style={td}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{timeAgo}</span>
                </td>
              </tr>
            )
          })}

          {paginated.length === 0 && (
            <tr>
              <td colSpan={8} style={{ ...td, textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>
                No runs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0 0',
            fontSize: '13px',
            color: 'var(--muted)',
          }}
        >
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, runs.length)} of {runs.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              data-testid="runs-prev"
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: page === 0 ? 'var(--muted)' : 'var(--text)',
                fontSize: '12px',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              data-testid="runs-next"
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: page === totalPages - 1 ? 'var(--muted)' : 'var(--text)',
                fontSize: '12px',
                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
