import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
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

function resourcePath(resource: string) {
  return `/admin/rest/resource/${encodeURIComponent(resource)}`;
}

async function openDepartmentDetail(page: Page) {
  await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
  await expect(page.getByText('No data available', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByLabel('Department Name', { exact: true })).toBeVisible();
}

test(
  'ATP-ADM-SSR-01: Start Admin redirects, server-renders, and hydrates approved resources',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page, request }) => {
    const anonymousResponse = await request.get('/admin/', { maxRedirects: 0 });
    expect(anonymousResponse.status()).toBe(302);
    expect(anonymousResponse.headers()['cache-control']).toBe('private, no-store');
    expect(anonymousResponse.headers().location).toMatch(/^\/admin\/login(?:\?|$)/);

    const loginResponse = await request.get(anonymousResponse.headers().location!);
    expect(loginResponse.ok()).toBeTruthy();
    const loginHtml = await loginResponse.text();
    expect(loginHtml).toContain('data-server-rendered');
    expect(loginHtml.toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await expect(page.getByText('System Management', { exact: true })).toBeVisible();
    for (const [name, resource] of [
      ['User', 'admin-user:user'],
      ['Role', 'admin-role:role'],
      ['Department', 'admin-department:department'],
    ] as const) {
      await page.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(resource.replace(':', '(?:%3A|:|%253A)')));
      await page.goto('/admin/', { waitUntil: 'load' });
    }
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-ADM-RES-01: Start Admin Resources render account projections and Department entry',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    await page.goto('/admin/rest/resource/admin-user%3Auser/1', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByText('Roles', { exact: true })).toBeVisible();
    await expect(page.getByText('Department Memberships', { exact: true })).toBeVisible();

    await openDepartmentDetail(page);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByLabel('Department Name', { exact: true })).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);
