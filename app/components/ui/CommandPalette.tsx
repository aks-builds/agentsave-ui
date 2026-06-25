'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  LayoutDashboard,
  BarChart2,
  Bot,
  Zap,
  Key,
  CreditCard,
  Settings,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'

type Props = { open: boolean; onOpenChange: (o: boolean) => void }

const NAVIGATE = [
  { label: 'Dashboard',  href: '/',              icon: LayoutDashboard },
  { label: 'Analytics',  href: '/analytics',     icon: BarChart2       },
  { label: 'Agent Runs', href: '/runs',          icon: Bot             },
  { label: 'Frameworks', href: '/frameworks',    icon: Zap             },
  { label: 'Cost',       href: '/cost',          icon: Settings        },
  { label: 'API Keys',   href: '/settings/keys', icon: Key             },
  { label: 'Billing',    href: '/billing',       icon: CreditCard      },
  { label: 'Settings',   href: '/settings',      icon: Settings        },
]

export default function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  const go = useCallback(
    (href: string) => {
      router.push(href)
      onOpenChange(false)
    },
    [router, onOpenChange]
  )

  const groupStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#6b6b80',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '8px 8px 4px',
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 8,
    fontSize: 13,
    color: '#f0f0f8',
    cursor: 'pointer',
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command Menu"
      loop
      data-testid="command-palette"
      contentClassName="command-palette-content"
      overlayClassName="command-palette-overlay"
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Command.Input
          placeholder="Search or run command…"
          data-testid="command-input"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: '#f0f0f8',
            width: '100%',
          }}
        />
      </div>
      <Command.List style={{ padding: '8px', maxHeight: '360px', overflowY: 'auto' }}>
        <Command.Empty style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: '#6b6b80' }}>
          No results.
        </Command.Empty>
        <Command.Group heading="Navigate" style={groupStyle}>
          {NAVIGATE.map(({ label, href, icon: Icon }) => (
            <Command.Item key={href} value={label} onSelect={() => go(href)} style={itemStyle}>
              <Icon size={14} color="#6b6b80" />
              {label}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Separator style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
        <Command.Group heading="Settings" style={groupStyle}>
          <Command.Item
            value="Toggle theme"
            onSelect={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark')
              onOpenChange(false)
            }}
            style={itemStyle}
          >
            {theme === 'dark' ? <Sun size={14} color="#6b6b80" /> : <Moon size={14} color="#6b6b80" />}
            Toggle {theme === 'dark' ? 'light' : 'dark'} mode
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
