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

async function getDepartment(page: Page, id: number | string) {
  const response = await requestApi(page, 'GET', `/api/admin/department/${id}`);
  const payload = (await response.json()) as { data?: { enabled: boolean }; enabled?: boolean };
  return (payload.data ?? payload) as { enabled: boolean };
}

async function createMembership(
  page: Page,
  departmentId: number | string,
  userId: number | string,
) {
  const response = await requestApi(
    page,
    'POST',
    `/api/admin/department/${departmentId}/memberships`,
    {
      userId,
    },
  );
  return (await response.json()).data as number | string;
}

async function deleteMembership(
  page: Page,
  departmentId: number | string,
  membershipId: number | string,
  managerMembershipId?: number | string | null,
) {
  await requestApi(
    page,
    'DELETE',
    `/api/admin/department/${departmentId}/memberships/${membershipId}`,
    managerMembershipId === undefined ? undefined : { managerMembershipId },
  );
}

async function createRole(page: Page, name: string) {
  const response = await requestApi(page, 'POST', '/api/admin/role', {
    name,
    title: name,
    siteIds: ['admin'],
  });
  return (await response.json()).data as { id: number | string };
}

interface UserRoleSummary {
  id: number | string;
  name: string;
  systemAdmin: boolean;
}

async function getUserRoles(page: Page, userId: number | string) {
  const response = await requestApi(page, 'GET', `/api/admin/user/${userId}`);
  const payload = (await response.json()) as {
    data?: { roles: UserRoleSummary[] };
    roles?: UserRoleSummary[];
  };
  const user = payload.data ?? payload;
  return user.roles!;
}

async function replaceUserRoles(
  page: Page,
  userId: number | string,
  roleIds: Array<number | string>,
) {
  await requestApi(page, 'PUT', `/api/admin/role/user/${userId}/roles`, { roleIds });
}

async function deleteRole(page: Page, roleId: number | string) {
  await requestApi(page, 'DELETE', `/api/admin/role/${roleId}`);
}

