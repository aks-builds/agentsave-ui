'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart2,
  Bot,
  Zap,
  Brain,
  Key,
  CreditCard,
  Settings,
} from 'lucide-react'
import type { SidebarMode } from './AppShell'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/',           label: 'Dashboard',  icon: LayoutDashboard },
      { href: '/analytics',  label: 'Analytics',  icon: BarChart2       },
    ],
  },
  {
    label: 'AGENTS',
    items: [
      { href: '/runs',       label: 'Agent Runs', icon: Bot    },
      { href: '/frameworks', label: 'Frameworks', icon: Zap    },
      { href: '/cost',       label: 'Cost',       icon: Brain  },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { href: '/settings/keys', label: 'API Keys', icon: Key         },
      { href: '/billing',       label: 'Billing',  icon: CreditCard  },
      { href: '/settings',      label: 'Settings', icon: Settings    },
    ],
  },
]

export default function Sidebar({ mode = 'full' }: { mode?: SidebarMode }) {
  const pathname = usePathname()
  const iconsOnly = mode === 'icons'
  const width = iconsOnly ? '60px' : '240px'

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      data-testid="sidebar"
      data-mode={mode}
      style={{
        width,
        minWidth: width,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(5,5,15,0.95)',
        borderRight: '1px solid var(--border)',
        padding: iconsOnly ? '20px 8px' : '20px 12px',
        gap: '8px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: iconsOnly ? '4px 0 20px' : '4px 12px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: iconsOnly ? 'center' : 'flex-start',
            gap: '8px',
          }}
        >
          <Zap size={20} color="#6366f1" />
          {!iconsOnly && (
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AgentSave
            </span>
          )}
        </div>
        {!iconsOnly && (
          <span
            className="font-mono"
            style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', display: 'block', paddingLeft: '28px' }}
          >
            v0.1.0
          </span>
        )}
      </div>

      {/* Sections */}
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} style={{ marginBottom: '8px' }}>
          {!iconsOnly && (
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0 12px',
                marginBottom: '4px',
              }}
            >
              {section.label}
            </p>
          )}

          {section.items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={iconsOnly ? item.label : undefined}
                aria-label={iconsOnly ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: iconsOnly ? 'center' : 'flex-start',
                  gap: '10px',
                  padding: iconsOnly ? '10px 0' : '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#a78bfa' : 'var(--muted)',
                  background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.20)' : '1px solid transparent',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 150ms ease',
                  marginBottom: '2px',
                }}
              >
                {/* Left accent bar */}
                {isActive && !iconsOnly && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      height: '60%',
                      width: '3px',
                      background: '#6366f1',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <item.icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                {!iconsOnly && item.label}
              </Link>
            )
          })}

          {!iconsOnly && (
            <div
              style={{
                height: '1px',
                background: 'var(--border)',
                margin: '8px 12px 0',
              }}
            />
          )}
        </div>
      ))}

      {/* Footer */}
      {!iconsOnly && (
        <div style={{ marginTop: 'auto', padding: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              background: 'var(--surface)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 0 0 2px rgba(99,102,241,0.40)',
              }}
            >
              A
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
                Aditya
              </p>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>Free tier</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
