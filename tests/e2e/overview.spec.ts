import { test, expect } from '@playwright/test'
import { API_KEY, resetDB, seedRuns } from './helpers'

const hasBackend = !!API_KEY

test.describe('Overview page — UI structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('page title renders', async ({ page }) => {
    await expect(page).toHaveTitle(/AgentSave/)
  })

  test('all four stat cards are visible', async ({ page }) => {
    await expect(page.getByTestId('stat-tokens-saved')).toBeVisible()
    await expect(page.getByTestId('stat-cost-saved')).toBeVisible()
    await expect(page.getByTestId('stat-success-rate')).toBeVisible()
    await expect(page.getByTestId('stat-total-runs')).toBeVisible()
  })

  test('stat card values are visible', async ({ page }) => {
    await expect(page.getByTestId('stat-tokens-saved-value')).toBeVisible()
    await expect(page.getByTestId('stat-cost-saved-value')).toBeVisible()
    await expect(page.getByTestId('stat-success-rate-value')).toBeVisible()
    await expect(page.getByTestId('stat-total-runs-value')).toBeVisible()
  })

  test('chart-tokens container is present', async ({ page }) => {
    await expect(page.getByTestId('chart-tokens')).toBeVisible()
  })

  test('chart-donut container is present', async ({ page }) => {
    await expect(page.getByTestId('chart-donut')).toBeVisible()
  })

  test('activity feed is visible', async ({ page }) => {
    await expect(page.getByTestId('activity-feed')).toBeVisible()
  })

  test('dashboard greeting is visible', async ({ page }) => {
    await expect(page.getByTestId('dashboard-greeting')).toBeVisible()
  })
})

test.describe('Overview page — with live data', () => {
  test.skip(!hasBackend, 'TEST_API_KEY not set — skipping live-data browser tests')

  test.beforeEach(async ({ request }) => {
    await resetDB(request)
    await seedRuns(request, 10)
  })

  test('tokens saved shows a positive number after seeding', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const value = page.getByTestId('stat-tokens-saved-value')
    await expect(value).toBeVisible()
    const text = await value.textContent()
    const numeric = parseInt((text ?? '0').replace(/,/g, ''))
    expect(numeric).toBeGreaterThan(0)
    console.log(`[Playwright] Tokens saved: ${text}`)
  })

  test('total runs count reflects seeded data', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const text = await page.getByTestId('stat-total-runs-value').textContent()
    const numeric = parseInt(text?.replace(/,/g, '') ?? '0')
    expect(numeric).toBeGreaterThanOrEqual(10)
  })

  test('live badge shows run count', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('live-badge')).toBeVisible()
    const text = await page.getByTestId('live-badge').textContent()
    expect(text).toMatch(/\d+/)
  })
})
