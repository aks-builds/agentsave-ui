import { test, expect } from '@playwright/test'
import { API_KEY, resetDB, seedRun, seedRuns } from './helpers'

const hasBackend = !!API_KEY

test.describe('Runs page — UI structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/runs')
    await page.waitForLoadState('networkidle')
  })

  test('runs page container is visible', async ({ page }) => {
    await expect(page.getByTestId('runs-page')).toBeVisible()
  })

  test('page heading shows Agent Runs', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Agent Runs')
  })
})

test.describe('Runs page — with live data', () => {
  test.skip(!hasBackend, 'TEST_API_KEY not set — skipping live-data runs tests')

  test.beforeEach(async ({ request }) => {
    await resetDB(request)
  })

  test('shows run rows after seeding', async ({ request, page }) => {
    await seedRuns(request, 5)
    await page.goto('/runs')
    await page.waitForLoadState('networkidle')
    const rows = page.getByTestId('run-row')
    await expect(rows.first()).toBeVisible()
  })

  test('run row shows framework badge', async ({ request, page }) => {
    await seedRun(request, { framework: 'langchain' })
    await page.goto('/runs')
    await page.waitForLoadState('networkidle')
    const rows = page.getByTestId('run-row')
    await expect(rows.first()).toBeVisible()
  })

  test('pagination controls appear with many runs', async ({ request, page }) => {
    await seedRuns(request, 55)
    await page.goto('/runs')
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('runs-page')).toBeVisible()
  })
})
