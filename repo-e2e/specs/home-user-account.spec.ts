import type { Page, Route } from '@playwright/test';

import type { RegisteredAccount } from './helpers/cabloy-admin-api.ts';

import { expect, test } from '../scripts/managedTest.ts';
import {
  loginAsAccount,
  registerAccountUser,
  removeAccountFixture,
  requestApi,
  runCleanup,
} from './helpers/cabloy-admin-api.ts';

// Account credentials, refresh responses, and one-time MCP secrets must not enter failure artifacts.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

const accountPath = '/home/user/account';
const passwordSetPath = '/home/user/password-set';
const passwordResetPath = '/home/user/password-reset';
const passportLoginApiPath = '/api/home/user/passport/login';
const passportRegisterApiPath = '/api/home/user/passport/register';
const passportCurrentApiPath = '/api/home/user/passport/current';
const accountApiPath = '/api/home/user/account/current';
const accountProfileApiPath = '/api/home/user/account/profile';
const accessTokensPath = '/cabloy/mcp/accessTokens';
const accessTokenApiPath = '/api/mcp/auth/accessToken';
const minePages = [
  { title: 'Account Settings', path: accountPath },
  { title: 'MCP scopes', path: '/cabloy/mcp/scopes' },
  { title: 'MCP authorizations', path: '/cabloy/mcp/authorizations' },
  { title: 'MCP access tokens', path: accessTokensPath },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
}

async function expectTokenSecretAbsent(page: Page, secret: string) {
  // Keep assertions boolean-only so a failure cannot retain the credential or input values.
  await expect
    .poll(() =>
      page.evaluate(value => {
        const inputs = Array.from(
          document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'),
          input => input.value,
        );
        return (
          !document.querySelector('[data-testid="mcp-access-token-reveal"]') &&
          !document.documentElement.outerHTML.includes(value) &&
          !JSON.stringify({
            inputs,
            local: { ...localStorage },
            session: { ...sessionStorage },
          }).includes(value)
        );
      }, secret),
    )
    .toBe(true);
}

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

async function loginAsAccountUser(page: Page, username: string, password: string) {
  await page.getByLabel('Your Username').fill(username);
  await page.getByLabel('Your Password').fill(password);
  await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
  const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  expect((await loginResponse).ok()).toBeTruthy();
}

async function loginAccountFromPage(page: Page, account: RegisteredAccount, returnTo: string) {
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  const accountResponse = waitForApiResponse(page, 'GET', accountApiPath);
  await loginAsAccountUser(page, account.username, account.password);
  expect((await accountResponse).ok()).toBeTruthy();
  await expect(page).toHaveURL(returnTo);
  await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
}

