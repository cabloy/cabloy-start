import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

import { loginAsAdmin as loginAsAdminApi } from './helpers/cabloy-admin-api.ts';

test.describe.configure({ mode: 'serial' });

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', message => {
    const text = message.text();
    if (message.type() === 'error' || /hydration mismatch/i.test(text)) {
      errors.push(text);
    }
  });
  return errors;
}

function waitForCaptchaCreate(page: Page) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return response.request().method() === 'POST' && response.ok() && url.pathname === '/api/captcha/create';
  });
}

async function loginAsAdmin(page: Page) {
  const captchaCreated = waitForCaptchaCreate(page);
  const response = await page.goto('/commerce-admin/login', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await captchaCreated;
  await page.getByLabel('Your Username').fill('admin');
  await page.getByLabel('Your Password').fill('123456');
  await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).not.toHaveURL(/\/commerce-admin\/login(?:\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce-admin');
  await page.goto('/commerce-admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce-admin');
}

test('ATP-COM-SKU-01: Commerce Admin admits operators and renders Product-owned SKU details', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);
  const anonymousResponse = await page.goto('/commerce-admin/', { waitUntil: 'load' });
  expect(anonymousResponse?.status()).toBe(200);
  await expect(page).toHaveURL(/\/commerce-admin\/login(?:\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('data-server-rendered', 'true');
  await expect(page.locator('html')).not.toHaveAttribute('data-zova-hydrated');

  const admin = await loginAsAdminApi(request);
  await page.context().addCookies([{ name: 'token', value: admin.accessToken, url: 'http://localhost:9104' }]);
  await page.goto('/commerce-admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce-admin');
  await expect(page.getByText('Catalog', { exact: true })).toBeVisible();
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.getByText('System Management', { exact: true })).toHaveCount(0);
  await expect(page.getByText('User', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Role', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Department', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Metrics', { exact: true })).toHaveCount(0);

  const response = await page.goto(
    '/commerce-admin/rest/resource/commerce-catalog%3Aproduct/1/edit',
    { waitUntil: 'load' },
  );
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce-admin');
  await expect(page.getByText('Attribute Key', { exact: true })).toBeVisible();
  await expect(page.getByText('SKU Code', { exact: true })).toBeVisible();
  await expect(page.getByText('Price (minor units)', { exact: true })).toBeVisible();
  await expect(page.getByText('SKU Lifecycle', { exact: true })).toBeVisible();
  await expect(page.getByText('[object Object]', { exact: true })).toHaveCount(0);
  await expect(page.getByText('No data available', { exact: true })).toHaveCount(0);
  await expect(page.locator('text=SKU Code')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
});
