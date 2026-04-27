import { test, expect } from '@playwright/test';

test.describe('TopNav', () => {
  test('renders all 5 primary nav items + Apply CTA', async ({ page }) => {
    await page.goto('/');
    // Dismiss greeting if present
    const skip = page.getByRole('button', { name: /skip greeting/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();

    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Story', 'Heritage', 'Contestants', 'For Sponsors', 'Press']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'Apply', exact: true }).first()).toBeVisible();
  });

  test('mobile hamburger opens panel', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'mobile viewport only on chromium');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const skip = page.getByRole('button', { name: /skip greeting/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();

    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(page.getByRole('link', { name: 'Apply for Crown' })).toBeVisible();
  });
});
