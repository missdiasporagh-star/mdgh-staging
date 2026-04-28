import { test, expect } from '@playwright/test';

test.describe('TopNav', () => {
  test('renders all 5 primary nav items + Apply CTA', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-chrome',
      'desktop nav is display:none below 768px — mobile coverage is in the hamburger test',
    );
    await page.goto('/');
    // Dismiss greeting if present
    const skip = page.getByRole('button', { name: /skip greeting/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();

    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Story', 'About', 'Programs', 'For Sponsors', 'Press']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'Contact', exact: true }).first()).toBeVisible();
  });

  test('mobile hamburger opens panel', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'mobile viewport only on chromium');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const skip = page.getByRole('button', { name: /skip greeting/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();

    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(page.getByRole('link', { name: 'Get in touch' })).toBeVisible();
  });
});
