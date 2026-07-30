import type { Locator, Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

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
  const documentResponse = await page.goto('/admin/login', { waitUntil: 'load' });
  expect(documentResponse?.ok()).toBeTruthy();
  await captchaCreated;

  await page.getByLabel('Your Username').fill('admin');
  await page.getByLabel('Your Password').fill('123456');
  await expect(page.getByLabel('Please input captcha')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(page.getByText('Dashboard')).toBeVisible();
}

async function openStudentCreatePage(page: Page) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/,
  );
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student\/create(?:[/?#]|$)/,
  );
  await expect(page.getByRole('group', { name: 'Student Profile' })).toBeVisible();
}

interface IGridGeometry {
  row: { left: number; right: number; top: number; width: number };
  columns: Array<{ left: number; right: number; top: number; bottom: number; width: number }>;
  fieldset: { clientWidth: number; scrollWidth: number };
  document: { clientWidth: number; scrollWidth: number };
}

async function getGridGeometry(row: Locator): Promise<IGridGeometry> {
  return await row.evaluate(element => {
    const rowRect = element.getBoundingClientRect();
    const columns = Array.from(element.querySelectorAll(':scope > .v-col'));
    const fieldset = element.closest('fieldset')!;
    const documentElement = document.documentElement;
    return {
      row: { left: rowRect.left, right: rowRect.right, top: rowRect.top, width: rowRect.width },
      columns: columns.map(column => {
        const rect = column.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
        };
      }),
      fieldset: { clientWidth: fieldset.clientWidth, scrollWidth: fieldset.scrollWidth },
      document: {
        clientWidth: documentElement.clientWidth,
        scrollWidth: documentElement.scrollWidth,
      },
    };
  });
}

test(
  'ATP-START-SSR-01: anonymous Web HTML hydrates through the default site',
  { tag: ['@web', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toContain('data-server-rendered');
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByText('Web: en-us')).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-LOCALE-01: anonymous Web locale route hydrates through the default site',
  { tag: ['@web', '@smoke'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/zh-cn', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/zh-cn$/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-cn');
    await expect(page.getByText('Web: zh-cn')).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-SSR-02: anonymous Admin redirects to and hydrates the login page',
  { tag: ['@admin', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/admin/', { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    const loginPath = response.headers().location;
    expect(loginPath).toMatch(/^\/admin\/login(?:\?|$)/);

    const loginResponse = await request.get(loginPath!);
    expect(loginResponse.ok()).toBeTruthy();
    const html = await loginResponse.text();
    expect(html).toContain('data-server-rendered');
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/admin/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Your Username')).toBeVisible();
    await expect(page.getByLabel('Your Password')).toBeVisible();
    await expect(page.getByLabel('Please input captcha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-FLOW-01: admin logs in with the development captcha',
  { tag: ['@admin', '@smoke'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-LAYOUT-01: Admin drawer follows viewport breakpoint changes',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    const drawer = page.locator('.v-navigation-drawer--left');
    await expect(drawer).toHaveClass(/\bv-navigation-drawer--active\b/);

    await page.setViewportSize({ width: 700, height: 900 });
    await expect(drawer).not.toHaveClass(/\bv-navigation-drawer--active\b/);

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(drawer).toHaveClass(/\bv-navigation-drawer--active\b/);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-LAYOUT-02: Student create profile grid follows responsive column metadata',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    const tolerance = 4;
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await openStudentCreatePage(page);

    const studentProfile = page.getByRole('group', { name: 'Student Profile' });
    const row = studentProfile.locator('section > .v-row');
    await expect(row).toHaveCount(1);
    await expect(row.locator(':scope > .v-col')).toHaveCount(3);

    const wide = await getGridGeometry(row);
    expect(wide.columns[0]!.top).toBeCloseTo(wide.columns[1]!.top, 0);
    expect(wide.columns[2]!.top).toBeGreaterThan(wide.columns[0]!.top + tolerance);
    expect(wide.columns[1]!.left).toBeGreaterThanOrEqual(wide.columns[0]!.right - tolerance);
    expect(wide.columns[0]!.width / wide.row.width).toBeGreaterThan(0.45);
    expect(wide.columns[0]!.width / wide.row.width).toBeLessThan(0.55);
    expect(wide.columns[1]!.width / wide.row.width).toBeGreaterThan(0.45);
    expect(wide.columns[1]!.width / wide.row.width).toBeLessThan(0.55);
    expect(wide.fieldset.scrollWidth).toBeLessThanOrEqual(wide.fieldset.clientWidth + tolerance);
    expect(wide.document.scrollWidth).toBeLessThanOrEqual(wide.document.clientWidth + tolerance);

    await page.setViewportSize({ width: 700, height: 900 });
    await expect
      .poll(async () => {
        const { columns } = await getGridGeometry(row);
        return columns[0]!.top < columns[1]!.top && columns[1]!.top < columns[2]!.top;
      })
      .toBe(true);

    const narrow = await getGridGeometry(row);
    expect(narrow.columns[0]!.left).toBeCloseTo(narrow.columns[1]!.left, 0);
    expect(narrow.columns[1]!.left).toBeCloseTo(narrow.columns[2]!.left, 0);
    for (const column of narrow.columns) {
      expect(column.width / narrow.row.width).toBeGreaterThan(0.95);
      expect(column.width / narrow.row.width).toBeLessThan(1.05);
    }
    expect(narrow.fieldset.scrollWidth).toBeLessThanOrEqual(
      narrow.fieldset.clientWidth + tolerance,
    );
    expect(narrow.document.scrollWidth).toBeLessThanOrEqual(
      narrow.document.clientWidth + tolerance,
    );
    expect(pageErrors).toEqual([]);
  },
);
