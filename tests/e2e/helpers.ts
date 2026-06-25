import { APIRequestContext } from "@playwright/test"

export const API_URL = process.env.TEST_API_URL ?? "http://localhost:8000"
export const API_KEY = process.env.TEST_API_KEY ?? ""

function authHeaders() {
  return { Authorization: `Bearer ${API_KEY}` }
}

export async function resetDB(request: APIRequestContext) {
  await request.delete(`${API_URL}/api/test/reset`)
}

export async function seedRun(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {}
) {
  const run = {
    run_id: `test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    framework: "langchain",
    model_name: "gpt-4o",
    tokens_before: 1000,
    tokens_after: 700,
    iterations_total: 3,
    iterations_saved: 0,
    task_success: true,
    timestamp: new Date().toISOString(),
    ...overrides,
  }
  const res = await request.post(`${API_URL}/api/events`, {
    data: run,
    headers: authHeaders(),
  })
  if (!res.ok()) throw new Error(`Seed failed: ${res.status()} — ${await res.text()}`)
  return run
}

export async function seedRuns(request: APIRequestContext, n = 5) {
  const frameworks = ["langchain", "autogen", "crewai", "smolagents", "langgraph"]
  const runs = []
  for (let i = 0; i < n; i++) {
    runs.push(
      await seedRun(request, {
        framework: frameworks[i % frameworks.length],
        tokens_before: 1000 + i * 100,
        tokens_after: 700 + i * 60,
      })
    )
  }
  return runs
}
