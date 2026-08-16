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

function waitForApiResponse(page: Page, method: string, pathname: RegExp, requireOk = true) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === method &&
      (!requireOk || response.ok()) &&
      pathname.test(url.pathname)
    );
  });
}

async function requestApi(
  page: Page,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  pathname: string,
  body?: Record<string, unknown>,
) {
  const responsePromise = waitForApiResponse(page, method, new RegExp(`^${pathname}$`), false);
  await page.evaluate(
    async ({ method, pathname, body }) => {
      const tokenCookie = document.cookie.split('; ').find(item => item.startsWith('token='));
      const token = tokenCookie
        ? decodeURIComponent(tokenCookie.slice('token='.length))
        : undefined;
      if (!token) throw new Error('Missing authenticated browser token');
      const hasRequestBody = method !== 'GET';
      await fetch(pathname, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasRequestBody ? { 'Content-Type': 'application/json' } : {}),
        },
        body: hasRequestBody ? JSON.stringify(body ?? {}) : undefined,
      });
    },
    { method, pathname, body },
  );
  const response = await responsePromise;
  if (!response.ok()) {
    throw new Error(`API fixture request failed: ${response.status()}`);
  }
  return response;
}

async function createDepartment(page: Page, name: string, parentId?: number | string) {
  const response = await requestApi(page, 'POST', '/api/admin/department', {
    name,
    parentId: parentId ?? null,
  });
  return (await response.json()).data as number | string;
}

async function deleteDepartment(page: Page, id: number | string) {
  await requestApi(page, 'DELETE', `/api/admin/department/${id}`);
}

async function createMembership(
  page: Page,
  departmentId: number | string,
  userId: number | string,
  position?: string,
) {
  const response = await requestApi(page, 'POST', `/api/admin/department/${departmentId}/memberships`, {
    userId,
    position,
  });
  return (await response.json()).data as number | string;
}

async function deleteMembership(page: Page, departmentId: number | string, membershipId: number | string) {
  await requestApi(page, 'DELETE', `/api/admin/department/${departmentId}/memberships/${membershipId}`);
}