async function openUserMenu(page: Page, username: string) {
  const actions = page.getByTestId('header-actions');
  const more = actions.getByTestId('header-actions-more');
  const panel = actions.locator('.header-actions-panel');
  // Login changes the URL before its destination layout necessarily finishes mounting.
  await expect(actions).toBeVisible();
  if (await more.isVisible()) {
    if (!(await panel.isVisible())) await more.click();
    await expect(more).toHaveAttribute('aria-expanded', 'true');
  }
  const activator = actions.getByRole('button', { name: 'Account', exact: true });
  await expect(activator).toBeVisible();
  // The stable accessible name must not hide regressions in the personalized visible name.
  await expect(activator).toHaveText(username);
  await activator.click();
  const owner = await panel.getAttribute('id');
  expect(owner).toBeTruthy();
  const activeList = page
    .locator(`.v-overlay--active [data-header-actions-owner="${owner}"]`)
    .getByRole('list');
  await expect(activeList).toBeVisible();
  await expect(activeList).toContainText('Logout');
  // Keep a stable locator after dismissal: the eager account menu owns the pending logout.
  return page
    .locator(`[data-header-actions-owner="${owner}"] .v-list`)
    .filter({ hasText: 'Logout' });
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
  async ({ page, request }, testInfo) => {
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${crypto.randomUUID()}`;
    const username = `e2e-fixture-home-account-register-${suffix}`;
    const password = 'account-e2e-password';
    let account: RegisteredAccount | undefined;
    try {
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
      const registrationResponse = await registerResponse;
      expect(registrationResponse.ok()).toBeTruthy();
      const registration = (await registrationResponse.json()).data as {
        passport: { user: { id: RegisteredAccount['id'] }; roles: RegisteredAccount['roles'] };
        jwt: { accessToken: string };
      };
      account = {
        id: registration.passport.user.id,
        username,
        password,
        accessToken: registration.jwt.accessToken,
        roles: registration.passport.roles,
      };
      expect(account.id).toEqual(expect.anything());
      expect(account.accessToken).toEqual(expect.any(String));

      await expect(
        page.getByText('Check your email to activate your account before signing in.', {
          exact: true,
        }),
      ).toBeVisible();
      await page.getByRole('button', { name: 'Back to login', exact: true }).click();
      await expect(page).toHaveURL(/\/login(?:\?|$)/);
      expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
    } finally {
      if (account) {
        await removeAccountFixture(request, account);
      }
    }
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
    let account: RegisteredAccount | undefined;
    try {
      account = await registerAccountUser(
        request,
        testInfo,
        'e2e-fixture-home-account',
        registered => {
          account = registered;
        },
      );
      expect(account.roles.map(role => role.name)).toContain('registeredUser');
      const pageErrors = collectPageErrors(page);
      const consoleErrors = collectConsoleErrors(page);
      await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
      await loginAccountFromPage(page, account, accountPath);

      const username = page.getByRole('textbox', { name: 'User name', exact: true });
      await expect(username).toHaveValue(account.username);
      await expect(username).toHaveAttribute('readonly', '');
      const displayName = page.getByRole('textbox', { name: 'Display name', exact: true });
      await expect(displayName).toHaveValue('');
      const profileName = `e2e-fixture-home-account-profile-${testInfo.workerIndex}-${crypto.randomUUID()}`;
      await displayName.fill(`  ${profileName}  `);
      await page.getByLabel('Time zone').fill('UTC');
      const profileResponse = waitForApiResponse(page, 'PATCH', accountProfileApiPath);
      const passportResponse = waitForApiResponse(page, 'GET', passportCurrentApiPath);
      await page.getByRole('button', { name: 'Save profile', exact: true }).click();
      const savedProfile = await profileResponse;
      expect(savedProfile.ok()).toBeTruthy();
      expect(savedProfile.request().postDataJSON()).toMatchObject({ displayName: profileName });
      expect(savedProfile.request().postDataJSON()).not.toHaveProperty('name');
      expect((await savedProfile.json()).data).toMatchObject({
        name: account.username,
        displayName: profileName,
      });
      expect((await passportResponse).ok()).toBeTruthy();
      await expect(page.getByText('Profile saved.', { exact: true })).toBeVisible();
      await expect(username).toHaveValue(account.username);
      await expect(displayName).toHaveValue(profileName);

      await page.goto('/', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      const list = await openUserMenu(page, profileName);
      await expect(list.locator(':scope > .v-list-item')).toHaveText([
        'Account Settings',
        'Logout',
      ]);
      await list.getByRole('link', { name: 'Account Settings', exact: true }).click();
      await expect(page).toHaveURL(/\/home\/user\/account$/);
      await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'User name', exact: true })).toHaveValue(
        account.username,
      );

      const clearedProfileResponse = waitForApiResponse(page, 'PATCH', accountProfileApiPath);
      const clearedPassportResponse = waitForApiResponse(page, 'GET', passportCurrentApiPath);
      await page.getByRole('textbox', { name: 'Display name', exact: true }).fill('   ');
      await page.getByRole('button', { name: 'Save profile', exact: true }).click();
      const clearedProfile = await clearedProfileResponse;
      expect(clearedProfile.ok()).toBeTruthy();
      expect((await clearedPassportResponse).ok()).toBeTruthy();
      expect(clearedProfile.request().postDataJSON()).toMatchObject({ displayName: null });
      expect((await clearedProfile.json()).data).toMatchObject({
        name: account.username,
      });
      await page.goto('/', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await openUserMenu(page, account.username);

      const originalLogin = await loginAsAccount(request, account.username, account.password);
      expect(String(originalLogin.id)).toBe(String(account.id));
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    } finally {
      if (account) await removeAccountFixture(request, account);
    }
  },
);

test(
  'ATP-ACCOUNT-SSR-02: signed-in Account session SSR hydrates without mismatch',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }, testInfo) => {
    let account: RegisteredAccount | undefined;
    try {
      account = await registerAccountUser(
        request,
        testInfo,
        'e2e-fixture-home-account',
        registered => {
          account = registered;
        },
      );
      expect(account.roles.map(role => role.name)).toContain('registeredUser');
      const pageErrors = collectPageErrors(page);
      const consoleErrors = collectConsoleErrors(page);
      await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
      await loginAccountFromPage(page, account, accountPath);
      await page.evaluate(() => {
        const passport = JSON.parse(localStorage.getItem('passport')!);
        passport.user.displayName = 'stale-local-display-name';
        localStorage.setItem('passport', JSON.stringify(passport));
      });
      const response = await page.reload({ waitUntil: 'load' });
      expect(response?.ok()).toBeTruthy();
      const html = await response!.text();
      expect(html).toContain('Account Settings');
      expect(html).toContain('data-testid="layout-mine"');
      expect(html).toContain('data-testid="mine-navigation"');
      expect(response!.headers()['cache-control']).toBe('private, no-store');
      expect(html).not.toContain('stale-local-display-name');
      const serverUser = await page.evaluate(html => {
        const document = new DOMParser().parseFromString(html, 'text/html');
        const activator = document.querySelector('[data-header-action="account"]');
        return {
          displayName: activator?.querySelector('.header-account-name')?.textContent,
          hasAvatar: !!activator?.querySelector('.v-avatar'),
        };
      }, html);
      expect(serverUser.displayName).toBe(account.username);
      expect(serverUser.hasAvatar).toBe(true);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      const userActivator = page
        .getByTestId('header-actions')
        .locator('[data-header-action="account"]');
      await expect(userActivator.locator('.header-account-name')).toHaveText(account.username);
      await expect(userActivator).not.toContainText('stale-local-display-name');
      await expect
        .poll(() =>
          userActivator.locator('.v-avatar img').evaluate(image => ({
            complete: (image as HTMLImageElement).complete,
            naturalWidth: (image as HTMLImageElement).naturalWidth,
          })),
        )
        .toMatchObject({ complete: true, naturalWidth: expect.any(Number) });
      await expect
        .poll(() =>
          userActivator
            .locator('.v-avatar img')
            .evaluate(image => (image as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
      await expect(page.getByTestId('layout-mine')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
      const navigation = page.getByTestId('mine-navigation');
      await expect(navigation.getByRole('link')).toHaveText(minePages.map(item => item.title));
      for (const item of minePages) {
        await expect(
          navigation.getByRole('link', { name: item.title, exact: true }),
        ).toHaveAttribute('href', item.path);
      }
      await expect(
        navigation.getByRole('link', { name: 'Account Settings', exact: true }),
      ).toHaveAttribute('aria-current', 'page');
      await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
      for (const item of minePages.slice(1)) {
        const link = navigation.getByRole('link', { name: item.title, exact: true });
        await link.click();
        await expect(page).toHaveURL(item.path);
        await expect(page.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
        await expect(link).toHaveAttribute('aria-current', 'page');
        await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
        const reloaded = await page.reload({ waitUntil: 'load' });
        expect(reloaded?.ok()).toBeTruthy();
        const reloadedHtml = await reloaded!.text();
        expect(reloadedHtml).toContain('data-testid="layout-mine"');
        expect(reloadedHtml).toContain('data-testid="mine-navigation"');
        await expect(page).toHaveURL(item.path);
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
        await expect(page.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
        await expect(link).toHaveAttribute('aria-current', 'page');
        await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
      }
      await expectNoHorizontalOverflow(page);

      const headerActions = page.getByTestId('header-actions');
      const more = headerActions.getByTestId('header-actions-more');
      const panel = headerActions.locator('.header-actions-panel');
      const toggle = page.getByTestId('mine-menu-toggle');
      await expect(more).toBeHidden();
      await expect(panel).toBeVisible();
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(navigation).toBeHidden();
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(more).toBeVisible();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expectNoHorizontalOverflow(page);

      const list = await openUserMenu(page, account.username);
      await expectNoHorizontalOverflow(page);
      const accountButton = headerActions.getByRole('button', { name: 'Account', exact: true });
      // VMenu teleports its list outside the header; Escape must close only that overlay first.
      await list.getByRole('link', { name: 'Account Settings', exact: true }).focus();
      await page.keyboard.press('Escape');
      await expect(list).toBeHidden();
      await expect(accountButton).toHaveAttribute('aria-expanded', 'false');
      await expect(accountButton).toBeFocused();
      await expect(panel).toBeVisible();
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await accountButton.press('Escape');
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(more).toBeFocused();
      const heading = page.getByRole('heading', { name: 'MCP access tokens', exact: true });
      await more.click();
      await expect(panel).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await heading.click({ position: { x: 0, y: 0 } });
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(navigation).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await more.click();
      await expect(panel).toBeVisible();
      await expect(navigation).toBeHidden();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(navigation).toBeVisible();
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await navigation.getByRole('link', { name: 'Account Settings', exact: true }).click();
      await expect(page).toHaveURL(accountPath);
      await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
      await expect(navigation).toBeHidden();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expectNoHorizontalOverflow(page);
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    } finally {
      if (account) await removeAccountFixture(request, account);
    }
  },
);

test(
  'ATP-MINE-TOKEN-01: Browser Back clears the one-time token reveal before revisiting Mine',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page, request }, testInfo) => {
    let account: RegisteredAccount | undefined;
    let tokenId: number | string | undefined;
    const name = `e2e-fixture-mine-token-${testInfo.workerIndex}-${crypto.randomUUID()}`;
    try {
      account = await registerAccountUser(
        request,
        testInfo,
        'e2e-fixture-home-account',
        registered => {
          account = registered;
        },
      );
      const pageErrors = collectPageErrors(page);
      const consoleErrors = collectConsoleErrors(page);
      await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
      await loginAccountFromPage(page, account, accountPath);
      const navigation = page.getByTestId('mine-navigation');
      await navigation.getByRole('link', { name: 'MCP access tokens', exact: true }).click();
      await expect(page).toHaveURL(accessTokensPath);
      await page.getByTestId('mcp-access-token-create').click();
      await expect(page.getByTestId('mcp-access-token-create-form')).toBeVisible();
      // Vuetify test IDs belong to the field wrappers, not their native input elements.
      await page.getByTestId('mcp-access-token-name').locator('input').fill(name);
      const created = waitForApiResponse(page, 'POST', `${accessTokenApiPath}/createMine`);
      await page.getByTestId('mcp-access-token-create-submit').click();
      const response = await created;
      // Browser JSON mutations use the standard response envelope; fixture GETs return raw data.
      const token = (await response.json()).data as {
        id: number | string;
        accessToken: string;
      };
      tokenId = token.id;
      expect(tokenId != null).toBe(true);
      expect(typeof token.accessToken === 'string' && token.accessToken.length > 0).toBe(true);
      expect(response.headers()['cache-control']).toContain('no-store');
      // Boolean-only assertions avoid retaining the reveal dialog's accessibility snapshot.
      await expect.poll(() => page.getByTestId('mcp-access-token-reveal').isVisible()).toBe(true);
      expect(
        await page
          .getByTestId('mcp-access-token-secret')
          .locator('textarea:not([aria-hidden="true"])')
          .evaluate(
            (input: HTMLTextAreaElement, secret) => input.readOnly && input.value === secret,
            token.accessToken,
          ),
      ).toBe(true);

      // Leave the modal open: browser history, not its Close action, must clear the secret.
      await page.goBack({ waitUntil: 'load' });
      await expectTokenSecretAbsent(page, token.accessToken);
      await expect(page).toHaveURL(accountPath);
      await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
      await navigation.getByRole('link', { name: 'MCP access tokens', exact: true }).click();
      await expectTokenSecretAbsent(page, token.accessToken);
      await expect(page).toHaveURL(accessTokensPath);
      const row = page.getByTestId('mcp-access-token-row').filter({ hasText: name });
      await expect(row).toHaveCount(1);
      await expect(row).toHaveAttribute('data-mcp-access-token-id', String(tokenId));
      await expect(row).toContainText('mcp:read');
      const reloaded = await page.reload({ waitUntil: 'load' });
      expect(reloaded?.ok()).toBeTruthy();
      expect((await reloaded!.text()).includes(token.accessToken)).toBe(false);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expectTokenSecretAbsent(page, token.accessToken);
      await expect(row).toBeVisible();
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    } finally {
      if (account) {
        const fixture = account;
        await runCleanup([
          async () => {
            // Recover the exact named token if creation succeeded before its response was read.
            const mineResponse = await requestApi(request, 'GET', `${accessTokenApiPath}/mine`, {
              accessToken: fixture.accessToken,
              params: { pageNo: 1, pageSize: 100 },
            });
            expect(mineResponse.ok()).toBe(true);
            const mine = (await mineResponse.json()) as {
              list: Array<{ id: number | string; name: string }>;
            };
            const owned = mine.list.filter(item =>
              tokenId === undefined ? item.name === name : String(item.id) === String(tokenId),
            );
            for (const item of owned) {
              const deleted = await requestApi(
                request,
                'DELETE',
                `${accessTokenApiPath}/deleteMine/${item.id}`,
                {
                  accessToken: fixture.accessToken,
                },
              );
              expect(deleted.ok()).toBe(true);
            }
          },
          async () => removeAccountFixture(request, fixture),
        ]);
      }
    }
  },
);

for (const flavor of ['web', 'admin'] as const) {
  test(
    `ATP-ACCOUNT-LOGOUT-${flavor.toUpperCase()}-01: rejected logout shows an error and preserves authentication`,
    { tag: ['@account', `@${flavor}`, '@flow'] },
    async ({ page, request }, testInfo) => {
      let account: RegisteredAccount | undefined;
      const logoutRoute = (url: URL) => url.pathname === '/api/home/user/passport/logout';
      const errorMessage = 'This operation is forbidden in demonstration mode';
      let rejectedRequests = 0;
      let releaseFirstRequest!: () => void;
      const firstRequestReleased = new Promise<void>(resolve => {
        releaseFirstRequest = resolve;
      });
      const rejectLogout = async (route: Route) => {
        if (route.request().method() !== 'POST') return route.continue();
        rejectedRequests++;
        if (rejectedRequests === 1) await firstRequestReleased;
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ code: 'demo-demonstration:1001', message: errorMessage }),
        });
      };
      try {
        if (flavor === 'web') {
          account = await registerAccountUser(
            request,
            testInfo,
            'e2e-fixture-home-account',
            registered => {
              account = registered;
            },
          );
        }
        const pageErrors = collectPageErrors(page);
        const consoleErrors = collectConsoleErrors(page, [
          /server responded with a status of 403/i,
        ]);
        const loginPath = flavor === 'admin' ? '/admin/login' : '/login';
        // Establish compact geometry before mounting the authenticated header. A resize
        // immediately after login can otherwise dismiss the panel just opened by the helper.
        await page.setViewportSize({ width: 390, height: 900 });
        await page.goto(loginPath, { waitUntil: 'load' });
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', flavor);
        await page.getByLabel('Your Username').fill(account?.username ?? 'admin');
        await page.getByLabel('Your Password').fill(account?.password ?? '123456');
        await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
        const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
        await page.getByRole('button', { name: 'Login', exact: true }).click();
        expect((await loginResponse).ok()).toBeTruthy();
        await expect(page).not.toHaveURL(new RegExp(`${loginPath}(?:\\?|$)`));
        const signedInUrl = page.url();
        const token = (await page.context().cookies()).find(
          cookie => cookie.name === 'token',
        )?.value;
        expect(token).toBeTruthy();

        await page.route(logoutRoute, rejectLogout);
        let list = await openUserMenu(page, account?.username ?? 'admin');
        await expect(list.locator(':scope > .v-list-item')).toHaveText([
          'Account Settings',
          'Logout',
        ]);
        let logout = list.getByRole('button', { name: 'Logout', exact: true, includeHidden: true });
        await logout.click();
        await expect.poll(() => rejectedRequests).toBe(1);
        await expect(page.getByTestId('header-actions-more')).toHaveAttribute(
          'aria-expanded',
          'false',
        );
        await expect(
          page.getByTestId('header-actions').locator('.header-actions-panel'),
        ).toBeHidden();
        await expect(list).toBeHidden();
        // Crossing the breakpoint must not replace the ZButton that owns the pending logout.
        const pendingLogout = await logout.elementHandle();
        expect(pendingLogout).not.toBeNull();
        try {
          for (const width of [1024, 390]) {
            await page.setViewportSize({ width, height: 900 });
            // Resize dismissal runs in the browser's rendering step, not the viewport command.
            await page.evaluate(
              () => new Promise<void>(resolve => requestAnimationFrame(() => resolve())),
            );
            await expect(logout).toBeDisabled();
            await expect(logout).toHaveAttribute('aria-busy', 'true');
            expect(
              await logout.evaluate((element, original) => element === original, pendingLogout),
            ).toBe(true);
          }
        } finally {
          await pendingLogout?.dispose();
        }
        list = await openUserMenu(page, account?.username ?? 'admin');
        logout = list.getByRole('button', { name: 'Logout', exact: true, includeHidden: true });
        await expect(logout).toBeDisabled();
        await expect(logout).toHaveAttribute('aria-busy', 'true');
        expect(rejectedRequests).toBe(1);
        releaseFirstRequest();

        for (let attempt = 1; attempt <= 2; attempt++) {
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible();
          await expect(dialog).toContainText(errorMessage);
          expect(rejectedRequests).toBe(attempt);
          expect(page.url()).toBe(signedInUrl);
          expect(
            (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value,
          ).toBe(token);
          await dialog.getByRole('button', { name: 'Close', exact: true }).click();
          await expect(dialog).toHaveCount(0);
          if (attempt === 2) break;
          list = await openUserMenu(page, account?.username ?? 'admin');
          logout = list.getByRole('button', { name: 'Logout', exact: true, includeHidden: true });
          await expect(logout).toBeEnabled();
          const requestCount = rejectedRequests;
          await logout.click();
          await expect.poll(() => rejectedRequests).toBe(requestCount + 1);
        }

        list = await openUserMenu(page, account?.username ?? 'admin');
        const accountResponse = waitForApiResponse(page, 'GET', accountApiPath);
        await list.getByRole('link', { name: 'Account Settings', exact: true }).click();
        expect((await accountResponse).ok()).toBeTruthy();
        await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
        await page.unroute(logoutRoute, rejectLogout);
        if (flavor === 'web') {
          await page.goto('/', { waitUntil: 'load' });
          await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
          list = await openUserMenu(page, account!.username);
          logout = list.getByRole('button', { name: 'Logout', exact: true, includeHidden: true });
          const logoutResponse = waitForApiResponse(page, 'POST', '/api/home/user/passport/logout');
          await logout.click();
          expect((await logoutResponse).ok()).toBeTruthy();
          await expect(page).toHaveURL(/\/login(?:\?|$)/);
          await expect(page.getByText('Logout', { exact: true })).toHaveCount(0);
          expect(
            (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value,
          ).toBeFalsy();
          await page.goto(accountPath, { waitUntil: 'load' });
          await expect(page).toHaveURL(/\/login(?:\?|$)/);
        }
        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
      } finally {
        releaseFirstRequest();
        if (!page.isClosed()) await page.unroute(logoutRoute, rejectLogout);
        if (account) await removeAccountFixture(request, account);
      }
    },
  );
}

test(
  'ATP-ACCOUNT-ADMIN-01: Admin Account Settings precedes Logout',
  { tag: ['@account', '@admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    const list = await openUserMenu(page, 'admin');
    await expect(list.locator(':scope > .v-list-item')).toHaveText(['Account Settings', 'Logout']);
    await list.getByRole('link', { name: 'Account Settings', exact: true }).click();
    await expect(page).toHaveURL('/admin/home/user/account');
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    await expect(page.getByTestId('layout-mine')).toBeVisible();
    const navigation = page.getByTestId('mine-navigation');
    await expect(navigation.getByRole('link')).toHaveText(minePages.map(item => item.title));
    for (const item of minePages) {
      await expect(navigation.getByRole('link', { name: item.title, exact: true })).toHaveAttribute(
        'href',
        `/admin${item.path}`,
      );
    }
    const scopes = navigation.getByRole('link', { name: 'MCP scopes', exact: true });
    await scopes.click();
    await expect(page).toHaveURL('/admin/cabloy/mcp/scopes');
    await expect(page.getByRole('heading', { name: 'MCP scopes', exact: true })).toBeVisible();
    await expect(scopes).toHaveAttribute('aria-current', 'page');
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
    const response = await page.reload({ waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    const html = await response!.text();
    expect(html).toContain('data-testid="layout-mine"');
    expect(html).toContain('data-testid="mine-navigation"');
    await expect(page).toHaveURL('/admin/cabloy/mcp/scopes');
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(navigation).toBeVisible();
    await expect(scopes).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'MCP scopes', exact: true })).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);

test.describe('Account errorExpired recovery', () => {
  for (const scenario of ['missing refresh credentials', 'refresh 401', 'real refresh'] as const) {
    test(
      `errorExpired: ${scenario}`,
      { tag: ['@account', '@web', '@flow'] },
      async ({ page, request }, testInfo) => {
        let account: RegisteredAccount | undefined;
        const missingRefresh = scenario === 'missing refresh credentials';
        const realRefresh = scenario === 'real refresh';
        const returnTo = `${accountPath}?recovery=${scenario.replaceAll(' ', '-')}`;
        const refreshPath = '/api/home/user/passport/refreshAuthToken';
        const pageErrors = collectPageErrors(page);
        const consoleErrors = collectConsoleErrors(page, [
          /server responded with a status of 401/i,
        ]);
        let refreshRequests = 0;
        const origin = new URL(testInfo.project.use.baseURL!).origin;
        page.on('request', outgoing => {
          const url = new URL(outgoing.url());
          if (
            url.origin === origin &&
            url.pathname === refreshPath &&
            outgoing.method() === 'POST' &&
            !outgoing.headers()['x-vona-openapi-schema']
          ) {
            refreshRequests++;
          }
        });
        try {
          account = await registerAccountUser(
            request,
            testInfo,
            'e2e-fixture-home-account',
            registered => {
              account = registered;
            },
          );
          await page.goto(`/login?${new URLSearchParams({ returnTo })}`, {
            waitUntil: 'load',
          });
          await loginAccountFromPage(page, account, returnTo);
          expect(refreshRequests).toBe(0);
          expect(
            await page.evaluate(missing => {
              const jwt = localStorage.getItem('jwt');
              const expires = localStorage.getItem('expireTime');
              if (
                !jwt ||
                !JSON.parse(jwt)?.refreshToken ||
                !expires ||
                typeof JSON.parse(expires) !== 'number' ||
                localStorage.getItem('passport') === null
              ) {
                return false;
              }
              if (missing) {
                localStorage.removeItem('jwt');
              } else {
                // Retain genuine credentials; expire only the browser's persisted deadline.
                localStorage.setItem('expireTime', JSON.stringify(Date.now() - 60_000));
              }
              return true;
            }, missingRefresh),
          ).toBe(true);
          expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(
            true,
          );
          if (!missingRefresh && !realRefresh) {
            await page.route(
              url => url.origin === origin && url.pathname === refreshPath,
              async route => {
                if (
                  route.request().method() !== 'POST' ||
                  route.request().headers()['x-vona-openapi-schema']
                ) {
                  await route.fallback();
                  return;
                }
                await route.fulfill({
                  status: 401,
                  contentType: 'application/json',
                  headers: { 'cache-control': 'no-store' },
                  body: JSON.stringify({ code: 401, message: 'Unauthorized' }),
                });
              },
            );
          }
          const refreshResponse = missingRefresh
            ? undefined
            : waitForApiResponse(page, 'POST', refreshPath, false);
          await page.goto(`/home/base/errorExpired?${new URLSearchParams({ returnTo })}`, {
            waitUntil: 'load',
          });
          if (refreshResponse) {
            expect((await refreshResponse).status()).toBe(realRefresh ? 200 : 401);
          }
          if (realRefresh) {
            await expect(page).toHaveURL(returnTo);
            await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
            await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
            expect(
              await page.evaluate(() => {
                const expires = localStorage.getItem('expireTime');
                return !!expires && JSON.parse(expires) > Date.now();
              }),
            ).toBe(true);
            expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(
              true,
            );
            expect(refreshRequests).toBe(1);
          } else {
            const expectRecoveryLogin = async () => {
              await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
              const url = new URL(page.url());
              expect(url.pathname).toBe('/login');
              expect(url.searchParams.get('returnTo')).toBe(returnTo);
              await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
            };
            await expectRecoveryLogin();
            await expect
              .poll(async () => {
                return (await page.context().cookies()).some(cookie => cookie.name === 'token');
              })
              .toBe(false);
            expect(
              await page.evaluate(() => {
                return ['jwt', 'passport', 'expireTime'].every(
                  key => localStorage.getItem(key) === null,
                );
              }),
            ).toBe(true);
            expect(refreshRequests).toBe(missingRefresh ? 0 : 1);
            await page.reload({ waitUntil: 'load' });
            await expectRecoveryLogin();
            expect(refreshRequests).toBe(missingRefresh ? 0 : 1);
            await loginAccountFromPage(page, account, returnTo);
            expect(refreshRequests).toBe(missingRefresh ? 0 : 1);
          }
          expect(pageErrors).toEqual([]);
          expect(consoleErrors).toEqual([]);
        } finally {
          if (account) await removeAccountFixture(request, account);
        }
      },
    );
  }
});
