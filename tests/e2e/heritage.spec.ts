import { test, expect } from '@playwright/test';

test.describe('/heritage', () => {
  test('arrow keys move focus between cards', async ({ page }) => {
    await page.goto('/heritage');
    const rail = page.locator('[data-heritage-rail]');
    await expect(rail).toBeVisible();

    // Focus the first card
    const firstCard = page.locator('.queen-card').first();
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // Arrow Right should move focus to the next card (if exists)
    const cards = page.locator('.queen-card');
    const count = await cards.count();
    if (count > 1) {
      await page.keyboard.press('ArrowRight');
      await expect(cards.nth(1)).toBeFocused();
    }
  });

  test('Enter on a focused card opens the modal', async ({ page }) => {
    await page.goto('/heritage');
    const firstCard = page.locator('.queen-card').first();
    await firstCard.focus();
    await page.keyboard.press('Enter');
    const modal = page.locator('[data-queen-modal]');
    await expect(modal).toHaveAttribute('open', '');
  });

  test('ESC closes the modal and returns focus to the trigger card', async ({ page }) => {
    await page.goto('/heritage');
    const firstCard = page.locator('.queen-card').first();
    await firstCard.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    // After close (with 200ms animation timeout in the modal JS), the dialog
    // no longer has the `open` attribute.
    await expect(page.locator('[data-queen-modal]')).not.toHaveAttribute('open', '');
    await expect(firstCard).toBeFocused();
  });

  test('mobile (<768px) renders a vertical stack with no horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/heritage');
    const rail = page.locator('[data-heritage-rail]');
    await expect(rail).toBeVisible();

    // The rail should not have horizontal scroll on mobile
    const overflowX = await rail.evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflowX).toBe('hidden');

    // The flex-direction should be column
    const flexDirection = await rail.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('column');
  });

  test('prefers-reduced-motion disables scroll-snap on the rail', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/heritage');

    const rail = page.locator('[data-heritage-rail]');
    const scrollSnapType = await rail.evaluate((el) => getComputedStyle(el).scrollSnapType);
    expect(scrollSnapType).toBe('none');
  });
});
