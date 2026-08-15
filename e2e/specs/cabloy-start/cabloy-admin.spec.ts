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

function waitForDepartmentResponse(page: Page, method: string, pathname: RegExp) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return response.request().method() === method && response.ok() && pathname.test(url.pathname);
  });
}

async function requestDepartment(
  page: Page,
  method: 'POST' | 'DELETE',
  pathname: string,
  body?: Record<string, unknown>,
) {
  const responsePromise = waitForDepartmentResponse(page, method, new RegExp(`^${pathname}$`));
  await page.evaluate(
    async ({ method, pathname, body }) => {
      const tokenCookie = document.cookie.split('; ').find(item => item.startsWith('token='));
      const token = tokenCookie
        ? decodeURIComponent(tokenCookie.slice('token='.length))
        : undefined;
      if (!token) throw new Error('Missing authenticated browser token');
      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, pathname);
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        if (body) request.setRequestHeader('Content-Type', 'application/json');
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) resolve();
          else reject(new Error(`Department fixture request failed: ${request.status}`));
        };
        request.onerror = () => reject(new Error('Department fixture request failed'));
        request.send(body ? JSON.stringify(body) : undefined);
      });
    },
    { method, pathname, body },
  );
  return await responsePromise;
}

async function createDepartment(page: Page, name: string, parentId?: number | string) {
  const response = await requestDepartment(page, 'POST', '/api/admin/department', {
    name,
    parentId: parentId ?? null,
  });
  return (await response.json()).data as number | string;
}

async function deleteDepartment(page: Page, id: number | string) {
  await requestDepartment(page, 'DELETE', `/api/admin/department/${id}`);
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
  'ATP-ADM-RES-01: Start Admin Resources render account projections and refresh Department state after Move',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const suffix = `${test.info().workerIndex}-${Date.now()}`;
    const rootA = `ATP Root A ${suffix}`;
    const rootB = `ATP Root B ${suffix}`;
    const child = `ATP Child ${suffix}`;
    await loginAsAdmin(page);

    await page.goto('/admin/rest/resource/admin-user%3Auser/1', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByText('Roles', { exact: true })).toBeVisible();
    await expect(page.getByText('Department Memberships', { exact: true })).toBeVisible();

    let rootAId: number | string | undefined;
    let rootBId: number | string | undefined;
    let childId: number | string | undefined;
    try {
      rootAId = await createDepartment(page, rootA);
      rootBId = await createDepartment(page, rootB);
      childId = await createDepartment(page, child, rootAId);

      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const childRow = page.getByRole('row').filter({ hasText: child });
      await expect(childRow).toBeVisible();
      await childRow.getByRole('button', { name: 'Move Department', exact: true }).click();

      const moveDialog = page.getByRole('dialog');
      await expect(moveDialog).toBeVisible();
      await moveDialog.getByText(rootB, { exact: true }).click();
      const moved = waitForDepartmentResponse(
        page,
        'PUT',
        /\/api\/admin\/department\/[^/]+\/move$/,
      );
      await moveDialog.getByRole('button', { name: 'Move Department', exact: true }).click();
      await moved;
      await expect(moveDialog).toBeHidden();

      const departmentTree = page.getByLabel('All Departments');
      const departmentRows = page.getByRole('table').getByRole('row');
      await departmentTree.getByText(rootA, { exact: true }).click();
      await expect(departmentRows.filter({ hasText: child })).toHaveCount(0);
      await departmentTree.getByText(rootB, { exact: true }).click();
      await expect(departmentRows.filter({ hasText: child })).toBeVisible();
      expect(pageErrors).toEqual([]);
    } finally {
      if (childId !== undefined) await deleteDepartment(page, childId);
      if (rootBId !== undefined) await deleteDepartment(page, rootBId);
      if (rootAId !== undefined) await deleteDepartment(page, rootAId);
    }
  },
);
