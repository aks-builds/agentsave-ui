import { fetchMetrics } from '../lib/api'

const FRAMEWORK_ICONS: Record<string, string> = {
  langchain: '⚡',
  langgraph: '🔗',
  autogen: '🤖',
  crewai: '🚢',
  smolagents: '🧠',
  raw: '⚙',
}

const FRAMEWORK_COLORS: Record<string, string> = {
  langchain: '#6366f1',
  langgraph: '#f43f5e',
  autogen: '#f59e0b',
  crewai: '#10b981',
  smolagents: '#8b5cf6',
  raw: '#6b7280',
}

export default async function AgentsPage() {
  const metrics = await fetchMetrics()
  const byFramework = metrics?.by_framework ?? {}

  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Agent Frameworks</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Token savings broken down by framework.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {Object.keys(FRAMEWORK_ICONS).map((fw) => {
          const stats = byFramework[fw]
          const color = FRAMEWORK_COLORS[fw] ?? '#6b7280'
          return (
            <div
              key={fw}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {FRAMEWORK_ICONS[fw]}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)', textTransform: 'capitalize' }}>{fw}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                    {stats ? `${stats.runs} run${stats.runs !== 1 ? 's' : ''}` : 'No runs yet'}
                  </p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Tokens Saved</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: stats ? color : 'var(--muted)', margin: 0 }}>
                  {stats ? stats.tokens_saved.toLocaleString() : '—'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>How it works</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
          AgentSave wraps your agent with a three-layer supervisor: a TF-IDF context filter drops low-relevance tool outputs,
          an early-exit detector stops when returns diminish, and a budget gate enforces a token ceiling.
          Savings are measured and reported per framework across all your runs.
        </p>
      </div>
    </main>
  )
}
