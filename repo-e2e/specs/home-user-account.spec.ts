import type { APIRequestContext, Page, TestInfo } from '@playwright/test';

import { expect, test } from '@playwright/test';

const accountPath = '/home/user/account';
const passwordSetPath = '/home/user/password-set';
const passwordResetPath = '/home/user/password-reset';
const passportLoginApiPath = '/api/home/user/passport/login';
const passportRegisterApiPath = '/api/home/user/passport/register';
const passportCurrentApiPath = '/api/home/user/passport/current';
const passportActivateCurrentApiPath = '/api/home/user/passportTest/activateCurrent';
const accountProfileApiPath = '/api/home/user/account/profile';

function waitForApiResponse(page: Page, method: string, pathname: string, requireOk = true) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === method &&
      url.pathname === pathname &&
      (!requireOk || response.ok()) &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

function collectConsoleErrors(page: Page, ignored: RegExp[] = []) {
  const errors: string[] = [];
  page.on('console', message => {
    const text = message.text();
    if (
      (message.type() === 'error' || /hydration mismatch/i.test(text)) &&
      !ignored.some(pattern => pattern.test(text))
    ) {
      errors.push(text);
    }
  });
  return errors;
}

function waitForCaptchaCreate(page: Page) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'POST' &&
      response.ok() &&
      url.pathname === '/api/captcha/create'
    );
  });
}

async function loginAsAdmin(page: Page) {
  const captchaCreated = waitForCaptchaCreate(page);
  const response = await page.goto('/admin/login', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await captchaCreated;
  await page.getByLabel('Your Username').fill('admin');
  await page.getByLabel('Your Password').fill('123456');
  await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
}

async function registerAccountUser(request: APIRequestContext, testInfo: TestInfo) {
  const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
  const username = `e2e-account-${suffix}`;
  const password = 'account-e2e-password';
  const captchaResponse = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(captchaResponse.ok()).toBeTruthy();
  const captcha = (await captchaResponse.json()).data;
  expect(captcha?.id).toEqual(expect.any(String));
  expect(captcha?.token).toEqual(expect.any(String));

  const baseURL = testInfo.project.use.baseURL;
  if (!baseURL) throw new Error('account E2E base URL is unavailable');
  const registerResponse = await request.post(passportRegisterApiPath, {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl: new URL('/home/user/activation', baseURL).toString(),
      captcha: { id: captcha.id, token: captcha.token },
    },
  });
  expect(registerResponse.ok()).toBeTruthy();
  const registration = (await registerResponse.json()).data;
  expect(registration?.jwt?.accessToken).toEqual(expect.any(String));
  const activateResponse = await request.post(passportActivateCurrentApiPath, {
    headers: { Authorization: `Bearer ${registration.jwt.accessToken}` },
  });
  expect(activateResponse.ok()).toBeTruthy();
  return { username, password };
}

async function loginAsAccountUser(page: Page, username: string, password: string) {
  await page.getByLabel('Your Username').fill(username);
  await page.getByLabel('Your Password').fill(password);
  await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
  const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  expect((await loginResponse).ok()).toBeTruthy();
}

async function openUserMenu(page: Page, username: string) {
  const activator = page.getByRole('banner').getByRole('button', { name: username, exact: true });
  await expect(activator).toBeVisible();
  await activator.click();
  const list = page.locator('.v-overlay-container').getByRole('list').filter({ hasText: 'Logout' });
  await expect(list).toBeVisible();
  return list;
}

