import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', '..', 'agentsave', 'docs', 'screenshots');
mkdirSync(OUT_DIR, { recursive: true });

const SHOTS = [
  { url: 'http://localhost:3000/',              name: '01-overview.png',       wait: 2000 },
  { url: 'http://localhost:3000/analytics',     name: '02-analytics.png',      wait: 1500 },
  { url: 'http://localhost:3000/runs',          name: '03-runs.png',           wait: 2000 },
  { url: 'http://localhost:3000/cost',          name: '04-cost-projector.png', wait: 1500 },
  { url: 'http://localhost:3000/',              name: '05-activity-feed.png',  wait: 2000, scrollTo: '[data-testid="activity-feed"]' },
  { url: 'http://localhost:3000/cost',          name: '06-heatmap.png',        wait: 1500, scrollTo: '[data-testid="activity-heatmap"]' },
  { url: 'http://localhost:3000/',              name: '07-command-palette.png',wait: 500,  openPalette: true },
  { url: 'http://localhost:3000/billing',       name: '08-billing.png',        wait: 1000 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

for (const shot of SHOTS) {
  await page.goto(shot.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(shot.wait);

  if (shot.scrollTo) {
    try {
      await page.locator(shot.scrollTo).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    } catch {}
  }

  if (shot.openPalette) {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(600);
  }

  const outPath = join(OUT_DIR, shot.name);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('Captured:', shot.name);
}

await browser.close();
console.log('All screenshots saved to:', OUT_DIR);
