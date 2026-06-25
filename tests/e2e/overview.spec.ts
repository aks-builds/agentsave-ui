import { test, expect } from '@playwright/test'

test.describe('Overview page', () => {
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

  test('tokens saved shows a real number (not —)', async ({ page }) => {
    const value = page.getByTestId('stat-tokens-saved-value')
    await expect(value).toBeVisible()
    const text = await value.textContent()
    expect(text).not.toBe('—')
    expect(text?.replace(/,/g, '')).toMatch(/\d+/)
    console.log(`[Playwright] Tokens saved: ${text}`)
  })

  test('cost saved shows value', async ({ page }) => {
    const value = page.getByTestId('stat-cost-saved-value')
    await expect(value).toBeVisible()
    const text = await value.textContent()
    console.log(`[Playwright] Cost saved: ${text}`)
    expect(text?.length).toBeGreaterThan(0)
  })

  test('success rate shows value', async ({ page }) => {
    const value = page.getByTestId('stat-success-rate-value')
    await expect(value).toBeVisible()
    const text = await value.textContent()
    console.log(`[Playwright] Success rate: ${text}`)
  })

  test('total runs shows event count', async ({ page }) => {
    const value = page.getByTestId('stat-total-runs-value')
    await expect(value).toBeVisible()
    const text = await value.textContent()
    expect(parseInt(text?.replace(/,/g, '') ?? '0')).toBeGreaterThan(0)
    console.log(`[Playwright] Total runs: ${text}`)
  })

  test('tokens area chart is visible', async ({ page }) => {
    await expect(page.getByTestId('tokens-area-chart')).toBeVisible()
  })

  test('framework donut is visible', async ({ page }) => {
    await expect(page.getByTestId('framework-donut')).toBeVisible()
  })

  test('activity feed is visible', async ({ page }) => {
    await expect(page.getByTestId('activity-feed')).toBeVisible()
  })

  test('demo data: tokens saved ≥ 70,000', async ({ page }) => {
    const text = await page.getByTestId('stat-tokens-saved-value').textContent()
    const numeric = parseInt((text ?? '0').replace(/,/g, ''))
    expect(numeric).toBeGreaterThanOrEqual(70_000)
    console.log(`[Playwright] Tokens saved (numeric): ${numeric}`)
  })
})
