import { test, expect } from '@playwright/test';

test('home page survives a failing articles API', async ({ page }) => {
  await page.route(
    (url) => url.pathname.endsWith('/articles'),
    (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
  );
  await page.goto('/');
  // assert what YOUR frontend shows: an error message, an empty state, etc.
  await expect(page.getByText(/no articles|error/i)).toBeVisible();
});