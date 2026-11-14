import type { Page } from '@playwright/test';

import { expect, test } from '../scripts/managedTest.ts';
import { loginAsAdmin as loginAsAdminApi } from './helpers/cabloy-admin-api.ts';

async function loginAsAdmin(page: Page) {
  const captchaCreated = page.waitForResponse(response => {
    return (
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/captcha/create' &&
      response.ok()
    );
  });
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

const managementPages = [
  { page: 'accessTokens', api: 'accessToken', model: 'accessTokens' },
  { page: 'authorizations', api: 'authorizationGrant', model: 'authorizationRecords' },
  { page: 'scopes', api: 'customScope', model: 'personalScopes' },
];

for (const site of ['admin', 'web'] as const) {
  test(`MCP resource and self-service queries stay on ${site} through hydration`, async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const hydrationWarnings: string[] = [];
    page.on('console', message => {
      if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
        hydrationWarnings.push(message.text());
      }
    });

    for (const entry of managementPages) {
      const pathname = `${site === 'admin' ? '/admin' : ''}/cabloy/mcp/${entry.page}`;
      const response = await page.goto(pathname, { waitUntil: 'load' });
      expect(response?.ok()).toBeTruthy();
      const resource = new URL(`/mcp/${site}`, page.url()).href;
      // The resource must already be present in SSR, not added only after hydration.
      expect(await response!.text()).toContain(resource);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', site);
      await expect(page.locator('[data-mcp-resource]').first()).toHaveText(resource);
      // SSR may satisfy the initial query without a browser fetch. Exercise the same
      // model's explicit refresh to verify the generated request without defeating reuse.
      const mine = page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          url.pathname === `/api/mcp/auth/${entry.api}/mine` &&
          !response.request().headers()['x-vona-openapi-schema']
        );
      });
      await page.evaluate(async modelName => {
        const root = Array.from(document.querySelectorAll('*')).find(
          element => (element as any).__vue_app__?.zova,
        ) as any;
        const app = root?.__vue_app__?.zova;
        if (!app) throw new Error('Mounted Zova application not found');
        const model = await app.bean._getBean(`cabloy-mcp.model.${modelName}`, true);
        await model.mine({ pageNo: 1, pageSize: 20 }).refetch({ throwOnError: true });
      }, entry.model);
      const mineResponse = await mine;
      expect(new URL(mineResponse.url()).searchParams.get('ssrSiteId')).toBe(site);
      expect(mineResponse.ok()).toBeTruthy();
      expect(mineResponse.headers()['cache-control']).toContain('no-store');
    }
    expect(hydrationWarnings).toEqual([]);
  });
}

test('Student MCP tools belong to the Admin catalog, not Web', async ({ request }) => {
  const admin = await loginAsAdminApi(request);
  const catalogs: Record<string, { controller: string; action: string }[]> = {};
  for (const site of ['admin', 'web']) {
    const response = await request.get('/api/mcp/auth/customScope/catalog', {
      headers: { Accept: 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      params: { ssrSiteId: site },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await response.json();
    expect(body.code).toBe(0);
    catalogs[site] = body.data;
  }
  const studentActions = (site: string) =>
    catalogs[site]
      .filter(tool => tool.controller === 'training-student.controller.student')
      .map(tool => tool.action)
      .sort();
  expect(studentActions('admin')).toEqual([
    'aggregate',
    'create',
    'delete',
    'group',
    'select',
    'summary',
    'update',
    'view',
  ]);
  expect(studentActions('web')).toEqual([]);
});

test('Consent displays the request-bound resource and scopes URL across Sites', async ({
  page,
}) => {
  await loginAsAdmin(page);
  const resource = new URL('/mcp/web', page.url()).href;
  const scopesUrl = new URL('/cabloy/mcp/scopes', page.url()).href;
  // Presentation regression only: the OAuth lifecycle remains owned by the backend.
  await page.route(/\/mcp\/auth\/summary\?/, async route => {
    await route.fulfill({
      json: {
        code: 0,
        data: {
          clientName: 'Site resource regression',
          resource,
          ssrSiteId: 'web',
          scopesUrl,
          scope: 'mcp:read',
          expiresAt: Date.now() + 60_000,
          options: [
            {
              scope: 'mcp:read',
              name: 'Read tools',
              description: 'Read-only access',
              allowed: true,
              tools: [
                {
                  name: 'technical_tool',
                  summary: '  Friendly tool title  ',
                  description: 'First line\nSecond line',
                  controller: 'example.controller.tools',
                  action: 'read',
                  controllerSummary: 'Tools',
                  readOnly: true,
                  available: true,
                },
                {
                  name: 'fallback_tool',
                  summary: '  ',
                  description: '',
                  controller: 'example.controller.tools',
                  action: 'fallback',
                  controllerSummary: 'Tools',
                  readOnly: true,
                  available: true,
                },
              ],
            },
          ],
        },
      },
    });
  });
  await page.goto('/admin/cabloy/mcp/consent?request=site-resource-regression', {
    waitUntil: 'load',
  });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(page.locator('[data-mcp-resource]')).toHaveText(resource);
  await expect(page.getByRole('link', { name: 'Manage scopes', exact: true })).toHaveAttribute(
    'href',
    scopesUrl,
  );
  await page.locator('[data-mcp-scope-option="mcp:read"] summary').click();
  await expect(page.getByText('Friendly tool title', { exact: true })).toBeVisible();
  await expect(page.getByText('fallback_tool', { exact: true })).toBeVisible();
  await expect(page.getByText('First line Second line', { exact: true })).toHaveCSS(
    'white-space',
    'pre-wrap',
  );
});
