# A6 Report — Tasks A10 (Dashboard page) & A11 (RunsTable)

Status: **DONE**

## Files created / modified

- **Modified** `app/page.tsx` — Dashboard server component (replaced the old placeholder grid).
- **Created** `app/components/runs/RunsTable.tsx` — full 8-column runs table (Task A11).
- **Created** `app/components/dashboard/ActivityFeed.tsx` — client stub for Task 13 (so page compiles).

## Build status

- `npx tsc --noEmit` → exit 0 (no type errors).
- `npm run build` (Next.js 16.2.9 / Turbopack) → exit 0. `/` route is dynamic (server-rendered on demand, correct for `cache: 'no-store'`).
- Dev server manual check: `GET http://localhost:3000/` → HTTP 200. All expected `data-testid`s present: dashboard-page, dashboard-greeting, live-badge, stat-{tokens-saved,cost-saved,success-rate,total-runs}(+-value), chart-tokens, chart-donut, runs-table, activity-feed. Greeting renders "Good evening, Aditya 👋"; live badge renders "🟢 N runs · live". Real metric data confirmed in HTML (cost subtitle "$0.2331").

## Decisions / deviations from the task prompt

1. **Followed the PLAN's component contracts, not the prose in the task prompt**, because the plan's `page.tsx` and `RunsTable` are internally consistent and match the already-built components:
   - `RunsTable` uses props `{ runs: RunRow[]; showPagination?: boolean }` (plan + spec §5.10), not the `{ events, limit }` shape sketched in the task prompt. The page passes `runs={events.slice(0,3).map(...)}`. Kept `data-testid="run-row"` on each row (from the prompt's version) for test compatibility.
   - `FrameworkDonut` (already built) takes `data: {name,value,color}[]` + `total: number` — NOT the `FrameworkSlice`/`totalLabel` shape the plan's page.tsx imported. I adapted `buildDonutData` to emit `{name, value, color}` (color resolved via the exported `FRAMEWORK_COLORS` map) and pass `total={sum of saved}`. This was a real mismatch in the plan that would not have compiled as written.

2. **Kept page as a server component with self-animating client children** (StatCard, charts, RunsTable, ActivityFeed each handle their own Framer Motion / interactivity). Did not introduce a separate `DashboardClient` wrapper — unnecessary since no stagger container is needed at the page level and it avoids passing React nodes (icons) across a server→client prop boundary.

3. **Cost card**: passed `value={Math.round(cost_saved_usd * 10000)}` to keep the animated counter, and put the human-readable `$0.2331 USD (×10⁻⁴)` in the subtitle (per the prompt's "FINAL APPROACH" guidance). StatCard left unchanged.

4. **Removed unused imports** (`Suspense`, `Skeleton`) that the plan's page.tsx listed but never used.

## Key finding / blocker for downstream tasks

- **Backend `GET /api/events/recent` returns 404 ("Not Found").** This is the new endpoint that spec §6 says must be added to `agentsave-dashboard` before the live feed / recent runs render. `/api/metrics` works and returns real data (tokens_saved=77700, cost_saved_usd=0.2331, success_rate=0.9, event_count=30).
- Consequence: stat cards + live-badge count show real values; the tokens chart, framework donut, and Recent Runs table currently show empty/"No data yet" states. The page degrades gracefully (fetch failure → `[]`), exactly as the task required. Once the backend endpoint ships, charts and recent runs will populate with no UI changes needed.
