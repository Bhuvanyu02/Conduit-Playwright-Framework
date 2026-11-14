import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly banner: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly articlePreviews: Locator;
  readonly emptyState: Locator;
  readonly popularTags: Locator;
  readonly newPostLink: Locator;
  readonly signInLink: Locator;

  constructor(private page: Page) {
    this.banner = page.locator('.banner');
    this.globalFeedTab = page.getByRole('link', { name: 'Global Feed' });
    this.yourFeedTab = page.getByRole('link', { name: 'Your Feed' });
    this.articlePreviews = page.locator('.article-preview').filter({ has: page.locator('.preview-link') });
    this.emptyState = page.getByText('No articles are here... yet.');
    this.popularTags = page.locator('.sidebar .tag-pill');
    this.newPostLink = page.getByRole('link', { name: /new post/i });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
  }

  async open() {
    await this.page.goto('/');
    await expect(this.page.locator('.home-page')).toBeVisible();
  }

  async openGlobalFeed() {
    await this.globalFeedTab.click();
    await expect(this.page.getByText('Loading...')).toHaveCount(0);
  }

  async filterByTag(tag: string) {
    await this.popularTags.filter({ hasText: tag }).first().click();
  }

  articleByTitle(title: string): Locator {
    return this.articlePreviews.filter({ has: this.page.getByRole('heading', { name: title }) });
  }

  async openArticle(title: string) {
    await this.articleByTitle(title).locator('.preview-link').click();
  }

  async expectLoggedInAs(username: string) {
    await expect(this.newPostLink).toBeVisible();
    await expect(this.page.getByRole('link', { name: username })).toBeVisible();
  }

  async expectLoggedOut() {
    await expect(this.signInLink).toBeVisible();
    await expect(this.banner).toBeVisible();
  }
}