async function getAdminUserId(page: Page) {
  const response = await requestApi(page, 'GET', '/api/admin/user');
  const responseBody = (await response.json()) as {
    data?: { list?: Array<{ id: number | string; name: string }> };
    list?: Array<{ id: number | string; name: string }>;
  };
  const list = responseBody.data?.list ?? responseBody.list;
  expect(list).toBeDefined();
  const admin = list!.find(item => item.name === 'admin');
  expect(admin).toBeDefined();
  return admin!.id;
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
  'ATP-ADM-RES-02: Department details manage memberships and Edit updates the Department',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const suffix = `${test.info().workerIndex}-${Date.now()}`;
    const departmentName = `ATP Membership ${suffix}`;
    const initialPosition = 'E2E Member';
    const updatedPosition = 'E2E Member Updated';
    await loginAsAdmin(page);

    let departmentId: number | string | undefined;
    let emptyDepartmentId: number | string | undefined;
    let failedMembershipsDepartmentId: number | string | undefined;
    let membershipId: number | string | undefined;
    try {
      const adminUserId = await getAdminUserId(page);
      departmentId = await createDepartment(page, departmentName);
      emptyDepartmentId = await createDepartment(page, `${departmentName} Empty`);
      failedMembershipsDepartmentId = await createDepartment(page, `${departmentName} Failed Memberships`);
      membershipId = await createMembership(page, departmentId, adminUserId, initialPosition);

      await page.goto(`${resourcePath('admin-department:department')}/${departmentId}`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('admin', { exact: true })).toBeVisible();
      await expect(page.getByText(initialPosition, { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Edit Department', exact: true })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toBeVisible();
      const membershipRow = page.getByRole('row').filter({ hasText: initialPosition });
      await expect(membershipRow).toBeVisible();
      await expect(membershipRow.getByRole('button', { name: 'Edit Membership', exact: true })).toBeVisible();
      await expect(
        membershipRow.getByRole('button', { name: 'Set Primary Membership', exact: true }),
      ).toBeVisible();
      await expect(membershipRow.getByRole('button', { name: 'Set Manager', exact: true })).toBeVisible();
      await expect(membershipRow.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
      await expect(page.getByTestId('department-manager')).toHaveText('No manager assigned');
      await expect(page.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);

      await membershipRow.getByRole('button', { name: 'Edit Membership', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByLabel('Position').fill(updatedPosition);
      const updated = waitForApiResponse(
        page,
        'PATCH',
        new RegExp(`/api/admin/department/${departmentId}/memberships/${membershipId}$`),
      );
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      await updated;
      await expect(dialog).toBeHidden();
      await expect(page.getByText(updatedPosition, { exact: true })).toBeVisible();

      let genericDepartmentPatchRequests = 0;
      page.on('request', request => {
        const url = new URL(request.url());
        if (
          request.method() === 'PATCH' &&
          url.pathname === `/api/admin/department/${departmentId}`
        ) {
          genericDepartmentPatchRequests += 1;
        }
      });
      const updatedMembershipRow = page.getByRole('row').filter({ hasText: updatedPosition });
      const managerUpdated = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${departmentId}/manager$`),
      );
      await updatedMembershipRow.getByRole('button', { name: 'Set Manager', exact: true }).click();
      await managerUpdated;
      await expect(page.getByTestId('department-manager')).toHaveText('admin');
      await expect(
        updatedMembershipRow.getByRole('button', { name: 'Clear Manager', exact: true }),
      ).toBeVisible();
      expect(genericDepartmentPatchRequests).toBe(0);

      const managerCleared = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${departmentId}/manager$`),
      );
      await updatedMembershipRow.getByRole('button', { name: 'Clear Manager', exact: true }).click();
      await managerCleared;
      await expect(page.getByTestId('department-manager')).toHaveText('No manager assigned');
      await expect(
        updatedMembershipRow.getByRole('button', { name: 'Set Manager', exact: true }),
      ).toBeVisible();
      expect(genericDepartmentPatchRequests).toBe(0);

      await page.goto(`${resourcePath('admin-department:department')}/${departmentId}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Edit Membership', exact: true })).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: 'Set Primary Membership', exact: true }),
      ).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Set Manager', exact: true })).toHaveCount(0);
      await expect(page.getByTestId('department-manager')).toHaveCount(0);

      await page.goto(`${resourcePath('admin-department:department')}/${emptyDepartmentId}`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toBeVisible();

      const failedMembershipsPath = new RegExp(
        `/api/admin/department/${failedMembershipsDepartmentId}/memberships$`,
      );
      let failMembershipsRequest = true;
      let membershipsRequestCount = 0;
      await page.route(failedMembershipsPath, async route => {
        membershipsRequestCount += 1;
        if (failMembershipsRequest) {
          await route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Membership query intentionally failed for E2E coverage.' }),
          });
          return;
        }
        await route.continue();
      });
      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const failedMembershipsRow = page
        .getByRole('row')
        .filter({ hasText: `${departmentName} Failed Memberships` });
      await failedMembershipsRow
        .getByText(`${departmentName} Failed Memberships`, { exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`/${failedMembershipsDepartmentId}/?$`));
      await expect(page.getByText('Unable to load Department memberships.', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toHaveCount(0);

      failMembershipsRequest = false;
      const failedRequestCount = membershipsRequestCount;
      await page.getByRole('button', { name: 'Retry', exact: true }).click();
      await expect.poll(() => membershipsRequestCount).toBeGreaterThan(failedRequestCount);
      await page.unroute(failedMembershipsPath);
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toBeVisible();
      await expect(page.getByText('Unable to load Department memberships.', { exact: true })).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } finally {
      if (departmentId !== undefined && membershipId !== undefined) {
        await deleteMembership(page, departmentId, membershipId);
      }
      if (failedMembershipsDepartmentId !== undefined) {
        await deleteDepartment(page, failedMembershipsDepartmentId);
      }
      if (emptyDepartmentId !== undefined) await deleteDepartment(page, emptyDepartmentId);
      if (departmentId !== undefined) await deleteDepartment(page, departmentId);
    }
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
      const moved = waitForApiResponse(
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