test(
  'ATP-ACCOUNT-SSR-01: anonymous Account session SSR redirects to login',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }) => {
    const response = await request.get(accountPath, { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    const redirectUrl = new URL(response.headers().location!, response.url());
    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('returnTo')).toBe(accountPath);

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const documentResponse = await page.goto(accountPath, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-HUA-REG-01: registration defers site admission until activation',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page }, testInfo) => {
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const username = `e2e-register-${suffix}`;
    const password = 'account-e2e-password';
    await page.goto(`${accountPath}`, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    await page.getByRole('button', { name: 'Register', exact: true }).click();
    await expect(page).toHaveURL(/\/home\/login\/register(?:\?|$)/);
    await expect(page.getByText('Create an account to continue.', { exact: true })).toBeVisible();

    await page.getByRole('textbox', { name: 'User Name *' }).fill(username);
    await page.getByRole('textbox', { name: 'Email *' }).fill(`${username}@example.test`);
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill(password);
    await page.getByRole('textbox', { name: 'Confirm Password *', exact: true }).fill(password);
    await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
    const registerResponse = waitForApiResponse(page, 'POST', passportRegisterApiPath);
    await page.getByRole('button', { name: 'Register', exact: true }).click();
    expect((await registerResponse).ok()).toBeTruthy();
    await expect(
      page.getByText('Check your email to activate your account before signing in.', {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Back to login', exact: true }).click();
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
  },
);

test(
  'ATP-HUA-RST-01: password-reset request remains enumeration-neutral',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page }) => {
    await page.goto('/login', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    await expect(page).toHaveURL('/home/login/password-reset');
    await expect(
      page.getByText(
        'Enter your email address and we will send reset instructions if the account is eligible.',
        { exact: true },
      ),
    ).toBeVisible();
    await page.getByPlaceholder('Your email').fill('unknown-reset@example.test');
    const captcha = page.getByLabel('Please input captcha');
    await expect(captcha).not.toHaveValue('');
    const requestResponse = waitForApiResponse(
      page,
      'POST',
      '/api/home/user/account/password-reset/request',
    );
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    expect((await requestResponse).ok()).toBeTruthy();
    await expect(
      page.getByText('If an eligible account exists, reset instructions have been sent.', {
        exact: true,
      }),
    ).toBeVisible();
  },
);

for (const [title, route, token] of [
  ['password-set', passwordSetPath, 'e2e-public-query-token'],
  ['password-reset', passwordResetPath, 'e2e-reset-public-query-token-001'],
] as const) {
  test(
    `ATP-ACCOUNT-PUBLIC-${title}: query token is not exposed during SSR and is scrubbed after hydration`,
    { tag: ['@account', '@web', '@ssr'] },
    async ({ page, request }) => {
      const tokenUrl = `${route}?token=${token}`;
      const response = await request.get(tokenUrl);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()['cache-control']).toBe('no-cache, no-store, must-revalidate');
      const html = await response.text();
      expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
      expect(html).not.toContain(token);
      expect(html).not.toContain('New password');
      expect(html).not.toContain('Confirm new password');

      const pageErrors = collectPageErrors(page);
      const consoleErrors = collectConsoleErrors(page, [/server responded with a status of 401/i]);
      const documentResponse = await page.goto(tokenUrl, { waitUntil: 'load' });
      expect(documentResponse?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page).toHaveURL(route);
      await expect(
        page.getByText(
          title === 'password-set'
            ? 'Choose a new password to finish setting up local sign-in.'
            : 'Choose a new password for your local sign-in.',
          { exact: true },
        ),
      ).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(value => {
            return {
              pathname: window.location.pathname,
              search: window.location.search,
              hash: window.location.hash,
              local: Object.entries(localStorage).filter(([key, stored]) =>
                `${key}:${stored}`.includes(value),
              ),
              session: Object.entries(sessionStorage).filter(([key, stored]) =>
                `${key}:${stored}`.includes(value),
              ),
            };
          }, token),
        )
        .toEqual({ pathname: route, search: '', hash: '', local: [], session: [] });
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    },
  );
}

test(
  'ATP-ACCOUNT-WEB-01: profile save refreshes the authenticated Web user menu',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page, request }, testInfo) => {
    const account = await registerAccountUser(request, testInfo);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await loginAsAccountUser(page, account.username, account.password);
    await expect(page).toHaveURL(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();

    const profileName = `E2E Account ${testInfo.workerIndex}-${Date.now()}`;
    await page.getByLabel('Display name').fill(profileName);
    await page.getByLabel('Time zone').fill('UTC');
    const profileResponse = waitForApiResponse(page, 'PATCH', accountProfileApiPath);
    const passportResponse = waitForApiResponse(page, 'GET', passportCurrentApiPath);
    await page.getByRole('button', { name: 'Save profile', exact: true }).click();
    expect((await profileResponse).ok()).toBeTruthy();
    expect((await passportResponse).ok()).toBeTruthy();
    await expect(page.getByText('Profile saved.', { exact: true })).toBeVisible();

    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    const list = await openUserMenu(page, profileName);
    await expect(list.getByRole('listitem')).toHaveText(['Account Settings', 'Logout']);
    await list.getByRole('listitem').filter({ hasText: 'Account Settings' }).click();
    await expect(page).toHaveURL(/\/home\/user\/account$/);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-SSR-02: signed-in Account session SSR hydrates without mismatch',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }, testInfo) => {
    const account = await registerAccountUser(request, testInfo);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await loginAsAccountUser(page, account.username, account.password);
    await expect(page).toHaveURL(accountPath);
    const response = await page.reload({ waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    expect(await response!.text()).toContain('Account Settings');
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-ADMIN-01: Admin Account Settings precedes Logout',
  { tag: ['@account', '@admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    const list = await openUserMenu(page, 'admin');
    await expect(list.getByRole('listitem')).toHaveText(['Account Settings', 'Logout']);
    await list.getByRole('listitem').filter({ hasText: 'Account Settings' }).click();
    await expect(page).toHaveURL(/\/home\/user\/account$/);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);
