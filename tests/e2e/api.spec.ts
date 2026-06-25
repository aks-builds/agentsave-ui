/**
 * Layer 1: API-only tests — no browser, test SP1 backend directly via HTTP.
 * Requires backend running: AGENTSAVE_TEST_MODE=1 uvicorn agentsave_dashboard.main:app
 * and TEST_API_KEY env var set to a valid ask-xxx key.
 */
import { test, expect } from "@playwright/test"
import { API_URL, API_KEY, resetDB, seedRun, seedRuns } from "./helpers"

function auth() {
  return { Authorization: `Bearer ${API_KEY}` }
}

test.skip(!API_KEY, "TEST_API_KEY not set — skipping Layer 1 API tests")

test.describe("Layer 1: API health", () => {
  test("GET /api/health returns ok", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.status).toBe("ok")
    expect(typeof body.version).toBe("string")
  })

  test("POST /api/events without auth returns 401", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/events`, {
      data: { run_id: "x", framework: "langchain", model_name: "gpt-4o",
               tokens_before: 100, tokens_after: 70, iterations_total: 1,
               iterations_saved: 0, task_success: true,
               timestamp: new Date().toISOString() },
    })
    expect(res.status()).toBe(401)
  })

  test("GET /api/runs without auth returns 401", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/runs`)
    expect(res.status()).toBe(401)
  })

  test("GET /api/metrics without auth returns 401", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/metrics`)
    expect(res.status()).toBe(401)
  })

  test("GET /api/billing without auth returns 401", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/billing`)
    expect(res.status()).toBe(401)
  })
})

test.describe("Layer 1: Events ingestion", () => {
  test.beforeEach(async ({ request }) => {
    await resetDB(request)
  })

  test("POST /api/events accepts valid run", async ({ request }) => {
    const run = await seedRun(request)
    expect(run.run_id).toMatch(/^test-/)
  })

  test("GET /api/runs returns seeded runs", async ({ request }) => {
    await seedRuns(request, 3)
    const res = await request.get(`${API_URL}/api/runs`, { headers: auth() })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.total).toBeGreaterThanOrEqual(3)
    expect(body.runs.length).toBeGreaterThanOrEqual(3)
  })

  test("Run response has correct fields", async ({ request }) => {
    await seedRun(request, { tokens_before: 1000, tokens_after: 700 })
    const res = await request.get(`${API_URL}/api/runs`, { headers: auth() })
    const body = await res.json()
    const run = body.runs[0]
    expect(run).toHaveProperty("run_id")
    expect(run).toHaveProperty("framework")
    expect(run).toHaveProperty("tokens_before")
    expect(run).toHaveProperty("tokens_after")
    expect(run).toHaveProperty("reduction_pct")
    expect(run).toHaveProperty("task_success")
    expect(run).toHaveProperty("timestamp")
  })

  test("reduction_pct is computed correctly", async ({ request }) => {
    await seedRun(request, { tokens_before: 1000, tokens_after: 700 })
    const res = await request.get(`${API_URL}/api/runs`, { headers: auth() })
    const body = await res.json()
    const run = body.runs.find((r: Record<string, unknown>) => r.tokens_before === 1000)
    expect(run.reduction_pct).toBeCloseTo(30.0, 1)
  })

  test("pagination: per_page limits results", async ({ request }) => {
    await seedRuns(request, 10)
    const res = await request.get(`${API_URL}/api/runs?per_page=3`, { headers: auth() })
    const body = await res.json()
    expect(body.runs.length).toBe(3)
    expect(body.total).toBeGreaterThanOrEqual(10)
  })

  test("duplicate run_id is ignored (idempotent)", async ({ request }) => {
    const run = await seedRun(request, { run_id: "fixed-id-123" })
    await seedRun(request, { run_id: "fixed-id-123" })
    const res = await request.get(`${API_URL}/api/runs`, { headers: auth() })
    const body = await res.json()
    const matches = body.runs.filter((r: Record<string, unknown>) => r.run_id === "fixed-id-123")
    expect(matches.length).toBe(1)
  })
})

test.describe("Layer 1: Metrics endpoint", () => {
  test.beforeEach(async ({ request }) => {
    await resetDB(request)
  })

  test("GET /api/metrics returns correct aggregates", async ({ request }) => {
    await seedRuns(request, 5)
    const res = await request.get(`${API_URL}/api/metrics`, { headers: auth() })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.total_runs).toBeGreaterThanOrEqual(5)
    expect(body.total_tokens_saved).toBeGreaterThan(0)
    expect(body.reduction_pct).toBeGreaterThan(0)
    expect(typeof body.by_framework).toBe("object")
  })

  test("GET /api/metrics after no runs returns zeros", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/metrics`, { headers: auth() })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.total_runs).toBe(0)
    expect(body.total_tokens_saved).toBe(0)
  })

  test("GET /api/tokens returns buckets array", async ({ request }) => {
    await seedRuns(request, 3)
    const res = await request.get(`${API_URL}/api/tokens?window=30d`, { headers: auth() })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(Array.isArray(body.buckets)).toBeTruthy()
  })
})

test.describe("Layer 1: Billing endpoint", () => {
  test.beforeEach(async ({ request }) => {
    await resetDB(request)
  })

  test("GET /api/billing returns free tier by default", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/billing`, { headers: auth() })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.tier).toBe("free")
    expect(body.features.history_days).toBe(7)
    expect(body.features.webhook_alerts).toBe(false)
    expect(body.expired).toBe(false)
  })
})
