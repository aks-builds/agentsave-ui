import { test, expect } from '@playwright/test'

test.describe('Settings page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('settings page loads', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Settings')
  })

  test('preferences section is visible', async ({ page }) => {
    await expect(page.getByTestId('settings-preferences')).toBeVisible()
  })
})
