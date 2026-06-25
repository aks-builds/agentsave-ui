'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Settings</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Manage your preferences and account.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>A</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--text)' }}>demo@agentsave.io</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Pro plan</p>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }} data-testid="settings-preferences">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Preferences</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text)' }}>Theme</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Choose dark or light mode</p>
          </div>
          {mounted && (
            <button
              data-testid="theme-toggle-settings"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#a78bfa', cursor: 'pointer' }}
            >
              {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
