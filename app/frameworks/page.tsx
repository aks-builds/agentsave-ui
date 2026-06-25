'use client'

const FRAMEWORKS = [
  { name: 'LangChain',  slug: 'langchain',  color: '#6366f1', icon: '⚡', runs: 10, saved: 30000 },
  { name: 'AutoGen',    slug: 'autogen',    color: '#f59e0b', icon: '🤖', runs: 5,  saved: 12000 },
  { name: 'CrewAI',     slug: 'crewai',     color: '#10b981', icon: '🚢', runs: 4,  saved: 14400 },
  { name: 'Smolagents', slug: 'smolagents', color: '#8b5cf6', icon: '🧠', runs: 4,  saved: 7200  },
  { name: 'LangGraph',  slug: 'langgraph',  color: '#f43f5e', icon: '🔗', runs: 3,  saved: 8100  },
  { name: 'Raw',        slug: 'raw',        color: '#6b7280', icon: '⚙',  runs: 4,  saved: 6000  },
]

export default function FrameworksPage() {
  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Frameworks</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Token savings broken down by agent framework.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} data-testid="frameworks-grid">
        {FRAMEWORKS.map((fw) => (
          <div
            key={fw.slug}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'border-color 150ms', cursor: 'default' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            data-testid={`framework-${fw.slug}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${fw.color}20`, border: `1px solid ${fw.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {fw.icon}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)' }}>{fw.name}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{fw.runs} runs</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Tokens Saved</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: fw.color, margin: 0 }}>{fw.saved.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
