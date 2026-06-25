import { test, expect } from '@playwright/test'

test.describe('Billing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/billing')
  })

  test('all three tier names are displayed', async ({ page }) => {
    await expect(page.getByTestId('tier-name-free')).toBeVisible()
    await expect(page.getByTestId('tier-name-pro')).toBeVisible()
    await expect(page.getByTestId('tier-name-enterprise')).toBeVisible()
  })

  test('Pro tier shows $29', async ({ page }) => {
    const proPrice = page.getByTestId('tier-price-pro')
    await expect(proPrice).toContainText('$29')
  })

  test('Enterprise tier shows $299', async ({ page }) => {
    const entPrice = page.getByTestId('tier-price-enterprise')
    await expect(entPrice).toContainText('$299')
  })

  test('Enterprise mentions InferRoute', async ({ page }) => {
    const entCard = page.getByTestId('tier-enterprise')
    await expect(entCard).toContainText('InferRoute')
  })

  test('Free tier CTA is disabled', async ({ page }) => {
    const btn = page.getByTestId('tier-cta-free')
    await expect(btn).toBeDisabled()
  })

  test('Pro upgrade button is enabled', async ({ page }) => {
    const btn = page.getByTestId('tier-cta-pro')
    await expect(btn).toBeEnabled()
  })
})
