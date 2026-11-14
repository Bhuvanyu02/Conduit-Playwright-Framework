import { APIRequestContext, expect } from '@playwright/test';

export type NewUser = { username: string; email: string; password: string };
export type NewArticle = { title: string; description: string; body: string; tagList?: string[] };

export class ConduitApi {
  constructor(private request: APIRequestContext, private token?: string) {}

  private headers(): Record<string, string> {
  const h: Record<string, string> = {};
  if (this.token) h.Authorization = `Token ${this.token}`;
  return h;
}

  withToken(token: string) {
    return new ConduitApi(this.request, token);
  }

  register(user: NewUser) {
    return this.request.post('users', { data: { user } });
  }

  loginRaw(email: string, password: string) {
    return this.request.post('users/login', { data: { user: { email, password } } });
  }

  getCurrentUserRaw() {
    return this.request.get('user', { headers: this.headers() });
  }

  async login(email: string, password: string): Promise<string> {
    const res = await this.loginRaw(email, password);
    expect(res.ok(), 'login should succeed').toBeTruthy();
    return (await res.json()).user.token;
  }

  createArticleRaw(article: NewArticle) {
    return this.request.post('articles', { headers: this.headers(), data: { article } });
  }

  async createArticle(article: NewArticle) {
    const res = await this.createArticleRaw(article);
    expect(res.ok(), `createArticle failed: ${res.status()} ${await res.text()}`).toBeTruthy();
    return (await res.json()).article;
  }

  deleteArticle(slug: string) {
    return this.request.delete(`articles/${slug}`, { headers: this.headers() });
  }

  getArticleRaw(slug: string) {
    return this.request.get(`articles/${slug}`, { headers: this.headers() });
  }
}