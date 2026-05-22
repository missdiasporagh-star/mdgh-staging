import { test, expect } from '@playwright/test';

test.describe('/contestants', () => {
  test('index renders 6 contestant cards', async ({ page }) => {
    await page.goto('/contestants');
    await expect(page.locator('.contestants-page__title')).toBeVisible();
    await expect(page.locator('.contestant-card')).toHaveCount(6);
  });

  test('clicking a card routes to detail page', async ({ page }) => {
    await page.goto('/contestants');
    const firstCard = page.locator('.contestant-card').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/contestants\/[a-z-]+$/);
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test('detail page renders hero + bio + charity + back link', async ({ page }) => {
    await page.goto('/contestants/ama-boateng');
    await expect(page.locator('.contestant-hero')).toBeVisible();
    await expect(page.locator('.contestant-hero__name')).toContainText('Ama Boateng');
    await expect(page.locator('.contestant-detail__prose')).toContainText('grandmother');
    await expect(page.locator('.charity-panel')).toBeVisible();
    await expect(page.locator('.charity-panel__title')).toContainText('Reading Garden');
    await expect(page.locator('.contestant-detail__back')).toBeVisible();
  });

  test('voting button is disabled with explanatory copy', async ({ page }) => {
    await page.goto('/contestants/ama-boateng');
    const voteBtn = page.locator('.voting-disabled__btn');
    await expect(voteBtn).toBeDisabled();
    await expect(page.locator('.voting-disabled__copy')).toContainText('finale week');
  });

  test('back link from detail returns to index', async ({ page }) => {
    await page.goto('/contestants/ama-boateng');
    await page.click('.contestant-detail__back');
    await expect(page).toHaveURL(/\/contestants$/);
    await expect(page.locator('.contestants-page__title')).toBeVisible();
  });

  test('mobile (<768px) shows 1-up stack', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/contestants');
    const grid = page.locator('.contestants-page__grid');
    const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // 1-up stack: a single track on mobile
    expect(cols.split(' ').length).toBe(1);
  });
});
