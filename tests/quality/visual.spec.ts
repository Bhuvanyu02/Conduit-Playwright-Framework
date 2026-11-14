import { test, expect } from '@playwright/test';

test('home page looks right @visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home.png', { maxDiffPixelRatio: 0.01 });
});