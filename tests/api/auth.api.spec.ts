import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/data/factories';
import { UserSchema } from '../../src/schemas/user.schema';

test.describe('Auth API', () => {
  test('register returns a valid user with a token @api @smoke', async ({ api }) => {
    const user = buildUser();
    const res = await api.register(user);
    expect(res.status()).toBe(201);

    const body = (await res.json()).user;
    expect(() => UserSchema.parse(body)).not.toThrow();
    expect(body).toMatchObject({ email: user.email, username: user.username });
    expect(body).not.toHaveProperty('password');
  });

  test('register with an existing email and username is rejected @api', async ({ api }) => {
    const user = buildUser();
    expect((await api.register(user)).ok()).toBeTruthy();

    const res = await api.register(user);
    expect(res.status()).toBe(422);
    const { errors } = await res.json();
    expect(errors.email).toContain('duplicated email');
    expect(errors.username).toContain('duplicated username');
  });

  test('register with an invalid email is rejected @api', async ({ api }) => {
    const res = await api.register({ ...buildUser(), email: 'not-an-email' });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors.email).toContain('should be an email');
  });

  test('register with blank fields reports every field @api', async ({ api }) => {
    const res = await api.register({ username: '', email: '', password: '' });
    expect(res.status()).toBe(422);
    const { errors } = await res.json();
    expect(Object.keys(errors).sort()).toEqual(['email', 'password', 'username']);
  });

  test('login with valid credentials returns a token @api @smoke', async ({ api }) => {
    const user = buildUser();
    await api.register(user);

    const res = await api.loginRaw(user.email, user.password);
    expect(res.status()).toBe(200);
    const { user: body } = await res.json();
    expect(() => UserSchema.parse(body)).not.toThrow();
  });

  test('login with a wrong password is rejected @api', async ({ api }) => {
    const user = buildUser();
    await api.register(user);

    const res = await api.loginRaw(user.email, 'wrong-password');
    expect(res.status()).toBe(422);
    expect((await res.json()).message).toMatch(/invalid email or password/i);
  });

  test('login with an unknown email is rejected @api', async ({ api }) => {
    const res = await api.loginRaw(`nobody-${Date.now()}@example.com`, 'Passw0rd!');
    expect(res.status()).toBe(422);
  });

  test('current user is returned for a valid token @api', async ({ api }) => {
    const user = buildUser();
    await api.register(user);
    const token = await api.login(user.email, user.password);

    const res = await api.withToken(token).getCurrentUserRaw();
    expect(res.status()).toBe(200);
    expect((await res.json()).user).toMatchObject({ email: user.email, username: user.username });
  });

  test('current user requires a token @api', async ({ api }) => {
    expect((await api.getCurrentUserRaw()).status()).toBe(401);
  });

  test('current user rejects a malformed token @api', async ({ api }) => {
    expect((await api.withToken('not-a-real-token').getCurrentUserRaw()).status()).toBe(401);
  });
});
