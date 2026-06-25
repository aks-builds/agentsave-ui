import CostProjector from '../components/cost/CostProjector'
import ActivityHeatmap from '../components/cost/ActivityHeatmap'

export default function CostPage() {
  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Cost</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Project your savings and see activity patterns.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Monthly Savings Projector</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Drag to estimate your savings at scale</p>
          <CostProjector />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Live Activity</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Real-time agent run feed</p>
          {/* ActivityFeed imported as client component */}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Run Activity Heatmap</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Last 4 weeks by day</p>
        <ActivityHeatmap />
      </div>
    </main>
  )
}
