import RunsTable, { RunRow } from '../components/runs/RunsTable'

interface EventRow {
  id: string
  run_id: string
  framework: string
  model_name: string
  tokens_before: number
  tokens_after: number
  task_success: number | boolean
  timestamp: string
}

async function getRecentEvents(): Promise<EventRow[]> {
  const apiUrl = process.env.DASHBOARD_API_URL ?? 'http://localhost:8000'
  const projectId = process.env.DEMO_PROJECT_ID ?? ''
  const jwt = process.env.DEMO_JWT ?? ''
  if (!projectId || !jwt) return []
  try {
    const res = await fetch(`${apiUrl}/api/events/recent?project_id=${projectId}&limit=30`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function RunsPage() {
  const events = await getRecentEvents()
  const runs: RunRow[] = events.map((e) => ({
    id: e.id,
    run_id: e.run_id,
    framework: e.framework,
    model_name: e.model_name,
    tokens_before: e.tokens_before,
    tokens_after: e.tokens_after,
    task_success: !!e.task_success,
    timestamp: e.timestamp,
  }))

  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Agent Runs</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>All {runs.length} runs in the last 30 days.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }} data-testid="runs-page">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>All Runs</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Sorted by most recent</p>
          </div>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <RunsTable runs={runs} showPagination />
        </div>
      </div>
    </main>
  )
}
