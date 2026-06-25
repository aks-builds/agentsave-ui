# AgentSave UI — Playwright E2E Report

Date: 2026-06-23
Status: **DONE — 23 passed, 0 failed**

## 1. Seed script output

Ran `python scripts/seed_demo.py` (from the dashboard dir so the package imports resolve):

```
OK Seeded 30 events into C:\Users\AdityaKumarSingh\agentsave-dashboard\demo.db
  Frameworks: langchain(10) autogen(5) crewai(4) smolagents(4) langgraph(3) raw(4)
  Tokens saved: 77,700
  Cost saved: $0.2331
  Success rate: 90.0%
  Project ID: be51030b-722a-4261-8b23-690d0d5b5430
OK Written .env.local to C:\Users\AdityaKumarSingh\agentsave-ui\.env.local
```

Matches expected totals exactly: 30 events, 77,700 tokens saved, $0.2331, 90% (27/30).

Note: the Unicode check/bullet glyphs in the spec's `print()` lines were replaced with
ASCII (`OK`) to avoid a Windows cp1252 `UnicodeEncodeError` in the console.

## 2. Servers

- **Backend (FastAPI / uvicorn, port 8000):** was already running against the default
  `agentsave.db`, which returned HTTP 500 for the demo project. Stopped that process and
  restarted pointing at the seeded DB:
  `DATABASE_URL=demo.db python -m uvicorn agentsave_dashboard.main:app --host 127.0.0.1 --port 8000`
  Verified `/docs` → 200 and `/api/metrics?project_id=...&period=30d` with the seeded JWT returns:
  `{"tokens_saved":77700,"cost_saved_usd":0.2331,"success_rate":0.9,"event_count":30}`
- **Next.js (port 3000):** the existing dev server was started before `.env.local` existed,
  so it had not loaded `DEMO_PROJECT_ID` / `DEMO_JWT`. Killed the dev-server process tree and
  let Playwright's `webServer` config relaunch `npm run dev` fresh (picks up `.env.local`).

## 3. Overview page

`app/page.tsx` was replaced with an async Server Component that fetches `/api/metrics` server-side
using `DASHBOARD_API_URL` / `DEMO_PROJECT_ID` / `DEMO_JWT` (`cache: "no-store"`).
Confirmed against Next.js 16.2.9 bundled docs (`node_modules/next/dist/docs/`): async Server
Component + `fetch` + `process.env` + `.env.local` is the current, correct pattern.
fetch is uncached by default in this version, so `cache: "no-store"` is explicit-but-harmless.

Values Playwright read live from the rendered UI:

| Stat          | Value    |
|---------------|----------|
| Tokens Saved  | 77,700   |
| Cost Saved    | $0.2331  |
| Success Rate  | 90%      |
| Total Runs    | 30       |

## 4. Test results — 23 passed / 0 failed

```
tests/e2e/overview.spec.ts     8 passed
tests/e2e/navigation.spec.ts   4 passed
tests/e2e/agents.spec.ts       2 passed
tests/e2e/settings.spec.ts     3 passed
tests/e2e/billing.spec.ts      6 passed
-----------------------------------------
TOTAL                         23 passed
```

## 5. Test-spec fixes applied

The first full run was 18 passed / 5 failed. All 5 failures were Playwright **strict-mode
locator** problems in the provided specs (locators matching multiple real DOM elements) — not
app bugs. Fixes:

1. `billing.spec.ts` — `getByText('$29')` also matched `$299`. → `{ exact: true }`.
2. `billing.spec.ts` — `getByText(/InferRoute/)` matched both the "Includes InferRoute" badge
   and the feature `<li>`. → `.first()`.
3. `settings.spec.ts` — `getByText('agentsave login')` matched both the login-hint line and the
   quick-ref line. → `{ exact: true }`.
4. `navigation.spec.ts` (clicking nav links) — `page.click('text=Agents')` did not navigate
   reliably. → scoped role locators: `nav.getByRole('link', { name: 'Agents' }).click()`.
5. `navigation.spec.ts` (no 404) — the layout renders the nav brand as a second `<h1>`, so
   `getByRole('heading', { level: 1 })` was ambiguous. → scoped to `getByRole('main')`.

## 6. Failures / screenshots

No failures in the final run. Stale failure artifacts from the first run were removed
(`test-results/` deleted). Playwright is configured with `screenshot: 'only-on-failure'` and
`trace: 'on-first-retry'`, so artifacts will appear under `test-results/` only on future failures.
