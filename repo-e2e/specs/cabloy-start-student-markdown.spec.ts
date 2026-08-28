import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

import { loginAsAdmin as loginAsAdminApi, requestApi } from './helpers/cabloy-admin-api.ts';

type TableIdentity = number | string;

const studentResource = 'training-student:student';

function resourcePath(resource: string) {
  return `/admin/rest/resource/${encodeURIComponent(resource)}`;
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

function waitForApiResponse(page: Page, method: string, pathname: string) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return response.request().method() === method && response.ok() && url.pathname === pathname;
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

async function openStudentListPage(page: Page) {
  const response = await page.goto(resourcePath(studentResource), { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(page.getByLabel('Student Name', { exact: true })).toBeVisible();
}

function descriptionEditor(page: Page) {
  return page.getByRole('group', { name: 'Description', exact: true }).locator('.ProseMirror');
}

test(
  'ATP-START-STUDENT-01: Summary renders the updated Markdown after a reopened Student edit',
  { tag: '@admin' },
  async ({ page, request }) => {
    const suffix = `${test.info().workerIndex}-${test.info().retry}-${Date.now()}`;
    const studentName = `E2E Summary ${suffix}`;
    const mobile = `139${String(Date.now()).slice(-8)}`;
    let studentId: TableIdentity | undefined;
    const admin = await loginAsAdminApi(request);

    try {
      await loginAsAdmin(page);
      await openStudentListPage(page);

      await page.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page).toHaveURL(
        /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student\/create(?:[/?#]|$)/,
      );
      await page.getByLabel('Student Name', { exact: true }).fill(studentName);
      await page.getByLabel('Mobile', { exact: true }).fill(mobile);
      await descriptionEditor(page).fill('1');
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await page.getByText('Foundation Track', { exact: true }).click();

      const createResponsePromise = waitForApiResponse(page, 'POST', '/api/training/student');
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const createResponse = await createResponsePromise;
      studentId = (await createResponse.json()).data as TableIdentity;
      expect(studentId).toBeDefined();

      await openStudentListPage(page);
      const row = page.getByRole('row').filter({ hasText: studentName });
      await expect(row).toBeVisible();
      await expect(row.getByRole('button', { name: 'Summary', exact: true })).toBeVisible();

      // The row name is the first button; Operations then declares Summary, Update, Delete, and Force Delete.
      await row.getByRole('button').nth(2).click();
      await expect(page).toHaveURL(new RegExp(`${studentId}/edit(?:[/?#]|$)`));
      await expect(descriptionEditor(page)).toHaveText('1');
      await descriptionEditor(page).fill('2');

      const updatePath = `/api/training/student/${studentId}`;
      const updateResponsePromise = waitForApiResponse(page, 'PATCH', updatePath);
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const updateResponse = await updateResponsePromise;
      expect(updateResponse.request().postDataJSON()).toMatchObject({
        content: { descriptionMarkdown: '2' },
      });

      await openStudentListPage(page);
      const updatedRow = page.getByRole('row').filter({ hasText: studentName });
      await expect(updatedRow).toBeVisible();

      const summaryPath = `/api/training/student/summary/${studentId}`;
      const summaryResponsePromise = waitForApiResponse(page, 'GET', summaryPath);
      await updatedRow.getByRole('button', { name: 'Summary', exact: true }).click();
      const summaryResponse = await summaryResponsePromise;
      const summary = (await summaryResponse.json()).data as {
        descriptionMarkdown?: string;
        descriptionHtml?: string;
      };
      expect(summary.descriptionMarkdown).toBe('2');
      expect(summary.descriptionHtml).toContain('2');

      const dialog = page.getByRole('dialog').filter({
        has: page.getByText('Summary', { exact: true }),
      });
      const renderedDescription = dialog.locator('p');
      await expect(renderedDescription).toHaveCount(1);
      await expect(renderedDescription).toHaveText('2');
    } finally {
      if (studentId !== undefined) {
        const cleanupResponse = await requestApi(
          request,
          'DELETE',
          `/api/training/student/deleteForce/${studentId}`,
          { accessToken: admin.accessToken },
        );
        expect(cleanupResponse.ok(), `failed to delete Student fixture ${studentId}`).toBeTruthy();
      }
    }
  },
);
