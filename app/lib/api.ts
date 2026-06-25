const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface MetricsData {
  project_id: string;
  period: string;
  tokens_saved: number;
  cost_saved_usd: number;
  success_rate: number;
  event_count: number;
}

export interface ApiToken {
  id: string;
  name: string;
  project_id: string | null;
  created_at: string;
  last_used_at: string | null;
}

export async function fetchMetrics(projectId: string, period = "30d", token: string): Promise<MetricsData> {
  const res = await fetch(`${API_BASE}/api/metrics?project_id=${projectId}&period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Metrics fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTokens(userId: string, authToken: string): Promise<ApiToken[]> {
  const res = await fetch(`${API_BASE}/api/tokens?user_id=${userId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Tokens fetch failed: ${res.status}`);
  return res.json();
}

export async function createToken(name: string, projectId: string, authToken: string): Promise<{ token: string; id: string }> {
  const res = await fetch(`${API_BASE}/api/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ name, project_id: projectId }),
  });
  if (!res.ok) throw new Error(`Token creation failed: ${res.status}`);
  return res.json();
}
