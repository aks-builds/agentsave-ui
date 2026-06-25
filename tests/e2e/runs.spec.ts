import { test, expect } from '@playwright/test'

test.describe('Runs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/runs')
    await page.waitForLoadState('networkidle')
  })

  test('runs table is visible', async ({ page }) => {
    await expect(page.getByTestId('runs-page')).toBeVisible()
  })

  test('at least one run row exists', async ({ page }) => {
    const rows = page.getByTestId('run-row')
    await expect(rows.first()).toBeVisible()
  })
})
