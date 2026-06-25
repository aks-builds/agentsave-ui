import { Zap, DollarSign, CheckCircle, Activity } from 'lucide-react'
import StatCard from './components/dashboard/StatCard'
import TokensAreaChart, { DataPoint } from './components/charts/TokensAreaChart'
import FrameworkDonut, { FRAMEWORK_COLORS } from './components/charts/FrameworkDonut'
import RunsTable, { RunRow } from './components/runs/RunsTable'
import ActivityFeed from './components/dashboard/ActivityFeed'
import { fetchMetrics, fetchRuns, RunRow as ApiRunRow } from './lib/api'

type DonutSlice = { name: string; value: number; color: string }

function buildChartData(runs: ApiRunRow[]): DataPoint[] {
  const byDate: Record<string, { saved: number; baseline: number }> = {}
  for (const r of runs) {
    const date = r.timestamp.slice(0, 10)
    if (!byDate[date]) byDate[date] = { saved: 0, baseline: 0 }
    byDate[date].saved += r.tokens_before - r.tokens_after
    byDate[date].baseline += r.tokens_before
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date: date.slice(5),
      saved: vals.saved,
      baseline: vals.baseline,
    }))
}

function buildDonutData(runs: ApiRunRow[]): DonutSlice[] {
  const byFw: Record<string, number> = {}
  for (const r of runs) {
    byFw[r.framework] = (byFw[r.framework] ?? 0) + (r.tokens_before - r.tokens_after)
  }
  return Object.entries(byFw)
    .map(([framework, value]) => ({
      name: framework,
      value,
      color: FRAMEWORK_COLORS[framework] ?? FRAMEWORK_COLORS.raw,
    }))
    .sort((a, b) => b.value - a.value)
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const SPARK_DUMMY = [10, 20, 30, 25, 40, 50, 60, 55, 70, 77]

export default async function DashboardPage() {
  const [metrics, runsData] = await Promise.all([fetchMetrics(), fetchRuns(1, 10)])
  const runs = runsData?.runs ?? []

  const chartData = buildChartData(runs)
  const donutData = buildDonutData(runs)
  const totalDonutSaved = donutData.reduce((s, d) => s + d.value, 0)
  const runRows: RunRow[] = runs.slice(0, 3).map((r) => ({
    id: r.run_id,
    run_id: r.run_id,
    framework: r.framework,
    model_name: r.model_name,
    tokens_before: r.tokens_before,
    tokens_after: r.tokens_after,
    task_success: r.task_success,
    timestamp: r.timestamp,
  }))

  const tokensSaved = metrics?.total_tokens_saved ?? 0
  const costSaved = metrics?.total_cost_saved_usd ?? 0
  const successRate = metrics ? Math.round(metrics.success_rate) : 0
  const totalRuns = metrics?.total_runs ?? 0

  return (
    <div data-testid="dashboard-page">
      {/* Greeting header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2
            style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}
            data-testid="dashboard-greeting"
          >
            {getGreeting()}, Aditya 👋
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
            Here&apos;s how your agents performed over the last 30 days.
          </p>
        </div>

        {/* Live badge */}
        <span
          data-testid="live-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#34d399',
            whiteSpace: 'nowrap',
          }}
        >
          🟢 {totalRuns} runs · live
        </span>
      </div>

      {/* Stat cards — 4 column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Tokens Saved"
          value={tokensSaved}
          subtitle="last 30 days"
          accent="linear-gradient(90deg, #6366f1, #8b5cf6)"
          accentGlow="rgba(99,102,241,0.15)"
          icon={<Zap size={14} color="#6366f1" />}
          change="↑ 23% vs last 30d"
          changeType="positive"
          sparkData={SPARK_DUMMY}
          testId="stat-tokens-saved"
        />
        <StatCard
          title="Cost Saved"
          value={Math.round(costSaved * 10000)}
          subtitle={`$${costSaved.toFixed(4)} USD (×10⁻⁴)`}
          accent="linear-gradient(135deg, #10b981, #34d399)"
          accentGlow="rgba(16,185,129,0.12)"
          icon={<DollarSign size={14} color="#10b981" />}
          change={costSaved > 0 ? '↑ 18% vs last 30d' : '—'}
          changeType="positive"
          sparkData={SPARK_DUMMY}
          testId="stat-cost-saved"
        />
        <StatCard
          title="Success Rate"
          value={successRate}
          subtitle="of agent runs"
          accent="linear-gradient(135deg, #f59e0b, #fbbf24)"
          accentGlow="rgba(245,158,11,0.12)"
          icon={<CheckCircle size={14} color="#f59e0b" />}
          change="—"
          changeType="neutral"
          sparkData={SPARK_DUMMY}
          testId="stat-success-rate"
        />
        <StatCard
          title="Total Runs"
          value={totalRuns}
          subtitle="agent executions"
          accent="linear-gradient(135deg, #f43f5e, #fb7185)"
          accentGlow="rgba(244,63,94,0.12)"
          icon={<Activity size={14} color="#f43f5e" />}
          change="—"
          changeType="neutral"
          sparkData={SPARK_DUMMY}
          testId="stat-total-runs"
        />
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Tokens area chart */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
          }}
          data-testid="chart-tokens"
        >
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 16px' }}>
            Token Savings Over Time
          </h3>
          {chartData.length > 0 ? (
            <TokensAreaChart data={chartData} />
          ) : (
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No data yet</p>
            </div>
          )}
        </div>

        {/* Framework donut */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
          }}
          data-testid="chart-donut"
        >
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 16px' }}>
            By Framework
          </h3>
          {donutData.length > 0 ? (
            <FrameworkDonut data={donutData} total={totalDonutSaved} />
          ) : (
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: recent runs + live feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '16px',
        }}
      >
        {/* Recent runs preview */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 16px' }}>
            Recent Runs
          </h3>
          <RunsTable runs={runRows} />
        </div>

        {/* Live activity feed */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
