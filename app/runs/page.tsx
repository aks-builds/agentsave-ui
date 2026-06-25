import RunsTable, { RunRow } from '../components/runs/RunsTable'
import { fetchRuns } from '../lib/api'

export default async function RunsPage() {
  const data = await fetchRuns(1, 50)
  const runs: RunRow[] = (data?.runs ?? []).map((r) => ({
    id: r.run_id,
    run_id: r.run_id,
    framework: r.framework,
    model_name: r.model_name,
    tokens_before: r.tokens_before,
    tokens_after: r.tokens_after,
    task_success: r.task_success,
    timestamp: r.timestamp,
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
