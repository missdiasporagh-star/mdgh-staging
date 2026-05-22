import { test, expect } from '@playwright/test';

test.describe('/quiz', () => {
  test('start screen renders with Begin button', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.locator('.quiz-start__title')).toContainText('Which Ghana');
    await expect(page.locator('.quiz-start__cta')).toBeVisible();
    await expect(page.locator('.quiz-start__cta')).toContainText('Begin');
  });

  test('clicking Begin advances to Q1', async ({ page }) => {
    await page.goto('/quiz');
    await page.click('.quiz-start__cta');
    await expect(page.locator('.quiz-question__title')).toBeVisible();
    await expect(page.locator('.quiz-question__option')).toHaveCount(4);
  });

  test('selecting an option advances to Q2', async ({ page }) => {
    await page.goto('/quiz');
    await page.click('.quiz-start__cta');
    await page.click('.quiz-question__option >> nth=0');
    // Eyebrow should now read "QUESTION II"
    await expect(page.locator('.quiz-question__eyebrow')).toContainText('II');
  });

  test('completing all 6 questions navigates to a result page', async ({ page }) => {
    await page.goto('/quiz');
    await page.click('.quiz-start__cta');
    // Answer all 6 questions by clicking the first option each time
    for (let i = 0; i < 6; i++) {
      await page.click('.quiz-question__option >> nth=0');
    }
    // After Q6 the reveal mounts; wait for navigation to /quiz/result/...
    await page.waitForURL(/\/quiz\/result\/[a-z-]+/, { timeout: 8000 });
    await expect(page.locator('.result-hero__name')).toBeVisible();
  });

  test('result page renders archetype name + accent', async ({ page }) => {
    // Pick a known region directly
    await page.goto('/quiz/result/volta');
    await expect(page.locator('.result-hero__name')).toContainText('Volta');
    await expect(page.locator('.result-hero__archetype')).toContainText('River-Bearer');
  });

  test('reduced-motion still navigates from Q6 to a result page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/quiz');
    await page.click('.quiz-start__cta');
    for (let i = 0; i < 6; i++) {
      await page.click('.quiz-question__option >> nth=0');
    }
    await page.waitForURL(/\/quiz\/result\/[a-z-]+/, { timeout: 8000 });
  });
});
