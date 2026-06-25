'use client'

import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from '../ui/CommandPalette'
import { usePathname } from 'next/navigation'

export type SidebarMode = 'full' | 'icons' | 'bottom'

const PAGE_TITLES: Record<string, string> = {
  '/':              'Dashboard',
  '/analytics':     'Analytics',
  '/runs':          'Agent Runs',
  '/frameworks':    'Frameworks',
  '/cost':          'Cost',
  '/settings/keys': 'API Keys',
  '/billing':       'Billing',
  '/settings':      'Settings',
}

function getMode(w: number): SidebarMode {
  if (w < 768) return 'bottom'
  if (w < 1024) return 'icons'
  return 'full'
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mode, setMode] = useState<SidebarMode>('full')
  const title = PAGE_TITLES[pathname] ?? 'AgentSave'

  useEffect(() => {
    const update = () => setMode(getMode(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}
    >
      {/* Sidebar (full or icon-only) */}
      {mode !== 'bottom' && <Sidebar mode={mode} />}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} onCommandPaletteOpen={() => setPaletteOpen(true)} />
        <main
          role="main"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            paddingBottom: mode === 'bottom' ? '80px' : '24px',
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      {mode === 'bottom' && <BottomTabBar />}

      {/* Command palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      {/* Toast notifications */}
      <Toaster position="bottom-right" richColors duration={4000} />
    </div>
  )
}

function BottomTabBar() {
  const pathname = usePathname()
  const tabs = [
    { href: '/',              icon: '⊞', label: 'Dashboard' },
    { href: '/runs',          icon: '🤖', label: 'Runs'     },
    { href: '/cost',          icon: '💰', label: 'Cost'     },
    { href: '/settings/keys', icon: '🔑', label: 'Keys'     },
    { href: '/billing',       icon: '💳', label: 'Billing'  },
  ]
  return (
    <nav
      data-testid="bottom-tab-bar"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 56, background: 'rgba(5,5,15,0.95)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        zIndex: 100, padding: '0 8px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map(tab => (
        <a
          key={tab.href}
          href={tab.href}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, padding: '6px 4px',
            color: pathname === tab.href ? '#a78bfa' : 'var(--muted)',
            textDecoration: 'none', fontSize: 10, fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </a>
      ))}
    </nav>
  )
}
