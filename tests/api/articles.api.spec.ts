import { test, expect } from '../../src/fixtures';
import { buildArticle } from '../../src/data/factories';
import { ArticleSchema } from '../../src/schemas/article.schema';

test.describe('Articles API', () => {
  test('create article returns a valid article @api @smoke', async ({ authedApi }) => {
    const res = await authedApi.createArticleRaw(buildArticle());
    expect(res.ok()).toBeTruthy();
    const { article } = await res.json();
    expect(() => ArticleSchema.parse(article)).not.toThrow();
  });

  test('create article without token is rejected @api', async ({ api }) => {
    const res = await api.createArticleRaw(buildArticle());
    expect(res.status()).toBe(401);
  });

  test('create article with empty title is rejected @api', async ({ authedApi }) => {
    const res = await authedApi.createArticleRaw({ ...buildArticle(), title: '' });
    expect([400, 422]).toContain(res.status());
  });

  test('deleted article cannot be fetched @api', async ({ authedApi, article }) => {
    await authedApi.deleteArticle(article.slug);
    const res = await authedApi.getArticleRaw(article.slug);
    expect(res.status()).toBe(404);
  });
});