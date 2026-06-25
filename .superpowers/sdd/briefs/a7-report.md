# Task A7 Report — Three Interactive Client Components

**Status: DONE**

## Files created
- `app/components/cost/CostProjector.tsx` — three-slider live cost projector (`data-testid="cost-projector"`)
- `app/components/cost/ActivityHeatmap.tsx` — 7×28 GitHub-style heatmap with Radix tooltips (`data-testid="activity-heatmap"`)
- `app/cost/page.tsx` — `/cost` page composing both components

## Files modified
- `app/components/dashboard/ActivityFeed.tsx` — replaced Task A6 stub with full polling feed (`data-testid="activity-feed"`)
- `app/globals.css` — added range slider styling (16px gradient thumb + glow per spec §5.11) and `@keyframes pulse` + `.pulse-dot` (per spec §5.12)
- `.env.local` — appended `NEXT_PUBLIC_DASHBOARD_API_URL`, `NEXT_PUBLIC_DEMO_PROJECT_ID`, `NEXT_PUBLIC_DEMO_JWT` (mirroring existing non-public values)

## Build status
- `npx tsc --noEmit`: 0 errors
- `npm run build`: PASSED (Next.js 16.2.9 / Turbopack). `/cost` route generated as static content.

## Implementation notes / decisions
- Followed the **task brief's exact code** as the authoritative source. The plan file (lines 2400–3200) contained an older, divergent variant of ActivityHeatmap (data-prop driven) and ActivityFeed (date-fns / lucide icons); the brief's versions were used instead.
- `globals.css` did NOT already contain the slider CSS the brief assumed ("already in globals.css"). Added it from spec §5.11 so sliders render with the correct 16px gradient thumb + `box-shadow: 0 0 10px rgba(99,102,241,0.5)`. Also added the missing `.pulse-dot` animation (referenced by ActivityFeed but previously undefined).
- ActivityHeatmap: wrapped the per-row map output in `<Fragment key=...>` instead of the brief's bare `<>` fragment, because a keyed fragment is required for React list children (bare `<>` cannot take a key). Behavior is identical.
- CostProjector: per the brief, the last (Annual savings) row label and value are both green (`#34d399`); Monthly savings value is also green; Tokens-reduced value is purple (`#a78bfa`). Values use JetBrains Mono.
- `/cost` page: imported only `CostProjector` and `ActivityHeatmap` exactly as the brief specified; the Live Activity card on that page is a placeholder comment (ActivityFeed remains wired into the dashboard `app/page.tsx`).

## Pre-existing (not introduced by this task)
- Build warns about multiple lockfiles (`~/package-lock.json` vs project lockfile). Pre-existing workspace-root inference warning, unrelated to A7.
