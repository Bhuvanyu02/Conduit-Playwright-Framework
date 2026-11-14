import { test } from '@playwright/test';
import { EditorPage } from '../../src/pages/editor.page';
import { buildArticle } from '../../src/data/factories';

test('user can publish an article @smoke', async ({ page }) => {
  const editor = new EditorPage(page);
  const article = buildArticle();
  await editor.open();
  await editor.publish(article);
  await editor.expectPublished(article.title);
});