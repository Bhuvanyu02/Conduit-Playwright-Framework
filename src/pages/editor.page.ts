import { Page, expect } from '@playwright/test';

export class EditorPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/editor');
  }

  async publish(a: { title: string; description: string; body: string }) {
    await this.page.getByPlaceholder('Article Title').fill(a.title);
    await this.page.getByPlaceholder(/what.*about/i).fill(a.description);
    await this.page.getByPlaceholder(/write your article/i).fill(a.body);
    await this.page.getByRole('button', { name: /publish/i }).click();
  }

  async expectPublished(title: string) {
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
  }
}