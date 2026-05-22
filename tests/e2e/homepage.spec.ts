import { test, expect } from '@playwright/test';

test.describe('/', () => {
  test('homepage renders Quiz teaser chapter', async ({ page }) => {
    await page.goto('/');
    const quizChapter = page.locator('[data-chapter="quiz"]');
    await expect(quizChapter).toBeVisible();
    await expect(quizChapter.locator('.quiz-teaser__title')).toContainText('Which Ghana');
  });

  test('Quiz teaser CTA routes to /quiz', async ({ page }) => {
    await page.goto('/');
    const quizCta = page.locator('.quiz-teaser__cta');
    await quizCta.scrollIntoViewIfNeeded();
    await expect(quizCta).toBeVisible();
    await quizCta.click();
    await expect(page).toHaveURL(/\/quiz$/);
  });

  test('Heritage teaser link routes to /heritage', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href="/heritage"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/\/heritage$/);
  });

  test('Diaspora teaser link routes to /diaspora', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href="/diaspora"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/\/diaspora$/);
  });

  test('Cycle teaser link routes to /contestants', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href="/contestants"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/\/contestants$/);
  });

  test('Quiz teaser archetype tile deep-links to /quiz/result/<region>', async ({ page }) => {
    await page.goto('/');
    const tile = page.locator('.quiz-teaser__tile').first();
    await tile.scrollIntoViewIfNeeded();
    const href = await tile.getAttribute('href');
    expect(href).toMatch(/^\/quiz\/result\/[a-z-]+$/);
    await tile.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, '\\/') + '$'));
  });
});
