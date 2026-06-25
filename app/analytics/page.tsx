import TokensAreaChart, { DataPoint } from '../components/charts/TokensAreaChart'
import { fetchTokenBuckets } from '../lib/api'

async function getChartData(): Promise<DataPoint[]> {
  const data = await fetchTokenBuckets('30d')
  if (data && data.buckets.length > 0) {
    return data.buckets.map((b) => ({
      date: b.date.slice(5), // MM-DD
      saved: b.tokens_before - b.tokens_after,
      baseline: b.tokens_before,
    }))
  }
  // No data yet — empty chart, not fake numbers
  return []
}

export default async function AnalyticsPage() {
  const chartData = await getChartData()
  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Analytics</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Token reduction trends over the last 30 days.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 16 }} data-testid="analytics-chart">
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Token Reduction Over Time</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>Daily tokens saved vs baseline — from your agentsave runs</p>
        </div>
        {chartData.length > 0 ? (
          <TokensAreaChart data={chartData} />
        ) : (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>No run data yet. Start using <code>supervise(agent)</code> to populate this chart.</p>
          </div>
        )}
      </div>
    </main>
  )
}
