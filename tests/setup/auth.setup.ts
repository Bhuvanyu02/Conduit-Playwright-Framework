import { test as setup, expect, request } from '@playwright/test';
import { buildUser } from '../../src/data/factories';
import { ConduitApi } from '../../src/api/conduit-cleint';

setup('login once and save state', async ({ page }) => {
  const ctx = await request.newContext({ baseURL: process.env.API_URL });
  const api = new ConduitApi(ctx);
  const user = buildUser();
  const res = await api.register(user);
  expect(res.ok(), `register failed: ${res.status()} ${await res.text()}`).toBeTruthy();

  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.getByText(user.username).first().waitFor();

  await page.context().storageState({ path: '.auth/user.json' });
  await ctx.dispose();
});
