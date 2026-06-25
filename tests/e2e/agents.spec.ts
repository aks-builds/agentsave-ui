import { test, expect } from '@playwright/test'

test.describe('Agents → Frameworks redirect', () => {
  test('/frameworks page loads correctly', async ({ page }) => {
    await page.goto('/frameworks')
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Frameworks')
  })
})
