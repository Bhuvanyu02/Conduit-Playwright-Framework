import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly errors: Locator;
  readonly needAccountLink: Locator;

  constructor(private page: Page) {
    this.email = page.getByPlaceholder('Email');
    this.password = page.getByPlaceholder('Password');
    this.submit = page.getByRole('button', { name: /sign in/i });
    this.errors = page.locator('.error-messages li');
    this.needAccountLink = page.getByRole('link', { name: /need an account/i });
  }

  async open() {
    await this.page.goto('/login');
    await expect(this.submit).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  /** Logs in and waits until the app redirects home with the user's name in the header. */
  async loginAs(user: { email: string; password: string; username: string }) {
    await this.login(user.email, user.password);
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.page.getByRole('link', { name: user.username })).toBeVisible();
  }

  async expectStillOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.submit).toBeEnabled();
  }
}
