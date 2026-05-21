import { test, expect } from '@playwright/test';

// Tests 1-4 exercise the static fallback surface — the only one a screen reader
// or low-power user ever sees, and the SSR default. Emulating reduced-motion
// keeps the orchestrator's gate script from swapping to the 3D globe slot on
// chromium/webkit, so the city list stays clickable. (mobile-chrome project
// already has a small viewport so the gate fails on size — these emulations
// are redundant but harmless there.)
test.describe('/diaspora', () => {
  test('page renders with city list visible (fallback is SSR default)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/diaspora');
    const list = page.locator('.diaspora-fallback__list');
    await expect(list).toBeVisible();
    // 5 cities seeded
    await expect(page.locator('.diaspora-fallback__list-item')).toHaveCount(5);
  });

  test('clicking a city in the list opens the drawer', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/diaspora');
    const firstCity = page.locator('.diaspora-fallback__list-item').first();
    await firstCity.click();
    const drawer = page.locator('[data-city-drawer]');
    await expect(drawer).toHaveAttribute('open', '');
  });

  test('ESC closes the drawer and returns focus to the trigger', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/diaspora');
    const firstCity = page.locator('.diaspora-fallback__list-item').first();
    await firstCity.focus();
    // Use keyboard activation (Enter) so focus stays on the trigger when the
    // document-level openDrawer handler reads document.activeElement. A real
    // mouse click on a button moves focus to <body> in webkit before the
    // handler runs, breaking the focus-restore-on-close assertion below.
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-city-drawer]')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-city-drawer]')).not.toHaveAttribute('open', '');
    await expect(firstCity).toBeFocused();
  });

  test('drawer body contains the city name + bio', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/diaspora');
    const accraButton = page.locator('.diaspora-fallback__list-item').filter({ hasText: 'Accra' });
    await accraButton.click();
    const drawerBody = page.locator('[data-city-drawer-body]');
    await expect(drawerBody).toContainText('Accra');
    await expect(drawerBody).toContainText('first stage');
  });

  test('mobile (<768px) shows the fallback (no globe slot visible)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/diaspora');
    const fallbackSlot = page.locator('[data-diaspora-fallback-slot]');
    await expect(fallbackSlot).toBeVisible();
    const globeSlot = page.locator('[data-diaspora-globe-slot]');
    await expect(globeSlot).toBeHidden();
  });

  test('prefers-reduced-motion hides the globe slot', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/diaspora');
    const globeSlot = page.locator('[data-diaspora-globe-slot]');
    await expect(globeSlot).toBeHidden();
    const fallbackSlot = page.locator('[data-diaspora-fallback-slot]');
    await expect(fallbackSlot).toBeVisible();
  });
});
