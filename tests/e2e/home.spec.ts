import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test.beforeEach(async ({ context, baseURL }) => {
    // Pre-set the 'greeted' cookie so the overlay never shows for these tests.
    const url = new URL(baseURL ?? 'http://localhost:4321');
    await context.addCookies([
      { name: 'mdgh_greeted', value: '1', domain: url.hostname, path: '/' },
    ]);
  });

  test('renders all 6 chapters with correct data-chapter ids', async ({ page }) => {
    await page.goto('/');
    for (const id of ['hero', 'mission', 'crown', 'diaspora', 'cycle', 'become']) {
      await expect(page.locator(`[data-chapter="${id}"]`)).toBeVisible();
    }
  });

  test('hero CTA links to /apply', async ({ page }) => {
    await page.goto('/');
    const cta = page
      .locator('[data-chapter="hero"]')
      .getByRole('link', { name: /begin application/i });
    await expect(cta).toHaveAttribute('href', '/apply');
  });

  test('become her CTA links to /apply', async ({ page }) => {
    await page.goto('/');
    const cta = page
      .locator('[data-chapter="become"]')
      .getByRole('link', { name: /begin application/i });
    await expect(cta).toHaveAttribute('href', '/apply');
  });

  test('chapter rail nav is rendered with 6 jump links', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-chrome',
      'chapter rail is hidden below 768px',
    );
    await page.goto('/');
    const rail = page.getByRole('navigation', { name: /page chapters/i });
    await expect(rail).toBeVisible();
    const labels = ['Hero', 'Mission', 'The Crown', 'Diaspora', 'Cycle', 'Become Her'];
    for (const label of labels) {
      await expect(rail.getByRole('link', { name: `Jump to ${label}` })).toBeVisible();
    }
  });
});
