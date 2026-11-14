import { test as base, expect } from '@playwright/test';
import { ConduitApi } from '../api/conduit-cleint';
import { buildUser, buildArticle } from '../data/factories';

type Fixtures = {
  api: ConduitApi;
  authedApi: ConduitApi;
  article: { slug: string; title: string };
};

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.API_URL });
    await use(new ConduitApi(ctx));
    await ctx.dispose();
  },

  // a brand-new user per test: isolation without cleanup headaches
  authedApi: async ({ api }, use) => {
    const user = buildUser();
    await api.register(user);
    const token = await api.login(user.email, user.password);
    await use(api.withToken(token));
  },

  article: async ({ authedApi }, use) => {
    const created = await authedApi.createArticle(buildArticle());
    await use({ slug: created.slug, title: created.title });
    await authedApi.deleteArticle(created.slug);
  },
});

export { expect };