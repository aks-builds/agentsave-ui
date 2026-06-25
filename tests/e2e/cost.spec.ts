import { test, expect } from '@playwright/test'

test.describe('Cost page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cost')
  })

  test('cost projector is visible', async ({ page }) => {
    await expect(page.getByTestId('cost-projector')).toBeVisible()
  })

  test('activity heatmap is visible', async ({ page }) => {
    await expect(page.getByTestId('activity-heatmap')).toBeVisible()
  })
})
