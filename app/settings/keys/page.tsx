'use client'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ApiKeysPage() {
  const [name, setName] = useState('')
  const [createdToken, setCreatedToken] = useState<string | null>(null)

  const createToken = async () => {
    if (!name.trim()) return
    toast.success("Token created — copy it now, it won't be shown again")
    setCreatedToken('aks_demo_' + Math.random().toString(36).slice(2, 18))
    setName('')
  }

  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>API Keys</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Create tokens to authenticate the AgentSave SDK.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 16 }} data-testid="api-keys-section">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Create New Token</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Token name (e.g. production)"
            data-testid="token-name-input"
            style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text)', outline: 'none' }}
          />
          <button
            onClick={createToken}
            data-testid="create-token-btn"
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            + Create
          </button>
        </div>
        {createdToken && (
          <div
            data-testid="created-token-display"
            style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}
          >
            <p style={{ fontSize: 11, color: '#34d399', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your new token — copy now, not shown again</p>
            <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#34d399', wordBreak: 'break-all' }}>{createdToken}</code>
          </div>
        )}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>SDK Quick Reference</h2>
        {[
          { label: 'Install', cmd: 'pip install agentsave', color: '#34d399' },
          { label: 'Login', cmd: 'agentsave login', color: '#a78bfa' },
          { label: 'Status', cmd: 'agentsave status', color: '#fbbf24' },
        ].map(({ label, cmd, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color }} data-testid={`sdk-cmd-${label.toLowerCase()}`}>
            {cmd}
          </div>
        ))}
      </div>
    </main>
  )
}
