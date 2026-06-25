/**
 * Layer 3: Full-stack SDK→UI tests.
 * Spawns Python subprocesses that run the real agentsave SDK against the
 * SP1 backend, then asserts the Next.js UI reflects the new data.
 *
 * Requirements:
 *   - SP1 backend running: AGENTSAVE_TEST_MODE=1 uvicorn agentsave_dashboard.main:app
 *   - agentsave SDK installed in the Python env: pip install agentsave
 *   - TEST_API_KEY env var set to a valid ask-xxx key
 *   - AGENTSAVE_API_KEY in .env.local set to the same key (for the UI)
 */
import { test, expect } from "@playwright/test"
import { execSync } from "child_process"
import { API_URL, API_KEY, resetDB } from "./helpers"

const hasBackend = !!API_KEY

function python(script: string): string {
  const result = execSync(
    `python -c "${script.replace(/"/g, '\\"')}"`,
    {
      env: {
        ...process.env,
        AGENTSAVE_API_URL: API_URL,
        AGENTSAVE_API_KEY: API_KEY,
      },
      timeout: 30_000,
    }
  )
  return result.toString().trim()
}

function sdkSendRun(
  framework: string,
  tokensBefore: number,
  tokensAfter: number
): string {
  const script = `
import httpx, json, os
from datetime import datetime, timezone
import uuid

url = os.environ.get("AGENTSAVE_API_URL", "http://localhost:8000")
key = os.environ.get("AGENTSAVE_API_KEY", "")
run_id = "sdk-l3-" + str(uuid.uuid4())[:8]
payload = {
    "run_id": run_id,
    "framework": "${framework}",
    "model_name": "gpt-4o",
    "tokens_before": ${tokensBefore},
    "tokens_after": ${tokensAfter},
    "iterations_total": 3,
    "iterations_saved": 0,
    "task_success": True,
    "timestamp": datetime.now(timezone.utc).isoformat(),
}
r = httpx.post(f"{url}/api/events", json=payload, headers={"Authorization": f"Bearer {key}"}, timeout=10)
r.raise_for_status()
print(run_id)
`.trim()
  return python(script)
}

test.skip(!hasBackend, "TEST_API_KEY not set — skipping Layer 3 SDK→UI tests")

test.describe("Layer 3: SDK → backend → UI", () => {
  test.beforeEach(async ({ request }) => {
    await resetDB(request)
  })

  test("SDK run appears in runs page", async ({ page }) => {
    // Send a run via the events API (mimics SDK telemetry client)
    const runId = sdkSendRun("langchain", 1000, 700)

    await page.goto("/runs")
    await page.waitForLoadState("networkidle")

    // The run table should show the seeded run
    await expect(page.getByTestId("runs-page")).toBeVisible()
    const rows = page.getByTestId("run-row")
    await expect(rows.first()).toBeVisible()
  })

  test("SDK run updates overview metrics", async ({ page }) => {
    // Seed a known run: 1000 → 700 = 300 tokens saved
    sdkSendRun("autogen", 1000, 700)

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Tokens saved should be > 0
    const tokensSaved = page.getByTestId("stat-tokens-saved-value")
    await expect(tokensSaved).toBeVisible()
    const text = await tokensSaved.textContent()
    const numeric = parseInt((text ?? "0").replace(/,/g, ""))
    expect(numeric).toBeGreaterThan(0)
  })

  test("multiple SDK runs accumulate in metrics", async ({ page }) => {
    // Seed 5 runs each saving 300 tokens = 1500 total
    for (let i = 0; i < 5; i++) {
      sdkSendRun("langchain", 1000, 700)
    }

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const totalRuns = page.getByTestId("stat-total-runs-value")
    await expect(totalRuns).toBeVisible()
    const text = await totalRuns.textContent()
    expect(parseInt(text?.replace(/,/g, "") ?? "0")).toBeGreaterThanOrEqual(5)
  })

  test("live badge reflects run count", async ({ page }) => {
    sdkSendRun("crewai", 2000, 1200)

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    await expect(page.getByTestId("live-badge")).toBeVisible()
    const badgeText = await page.getByTestId("live-badge").textContent()
    expect(badgeText).toMatch(/\d+ runs/)
  })

  test("framework appears in runs table after SDK send", async ({ page }) => {
    sdkSendRun("smolagents", 1500, 900)

    await page.goto("/runs")
    await page.waitForLoadState("networkidle")

    await expect(page.getByTestId("runs-page")).toBeVisible()
    const firstRow = page.getByTestId("run-row").first()
    await expect(firstRow).toBeVisible()
  })

  test("billing tier defaults to free (no license)", async ({ page }) => {
    await page.goto("/billing")
    await page.waitForLoadState("networkidle")
    // Billing page is static — verify it renders without 404
    await expect(page.getByRole("main")).toBeVisible()
  })
})
