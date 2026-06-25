import { test, expect } from '@playwright/test'

test.describe('Frameworks page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frameworks')
  })

  test('page heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Frameworks')
  })

  test('all 6 framework cards are present', async ({ page }) => {
    for (const slug of ['langchain', 'autogen', 'crewai', 'smolagents', 'langgraph', 'raw']) {
      await expect(page.getByTestId(`framework-${slug}`)).toBeVisible()
    }
  })
})
