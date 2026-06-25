const API_BASE = process.env.AGENTSAVE_API_URL ?? "http://localhost:8000"

export interface MetricsData {
  total_tokens_saved: number
  total_tokens_before: number
  reduction_pct: number
  total_cost_saved_usd: number
  success_rate: number   // 0–100
  total_runs: number
  by_framework: Record<string, { runs: number; tokens_saved: number }>
}

export interface RunRow {
  run_id: string
  framework: string
  model_name: string
  tokens_before: number
  tokens_after: number
  reduction_pct: number
  task_success: boolean
  timestamp: string
}

export interface RunsResponse {
  runs: RunRow[]
  total: number
  page: number
  per_page: number
}

export interface BillingData {
  tier: string
  org: string
  seats_allowed: number
  seats_used: number
  expires_at: string | null
  expired: boolean
  features: Record<string, unknown>
}

function getApiKey(): string {
  return process.env.AGENTSAVE_API_KEY ?? ""
}

function authHeader() {
  return { Authorization: `Bearer ${getApiKey()}` }
}

export async function fetchMetrics(): Promise<MetricsData | null> {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(`${API_BASE}/api/metrics`, {
      headers: authHeader(),
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchRuns(page = 1, perPage = 50): Promise<RunsResponse | null> {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(
      `${API_BASE}/api/runs?page=${page}&per_page=${perPage}`,
      { headers: authHeader(), cache: "no-store" }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchBilling(): Promise<BillingData | null> {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(`${API_BASE}/api/billing`, {
      headers: authHeader(),
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchTokenBuckets(
  window = "30d"
): Promise<{ buckets: { date: string; tokens_before: number; tokens_after: number }[] } | null> {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(`${API_BASE}/api/tokens?window=${window}`, {
      headers: authHeader(),
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