async function getRolePolicyConfiguration(page: Page, roleId: number | string) {
  const response = await requestApi(
    page,
    'GET',
    `/api/admin/rbac/rbacPolicy/roles/${roleId}/configuration`,
  );
  const payload = (await response.json()) as {
    data?: {
      list: Array<{
        actionKey: string;
        dataScopes: Array<{ dataScope: string; enabled: boolean }>;
      }>;
    };
    list?: Array<{
      actionKey: string;
      dataScopes: Array<{ dataScope: string; enabled: boolean }>;
    }>;
  };
  const configuration = payload.data ?? payload;
  if (!configuration.list) throw new Error('Missing role policy configuration');
  return configuration;
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
  'ATP-ADM-RES-02: Department details manage memberships',
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
      departmentId = await createDepartment(page, departmentName);
      emptyDepartmentId = await createDepartment(page, `${departmentName} Empty`);
      failedMembershipsDepartmentId = await createDepartment(
        page,
        `${departmentName} Failed Memberships`,
      );

      await page.goto(`${resourcePath('admin-department:department')}/${departmentId}`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByRole('link', { name: 'Edit Department', exact: true })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toBeVisible();
      await expect(page.getByTestId('department-manager')).toHaveText('No manager assigned');
      await expect(page.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);

      await page.getByRole('button', { name: 'Add Membership', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.locator('.v-select').click();
      await page.locator('.v-overlay__content').getByText('admin', { exact: true }).click();
      await dialog.getByLabel('Position').fill(initialPosition);
      const created = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/admin/department/${departmentId}/memberships$`),
      );
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const createdResponse = await created;
      membershipId = (await createdResponse.json()).data as number | string;
      await expect(dialog).toBeHidden();
      await expect(page.getByText('admin', { exact: true })).toBeVisible();
      await expect(page.getByText(initialPosition, { exact: true })).toBeVisible();

      const membershipRow = page.getByRole('row').filter({ hasText: initialPosition });
      await expect(membershipRow).toBeVisible();
      await expect(
        membershipRow.getByRole('button', { name: 'Edit Membership', exact: true }),
      ).toBeVisible();
      await expect(
        membershipRow.getByRole('button', { name: 'Set Primary Membership', exact: true }),
      ).toBeVisible();
      await expect(
        membershipRow.getByRole('button', { name: 'Set Manager', exact: true }),
      ).toBeVisible();
      await expect(
        membershipRow.getByRole('button', { name: 'Delete', exact: true }),
      ).toBeVisible();

      await membershipRow.getByRole('button', { name: 'Edit Membership', exact: true }).click();
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

      const updatedMembershipRow = page.getByRole('row').filter({ hasText: updatedPosition });
      const primarySet = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${departmentId}/memberships/${membershipId}/primary$`),
      );
      await updatedMembershipRow
        .getByRole('button', { name: 'Set Primary Membership', exact: true })
        .click();
      await primarySet;
      await expect(
        updatedMembershipRow.getByRole('button', { name: 'Clear Primary Membership', exact: true }),
      ).toBeVisible();

      const primaryCleared = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${departmentId}/memberships/${membershipId}/primary$`),
      );
      await updatedMembershipRow
        .getByRole('button', { name: 'Clear Primary Membership', exact: true })
        .click();
      await primaryCleared;
      await expect(
        updatedMembershipRow.getByRole('button', { name: 'Set Primary Membership', exact: true }),
      ).toBeVisible();

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
      await updatedMembershipRow
        .getByRole('button', { name: 'Clear Manager', exact: true })
        .click();
      await managerCleared;
      await expect(page.getByTestId('department-manager')).toHaveText('No manager assigned');
      await expect(
        updatedMembershipRow.getByRole('button', { name: 'Set Manager', exact: true }),
      ).toBeVisible();
      expect(genericDepartmentPatchRequests).toBe(0);

      const managerReset = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${departmentId}/manager$`),
      );
      await updatedMembershipRow.getByRole('button', { name: 'Set Manager', exact: true }).click();
      await managerReset;
      await expect(page.getByTestId('department-manager')).toHaveText('admin');

      let managerClearRequests = 0;
      page.on('request', request => {
        const url = new URL(request.url());
        if (
          request.method() === 'PUT' &&
          url.pathname === `/api/admin/department/${departmentId}/manager`
        ) {
          managerClearRequests += 1;
        }
      });
      await updatedMembershipRow.getByRole('button', { name: 'Delete', exact: true }).click();
      const confirmation = page.getByRole('dialog');
      await expect(
        confirmation.getByText('Delete this manager membership and clear the Department manager?', {
          exact: true,
        }),
      ).toBeVisible();
      const deleted = waitForApiResponse(
        page,
        'DELETE',
        new RegExp(`/api/admin/department/${departmentId}/memberships/${membershipId}$`),
      );
      await confirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const deletedResponse = await deleted;
      expect(deletedResponse.request().postDataJSON()).toEqual({ managerMembershipId: null });
      await expect(page.getByTestId('department-manager')).toHaveText('No manager assigned');
      membershipId = undefined;
      await expect(page.getByText(updatedPosition, { exact: true })).toHaveCount(0);
      await expect(page.getByText('No data available', { exact: true })).toBeVisible();
      expect(managerClearRequests).toBe(0);
      expect(genericDepartmentPatchRequests).toBe(0);

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
            body: JSON.stringify({
              message: 'Membership query intentionally failed for E2E coverage.',
            }),
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
      await expect(
        page.getByText('Unable to load Department memberships.', { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toHaveCount(0);

      failMembershipsRequest = false;
      const failedRequestCount = membershipsRequestCount;
      await page.getByRole('button', { name: 'Retry', exact: true }).click();
      await expect.poll(() => membershipsRequestCount).toBeGreaterThan(failedRequestCount);
      await page.unroute(failedMembershipsPath);
      await expect(page.getByRole('button', { name: 'Add Membership', exact: true })).toBeVisible();
      await expect(page.getByText('No data available', { exact: true })).toBeVisible();
      await expect(
        page.getByText('Unable to load Department memberships.', { exact: true }),
      ).toHaveCount(0);
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
  'ATP-ADM-RES-03: User details replace non-system-administrator roles through the rendered command',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const suffix = `${test.info().workerIndex}-${Date.now()}`;
    const roleName = `ATP Ordinary Role ${suffix}`;
    const userId = 1;
    await loginAsAdmin(page);

    let roleId: number | string | undefined;
    let originalNonSystemAdminRoleIds: Array<number | string> | undefined;
    let systemAdminRoleId: number | string | undefined;
    try {
      const originalRoles = await getUserRoles(page, userId);
      originalNonSystemAdminRoleIds = originalRoles
        .filter(role => !role.systemAdmin)
        .map(role => role.id);
      systemAdminRoleId = originalRoles.find(role => role.systemAdmin)?.id;
      expect(systemAdminRoleId).toBeDefined();
      roleId = (await createRole(page, roleName)).id;

      await page.goto(`${resourcePath('admin-user:user')}/${userId}`, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('Roles', { exact: true })).toBeVisible();
      const systemAdminRow = page
        .getByRole('row')
        .filter({ has: page.getByRole('cell', { name: 'systemAdmin', exact: true }) });
      await expect(systemAdminRow).toBeVisible();
      await expect(systemAdminRow.getByText('Protected', { exact: true })).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Replace Non-System-Administrator Roles', exact: true }),
      ).toBeVisible();

      await page
        .getByRole('button', { name: 'Replace Non-System-Administrator Roles', exact: true })
        .click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const rolePicker = dialog.locator('.v-select');
      await rolePicker.click();
      const options = page.locator('.v-overlay__content').filter({
        has: page.locator('.v-list-item-title'),
      });
      await expect(options.getByText('Registered User', { exact: true })).toBeVisible();
      await expect(options.getByText('System Administrator', { exact: true })).toHaveCount(0);
      await options.getByText(roleName, { exact: true }).click();
      await rolePicker.press('Escape');

      let genericUserPatchRequests = 0;
      page.on('request', request => {
        const url = new URL(request.url());
        if (request.method() === 'PATCH' && url.pathname === `/api/admin/user/${userId}`) {
          genericUserPatchRequests += 1;
        }
      });
      const replaced = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/role/user/${userId}/roles$`),
      );
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const replacementResponse = await replaced;
      const replacementBody = replacementResponse.request().postDataJSON() as {
        roleIds: Array<number | string>;
      };
      expect(replacementBody.roleIds).toEqual([...originalNonSystemAdminRoleIds, roleId]);
      expect(replacementBody.roleIds).not.toContain(systemAdminRoleId);
      await expect(dialog).toBeHidden();
      await expect(
        page
          .getByRole('row')
          .filter({ has: page.getByRole('cell', { name: roleName, exact: true }) }),
      ).toBeVisible();
      expect(genericUserPatchRequests).toBe(0);

      await page.goto(`${resourcePath('admin-user:user')}/${userId}/edit`, { waitUntil: 'load' });
      await expect(
        page.getByRole('button', { name: 'Replace Non-System-Administrator Roles', exact: true }),
      ).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } finally {
      if (originalNonSystemAdminRoleIds) {
        await replaceUserRoles(page, userId, originalNonSystemAdminRoleIds);
      }
      if (roleId !== undefined) await deleteRole(page, roleId);
    }
  },
);

test(
  'ATP-ADM-POL-03: Role details expose an isolated resource-permissions tab',
  { tag: ['@admin', '@cabloy-admin'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const suffix = `${test.info().workerIndex}-${Date.now()}`;
    const firstRoleName = `ATP Policy Role A ${suffix}`;
    const secondRoleName = `ATP Policy Role B ${suffix}`;
    await loginAsAdmin(page);

    let firstRoleId: number | string | undefined;
    let secondRoleId: number | string | undefined;
    try {
      firstRoleId = (await createRole(page, firstRoleName)).id;
      secondRoleId = (await createRole(page, secondRoleName)).id;

      await page.goto(resourcePath('admin-role:role'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const firstRoleRow = page.getByRole('row').filter({ hasText: firstRoleName });
      const secondRoleRow = page.getByRole('row').filter({ hasText: secondRoleName });
      await expect(firstRoleRow).toBeVisible();
      await expect(secondRoleRow).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Resource Permissions', exact: true }),
      ).toHaveCount(0);

      const firstRoleDetailResponse = await page.goto(
        `${resourcePath('admin-role:role')}/${firstRoleId}`,
        { waitUntil: 'load' },
      );
      const firstRoleDetailHtml = await firstRoleDetailResponse!.text();
      expect(firstRoleDetailHtml).toContain('data-server-rendered');
      expect(firstRoleDetailHtml.toLowerCase()).not.toContain('data-zova-hydrated');
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const firstRoleDetail = page.locator('main');
      const firstRoleTab = firstRoleDetail.getByRole('tab', { name: 'Role', exact: true });
      const firstPermissionsTab = firstRoleDetail.getByRole('tab', {
        name: 'Resource Permissions',
        exact: true,
      });
      await expect(firstRoleTab).toHaveAttribute('aria-selected', 'true');
      await expect(firstRoleTab).toBeVisible();
      await expect(page.getByLabel('Role Name', { exact: true })).toBeVisible();
      await firstPermissionsTab.click();
      await expect(firstPermissionsTab).toHaveAttribute('aria-selected', 'true');
      await expect(
        firstRoleDetail.getByText('Student Training Record Management', { exact: true }),
      ).toBeVisible();
      await expect(
        firstRoleDetail.getByText('training-record.controller.record', { exact: true }),
      ).toBeVisible();
      await expect(
        firstRoleDetail.getByText('Create Student Training Record', { exact: true }),
      ).toBeVisible();
      await expect(firstRoleDetail.getByText('create', { exact: true }).first()).toBeVisible();
      const scopedPolicyTable = firstRoleDetail
        .getByRole('button', {
          name: /Student Training Record Management training-record\.controller\.record/,
          exact: true,
        })
        .locator('xpath=following-sibling::*[1]')
        .getByRole('table');
      await expect(scopedPolicyTable).toBeVisible();
      await expect(scopedPolicyTable.getByRole('columnheader')).toHaveText([
        'Action Identifier',
        'All Data',
        'Specified Departments',
        'Own Department',
        'Own Department and Descendants',
        'My Data',
      ]);
      const firstPolicyCheckbox = scopedPolicyTable.getByRole('checkbox', {
        name: 'training-record.controller.record#create all',
        exact: true,
      });
      await expect(firstPolicyCheckbox).toBeVisible();
      await expect(firstPolicyCheckbox).not.toBeChecked();
      const firstGrantCreate = waitForApiResponse(page, 'POST', /^\/api\/admin\/rbac\/rbacGrant$/);
      await firstPolicyCheckbox.click();
      const firstGrantCreateResponse = await firstGrantCreate;
      const firstGrantCreateBody = firstGrantCreateResponse.request().postDataJSON() as {
        roleId: number | string;
        actionKey: string;
        dataScope: string;
        enabled: boolean;
      };
      expect(String(firstGrantCreateBody.roleId)).toBe(String(firstRoleId));
      expect(firstGrantCreateBody.actionKey).toBe('training-record.controller.record#create');
      expect(firstGrantCreateBody.dataScope).toBe('all');
      expect(firstGrantCreateBody.enabled).toBe(true);
      expect(Object.keys(firstGrantCreateBody).sort()).toEqual([
        'actionKey',
        'dataScope',
        'enabled',
        'roleId',
      ]);
      await expect(firstPolicyCheckbox).toBeChecked();
      const firstConfiguration = await getRolePolicyConfiguration(page, firstRoleId);
      expect(
        firstConfiguration.list
          .find(action => action.actionKey === 'training-record.controller.record#create')
          ?.dataScopes.find(scope => scope.dataScope === 'all')?.enabled,
      ).toBeTruthy();

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const reloadedConfiguration = await getRolePolicyConfiguration(page, firstRoleId);
      expect(
        reloadedConfiguration.list
          .find(action => action.actionKey === 'training-record.controller.record#create')
          ?.dataScopes.find(scope => scope.dataScope === 'all')?.enabled,
      ).toBeTruthy();
      const reloadedPermissionsTab = page.locator('main').getByRole('tab', {
        name: 'Resource Permissions',
        exact: true,
      });
      await reloadedPermissionsTab.click();
      await expect(reloadedPermissionsTab).toHaveAttribute('aria-selected', 'true');
      await expect(
        page.getByRole('checkbox', {
          name: 'training-record.controller.record#create all',
          exact: true,
        }),
      ).toBeChecked();

      await page.goto(`${resourcePath('admin-role:role')}/${secondRoleId}`, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const secondRoleDetail = page.locator('main');
      const secondPermissionsTab = secondRoleDetail.getByRole('tab', {
        name: 'Resource Permissions',
        exact: true,
      });
      await secondPermissionsTab.click();
      await expect(secondPermissionsTab).toHaveAttribute('aria-selected', 'true');
      const secondPolicyCheckbox = page.getByRole('checkbox', {
        name: 'training-record.controller.record#create all',
        exact: true,
      });
      await expect(secondPolicyCheckbox).toBeVisible();
      await expect(secondPolicyCheckbox).not.toBeChecked();
      expect(pageErrors).toEqual([]);
    } finally {
      if (secondRoleId !== undefined) await deleteRole(page, secondRoleId);
      if (firstRoleId !== undefined) await deleteRole(page, firstRoleId);
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
    const protectedDepartment = `ATP Protected ${suffix}`;
    await loginAsAdmin(page);

    await page.goto('/admin/rest/resource/admin-user%3Auser/1', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByText('Roles', { exact: true })).toBeVisible();
    await expect(page.getByText('Department Memberships', { exact: true })).toBeVisible();

    let rootAId: number | string | undefined;
    let rootBId: number | string | undefined;
    let childId: number | string | undefined;
    let protectedDepartmentId: number | string | undefined;
    let protectedMembershipId: number | string | undefined;
    try {
      rootAId = await createDepartment(page, rootA);
      rootBId = await createDepartment(page, rootB);
      childId = await createDepartment(page, child, rootAId);
      protectedDepartmentId = await createDepartment(page, protectedDepartment);
      protectedMembershipId = await createMembership(page, protectedDepartmentId, 1);
      await requestApi(page, 'PUT', `/api/admin/department/${protectedDepartmentId}/manager`, {
        membershipId: protectedMembershipId,
      });

      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const childRow = page.getByRole('row').filter({ hasText: child });
      await expect(childRow).toBeVisible();
      await expect(childRow.getByRole('button', { name: 'Reorder', exact: true })).toBeVisible();
      await expect(childRow.getByRole('button', { name: 'Disable', exact: true })).toBeVisible();
      await childRow.getByRole('button', { name: 'Move', exact: true }).click();

      const moveDialog = page.getByRole('dialog');
      await expect(moveDialog).toBeVisible();
      await moveDialog.getByText(rootB, { exact: true }).click();
      const moved = waitForApiResponse(page, 'PUT', /\/api\/admin\/department\/[^/]+\/move$/);
      await moveDialog.getByRole('button', { name: 'Move Department', exact: true }).click();
      await moved;
      await expect(moveDialog).toBeHidden();

      const departmentTree = page.getByLabel('All Departments');
      const departmentRows = page.getByRole('table').getByRole('row');
      await departmentTree.getByText(rootA, { exact: true }).click();
      await expect(departmentRows.filter({ hasText: child })).toHaveCount(0);
      await departmentTree.getByText(rootB, { exact: true }).click();
      await expect(departmentRows.filter({ hasText: child })).toBeVisible();

      let genericDepartmentPatchRequests = 0;
      page.on('request', request => {
        const url = new URL(request.url());
        if (request.method() === 'PATCH' && url.pathname === `/api/admin/department/${childId}`) {
          genericDepartmentPatchRequests += 1;
        }
      });
      const movedChildRow = departmentRows.filter({ hasText: child });
      await movedChildRow.getByRole('button', { name: 'Reorder', exact: true }).click();
      const reorderDialog = page.getByRole('dialog');
      await expect(reorderDialog).toBeVisible();
      await expect(reorderDialog.getByText('Append', { exact: true })).toBeVisible();
      await expect(reorderDialog.getByText(rootA, { exact: true })).toHaveCount(0);
      await expect(reorderDialog.getByText(rootB, { exact: true })).toHaveCount(0);
      const reordered = waitForApiResponse(
        page,
        'PUT',
        /\/api\/admin\/department\/[^/]+\/reorder$/,
      );
      await reorderDialog.getByRole('button', { name: 'Reorder Department', exact: true }).click();
      await reordered;
      await expect(reorderDialog).toBeHidden();

      await movedChildRow.getByRole('button', { name: 'Disable', exact: true }).click();
      const confirmation = page.getByRole('dialog');
      await expect(
        confirmation.getByText('Disable this Department?', { exact: true }),
      ).toBeVisible();
      const disabled = waitForApiResponse(
        page,
        'PUT',
        /\/api\/admin\/department\/[^/]+\/activation$/,
      );
      await confirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const disabledResponse = await disabled;
      expect(disabledResponse.request().postDataJSON()).toEqual({ enabled: false });
      await expect.poll(async () => (await getDepartment(page, childId!)).enabled).toBeFalsy();
      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const disabledChildRow = page.getByRole('row').filter({ hasText: child });
      await expect(
        disabledChildRow.getByRole('button', { name: 'Enable', exact: true }),
      ).toBeVisible();

      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      let protectedRow = page.getByRole('row').filter({ hasText: protectedDepartment });
      await expect(protectedRow).toBeVisible();
      await protectedRow.getByRole('button', { name: 'Disable', exact: true }).click();
      let protectedConfirmation = page.getByRole('dialog');
      await expect(
        protectedConfirmation.getByText('Disable this Department?', { exact: true }),
      ).toBeVisible();
      const rejectedDisable = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${protectedDepartmentId}/activation$`),
        false,
      );
      await protectedConfirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      expect((await rejectedDisable).status()).toBe(409);
      const lifecycleAlert = page
        .getByRole('dialog')
        .filter({ hasText: 'The Department has dependent records that must be handled first' });
      await expect(lifecycleAlert).toBeVisible();
      await lifecycleAlert.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(lifecycleAlert).not.toBeVisible();
      await expect(
        protectedRow.getByRole('button', { name: 'Disable', exact: true }),
      ).toBeVisible();
      await requestApi(page, 'PUT', `/api/admin/department/${protectedDepartmentId}/manager`, {
        membershipId: null,
      });
      await deleteMembership(page, protectedDepartmentId, protectedMembershipId);
      protectedMembershipId = undefined;
      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      protectedRow = page.getByRole('row').filter({ hasText: protectedDepartment });
      await expect(protectedRow).toBeVisible();
      await protectedRow.getByRole('button', { name: 'Disable', exact: true }).click();
      protectedConfirmation = page.getByRole('dialog');
      await expect(
        protectedConfirmation.getByText('Disable this Department?', { exact: true }),
      ).toBeVisible();
      const disabledProtectedDepartment = waitForApiResponse(
        page,
        'PUT',
        new RegExp(`/api/admin/department/${protectedDepartmentId}/activation$`),
      );
      await protectedConfirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      await disabledProtectedDepartment;
      await page.goto(resourcePath('admin-department:department'), { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      protectedRow = page.getByRole('row').filter({ hasText: protectedDepartment });
      await expect(protectedRow.getByRole('button', { name: 'Enable', exact: true })).toBeVisible();
      expect(genericDepartmentPatchRequests).toBe(0);
      expect(pageErrors).toEqual([]);
    } finally {
      if (protectedDepartmentId !== undefined && protectedMembershipId !== undefined) {
        await requestApi(page, 'PUT', `/api/admin/department/${protectedDepartmentId}/manager`, {
          membershipId: null,
        });
        await deleteMembership(page, protectedDepartmentId, protectedMembershipId);
      }
      if (protectedDepartmentId !== undefined) {
        await deleteDepartment(page, protectedDepartmentId);
      }
      if (childId !== undefined) {
        await deleteDepartment(page, childId);
      }
      if (rootBId !== undefined) await deleteDepartment(page, rootBId);
      if (rootAId !== undefined) await deleteDepartment(page, rootAId);
    }
  },
);
