> **Part of the AgentSave ecosystem.**
> This is the dashboard UI for [aks-builds/agentsave](https://github.com/aks-builds/agentsave) — the Python SDK that cuts AI agent token costs ~23%.
> It requires the [agentsave-dashboard](https://github.com/aks-builds/agentsave-dashboard) backend to be running before data will appear.

# agentsave-ui — Real-Time Cost Dashboard

[![CI](https://github.com/aks-builds/agentsave-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/aks-builds/agentsave-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 20](https://img.shields.io/badge/node-20-brightgreen.svg)](https://nodejs.org/)

> A Next.js dashboard that visualises token savings, run history, cost projections, and billing for agents instrumented with the AgentSave SDK.

---

## What it shows

Eight pages, each fetching fresh server-side data from the AgentSave backend on every request:

| Route | Page | What you see |
|---|---|---|
| `/` | Dashboard | Four stat cards (tokens saved, cost saved, success rate, total runs), a tokens area chart, framework donut chart, and an activity feed |
| `/analytics` | Analytics | Deeper breakdowns of token reduction trends over selectable time windows (7d / 30d / 90d) |
| `/runs` | Agent Runs | Paginated table of every agent run with framework badge, token counts, reduction %, and task success |
| `/frameworks` | Frameworks | Cards for each supported framework: LangChain, AutoGen, CrewAI, SmoLAgents, LangGraph, and raw HTTP |
| `/cost` | Cost | Interactive cost projector and an activity heatmap |
| `/billing` | Billing | Free / Pro / Enterprise tier comparison; Pro at $29/mo, Enterprise at $299/mo with InferRoute integration |
| `/settings` | Settings | User preferences |
| `/settings/keys` | API Keys | Manage `ask-xxx` API keys |

### Key components

- **StatCard** — headline metric with label and formatted value
- **TokensAreaChart** — stacked area chart (tokens before vs. after) over time via Recharts
- **FrameworkDonut** — donut chart of runs by framework
- **RunsTable** — paginated sortable table with `run-row` test IDs per row
- **ActivityFeed** — live stream of recent run events
- **ActivityHeatmap** — GitHub-style heatmap of daily run activity
- **CostProjector** — interactive slider estimating monthly cost savings
- **CommandPalette** — `Cmd+K` / `Ctrl+K` global search and navigation (powered by cmdk)
- **AppShell** — shared sidebar navigation and top bar

---

## Quick Start

**Prerequisites:** Node.js 20+, and the [agentsave-dashboard](https://github.com/aks-builds/agentsave-dashboard) backend running on port 8000.

```bash
# 1. Clone the repo
git clone https://github.com/aks-builds/agentsave-ui.git
cd agentsave-ui

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local — see Configuration section below

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If `AGENTSAVE_API_KEY` is not set the UI renders with empty state — no errors, just zeroes.

### Seed demo data (optional)

Populate the backend with 30 realistic runs spanning the past 30 days:

```bash
python scripts/seed_sp1.py --key ask-your-key-here
# or via env var:
AGENTSAVE_API_KEY=ask-your-key-here python scripts/seed_sp1.py
```

Options: `--count N` (default 30), `--url http://host:port` (default `http://localhost:8000`).

---

## Configuration

All configuration is done through environment variables. Create a `.env.local` file at the project root:

```bash
# URL of the agentsave-dashboard backend (no trailing slash)
# Default: http://localhost:8000
AGENTSAVE_API_URL=http://localhost:8000

# Bearer token for API authentication — must be a valid ask-xxx key
# issued by agentsave-dashboard. If unset, all data fetches return null
# and the UI shows empty state gracefully.
AGENTSAVE_API_KEY=ask-your-key-here
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `AGENTSAVE_API_URL` | No | `http://localhost:8000` | Base URL of the agentsave-dashboard backend |
| `AGENTSAVE_API_KEY` | Yes (for data) | — | `ask-xxx` API key; omitting it causes all pages to show empty state |

Both variables are read server-side only (Next.js Server Components). They are never exposed to the browser.

---

## Testing

The test suite uses Playwright and is organised into three layers. Run all tests with:

```bash
npx playwright test
```

### Layer 1 — API-only (no browser)

**File:** `tests/e2e/api.spec.ts`

Tests the agentsave-dashboard HTTP API directly using Playwright's `request` fixture. No browser is launched. Covers authentication (401 without key), event ingestion, run listing, pagination, idempotency, metrics aggregation, token buckets, and billing defaults.

**Requires:** backend running + `TEST_API_KEY` set. Skipped automatically when `TEST_API_KEY` is absent.

```bash
TEST_API_KEY=ask-your-key-here npx playwright test tests/e2e/api.spec.ts
```

### Layer 2 — Browser / UI structure

**Files:** `overview.spec.ts`, `navigation.spec.ts`, `runs.spec.ts`, `billing.spec.ts`, `cost.spec.ts`, `frameworks.spec.ts`, `settings.spec.ts`, `agents.spec.ts`

Runs a real Chromium browser against the Next.js dev server. Tests are split into two groups:

- **Structure tests** (no `TEST_API_KEY` needed) — verify that every page loads, headings are correct, key UI elements exist (`data-testid` assertions), and no page returns 404.
- **Live-data tests** (skip without `TEST_API_KEY`) — seed runs via the API, then assert the UI reflects updated metrics and table rows.

```bash
# Structure only (no backend needed):
npx playwright test

# Structure + live-data:
TEST_API_KEY=ask-your-key-here npx playwright test
```

### Layer 3 — Full-stack SDK to UI

**File:** `tests/e2e/sdk-to-ui.spec.ts`

Spawns Python subprocesses that call the backend events API (mimicking real SDK telemetry), then asserts the Next.js UI reflects the new data. Validates the complete end-to-end path: SDK call → backend storage → UI server fetch → rendered page.

**Requires:** backend running + `TEST_API_KEY` set + `pip install agentsave` in the active Python environment. Skipped automatically when `TEST_API_KEY` is absent.

```bash
TEST_API_KEY=ask-your-key-here npx playwright test tests/e2e/sdk-to-ui.spec.ts
```

### Test environment variables

| Variable | Default | Purpose |
|---|---|---|
| `TEST_API_KEY` | — | Enables Layer 1 and Layer 3 tests; also unlocks live-data assertions in Layer 2 |
| `TEST_API_URL` | `http://localhost:8000` | Backend URL for Playwright API requests |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.9 |
| UI runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Charts | Recharts | ^3 |
| Component primitives | shadcn/ui, Radix UI, Base UI | — |
| Animations | framer-motion | ^12 |
| Command palette | cmdk | ^1 |
| Date utilities | date-fns | ^4 |
| Notifications | sonner | ^2 |
| Font | Geist | ^1.7 |
| Testing | Playwright | ^1.61 |

Data fetching is entirely server-side (`cache: "no-store"` on every fetch) so the dashboard always shows current data without client-side polling.

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feature/your-change`
2. Make changes. Run `npx tsc --noEmit` to check types.
3. Run `npm run build` to verify the production build passes.
4. Open a pull request against `main`. CI (TypeScript type check + Next.js build) runs automatically on every push.

There is no linter or formatter enforced in CI yet — match the style of the surrounding code.

---

## License

MIT — see [LICENSE](LICENSE).
