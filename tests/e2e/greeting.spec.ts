import { test, expect } from '@playwright/test';

test.describe('Cultural Greeting', () => {
  test('shows for new visitor and dismisses on skip', async ({ page, context }) => {
    // Make sure no prior cookie exists for this test
    await context.clearCookies();
    await page.goto('/');

    const skip = page.getByRole('button', { name: /skip greeting/i });
    await expect(skip).toBeVisible({ timeout: 5000 });

    await skip.click();

    // Greeting becomes hidden (the wrapper has `hidden` attribute applied)
    await expect(page.locator('#mdgh-greeting')).toBeHidden({ timeout: 2000 });

    // Cookie was set
    const cookies = await context.cookies();
    const greeted = cookies.find((c) => c.name === 'mdgh_greeted');
    expect(greeted?.value).toBe('1');
  });

  test('does not show after cookie is set', async ({ page, context, baseURL }) => {
    const url = new URL(baseURL ?? 'http://localhost:4321');
    await context.addCookies([
      { name: 'mdgh_greeted', value: '1', domain: url.hostname, path: '/' },
    ]);
    await page.goto('/');
    // Either the greeting div doesn't exist, or it has the `hidden` attribute
    await expect(page.locator('#mdgh-greeting')).toBeHidden();
  });
});
