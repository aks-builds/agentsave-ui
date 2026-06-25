import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/',              heading: 'Dashboard'    },
  { path: '/analytics',     heading: 'Analytics'    },
  { path: '/runs',          heading: 'Agent Runs'   },
  { path: '/frameworks',    heading: 'Frameworks'   },
  { path: '/cost',          heading: 'Cost'         },
  { path: '/settings/keys', heading: 'API Keys'     },
  { path: '/billing',       heading: 'Billing'      },
  { path: '/settings',      heading: 'Settings'     },
]

test.describe('Navigation', () => {
  test('all 8 pages load with correct H1', async ({ page }) => {
    for (const { path, heading } of PAGES) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const h1 = page.getByRole('heading', { level: 1 }).first()
      await expect(h1).toBeVisible()
      const text = await h1.textContent()
      expect(text).toContain(heading)
      console.log(`[Playwright] ${path} → "${text}" ✓`)
    }
  })

  test('command palette trigger is visible on overview', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('command-palette-trigger')).toBeVisible()
  })

  test('Cmd+K opens command palette', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(300)
    await expect(page.getByPlaceholder('Search or run command…')).toBeVisible()
  })

  test('period picker buttons are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('period-7d')).toBeVisible()
    await expect(page.getByTestId('period-30d')).toBeVisible()
    await expect(page.getByTestId('period-90d')).toBeVisible()
  })

  test('no page returns 404', async ({ page }) => {
    for (const { path } of PAGES) {
      const res = await page.goto(path)
      expect(res?.status()).not.toBe(404)
    }
  })
})
