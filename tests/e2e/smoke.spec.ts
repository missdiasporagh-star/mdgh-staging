import { test, expect } from '@playwright/test';

test('home page renders the hero headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/she wears the future/i)).toBeVisible();
});
