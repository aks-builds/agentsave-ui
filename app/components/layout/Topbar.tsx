'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Plus, Search } from 'lucide-react'
import { useTheme } from 'next-themes'

type Period = '7d' | '30d' | '90d'

type TopbarProps = {
  title: string
  onCommandPaletteOpen: () => void
}

export default function Topbar({ title, onCommandPaletteOpen }: TopbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('agentsave-period') as Period) ?? '30d'
    }
    return '30d'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePeriod = (p: Period) => {
    setPeriod(p)
    localStorage.setItem('agentsave-period', p)
  }

  return (
    <header
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5,5,15,0.80)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Page title */}
      <h1
        data-testid="topbar-title"
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text)',
          margin: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h1>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Cmd+K search pill */}
      <button
        onClick={onCommandPaletteOpen}
        data-testid="command-palette-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '200px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--muted)',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <Search size={13} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search or run command…</span>
        <kbd
          style={{
            fontSize: '10px',
            padding: '2px 5px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--muted)',
            fontFamily: 'inherit',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Period picker */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '3px',
        }}
      >
        {(['7d', '30d', '90d'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePeriod(p)}
            data-testid={`period-${p}`}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: p === period ? 500 : 400,
              color: p === period ? '#a78bfa' : 'var(--muted)',
              background: p === period ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          data-testid="theme-toggle"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--muted)',
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      )}

      {/* New Project CTA */}
      <button
        onClick={() => router.push('/')}
        data-testid="new-project-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 0 16px rgba(99,102,241,0.35)',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 150ms ease',
          whiteSpace: 'nowrap',
        }}
      >
        <Plus size={14} />
        New Project
      </button>
    </header>
  )
}
