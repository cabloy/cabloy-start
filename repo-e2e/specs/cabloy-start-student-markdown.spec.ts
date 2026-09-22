import type { Locator, Page, Route } from '@playwright/test';

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
    return (
      response.request().method() === method &&
      response.ok() &&
      url.pathname === pathname &&
      !response.request().headers()['x-vona-openapi-schema']
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

async function openStudentListPage(page: Page) {
  const response = await page.goto(resourcePath(studentResource), { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await expectStudentListPage(page);
}

async function expectStudentListPage(page: Page) {
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/,
  );
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
}

function descriptionEditor(page: Page) {
  return page.getByRole('group', { name: 'Description', exact: true }).locator('.ProseMirror');
}

function taskCheckboxes(root: Locator) {
  return root.locator(
    'ul[data-type="taskList"] li > label > input[type="checkbox"]',
  );
}

async function expectTaskCheckboxLayout(root: Locator) {
  const layout = await root.locator('ul[data-type="taskList"] li').evaluateAll(
    taskItems =>
      taskItems.map(taskItem => {
        const checkbox = taskItem.querySelector<HTMLInputElement>(
          'label > input[type="checkbox"]',
        );
        const label = taskItem.querySelector<HTMLElement>('label');
        const text = taskItem.querySelector<HTMLElement>('div > p');
        if (!checkbox || !label || !text) return null;

        const checkboxRect = checkbox.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();
        const checkboxStyle = getComputedStyle(checkbox);
        const labelStyle = getComputedStyle(label);
        const itemStyle = getComputedStyle(taskItem);
        return {
          checkboxHeight: checkboxRect.height,
          checkboxWidth: checkboxRect.width,
          checkboxCenter: checkboxRect.top + checkboxRect.height / 2,
          checkboxMarginBlockEnd: checkboxStyle.marginBlockEnd,
          checkboxMarginBlockStart: checkboxStyle.marginBlockStart,
          checkboxMarginInlineEnd: checkboxStyle.marginInlineEnd,
          checkboxMarginInlineStart: checkboxStyle.marginInlineStart,
          itemDisplay: itemStyle.display,
          labelDisplay: labelStyle.display,
          textCenter: textRect.top + parseFloat(getComputedStyle(text).lineHeight) / 2,
        };
      }),
  );

  expect(layout).toHaveLength(2);
  for (const task of layout) {
    expect(task).not.toBeNull();
    expect(task?.itemDisplay).toBe('flex');
    expect(task?.labelDisplay).toBe('flex');
    expect(task?.checkboxWidth).toBeGreaterThan(0);
    expect(task?.checkboxHeight).toBe(task?.checkboxWidth);
    expect(task?.checkboxMarginBlockStart).toBe('0px');
    expect(task?.checkboxMarginBlockEnd).toBe('0px');
    expect(task?.checkboxMarginInlineStart).toBe('0px');
    expect(task?.checkboxMarginInlineEnd).toBe('0px');
    expect(Math.abs((task?.checkboxCenter ?? 0) - (task?.textCenter ?? 0))).toBeLessThanOrEqual(2);
  }
}

async function setDescriptionTasks(page: Page) {
  const editor = descriptionEditor(page);
  await editor.fill('Completed task\nOpen task');
  await editor.press('ControlOrMeta+A');
  await page.getByRole('button', { name: 'Task list', exact: true }).click();
  const checkboxes = taskCheckboxes(editor);
  await expect(checkboxes).toHaveCount(2);
  await checkboxes.nth(0).check();
  return checkboxes;
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
      const createCheckboxes = await setDescriptionTasks(page);
      await expectTaskCheckboxLayout(descriptionEditor(page));
      await expect(createCheckboxes.nth(0)).toBeChecked();
      await expect(createCheckboxes.nth(1)).not.toBeChecked();
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await page.getByText('Foundation Track', { exact: true }).click();

      const createResponsePromise = waitForApiResponse(page, 'POST', '/api/training/student');
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const createResponse = await createResponsePromise;
      studentId = (await createResponse.json()).data as TableIdentity;
      expect(studentId).toBeDefined();

      await expectStudentListPage(page);
      const row = page.getByRole('row').filter({ hasText: studentName });
      await expect(row).toBeVisible();
      await expect(row.getByRole('button', { name: 'Summary', exact: true })).toBeVisible();

      // The row name is the first button; Operations then declares Summary, Update, Delete, and Force Delete.
      await row.getByRole('button').nth(2).click();
      await expect(page).toHaveURL(new RegExp(`${studentId}/edit(?:[/?#]|$)`));
      const reopenedEditor = descriptionEditor(page);
      const reopenedCheckboxes = taskCheckboxes(reopenedEditor);
      await expect(reopenedCheckboxes).toHaveCount(2);
      await expect(reopenedCheckboxes.nth(0)).toBeChecked();
      await expect(reopenedCheckboxes.nth(1)).not.toBeChecked();
      await expect(reopenedCheckboxes.nth(0)).toBeEnabled();
      await expect(reopenedCheckboxes.nth(1)).toBeEnabled();
      await expectTaskCheckboxLayout(reopenedEditor);

      const updatePath = `/api/training/student/${studentId}`;
      const updateResponsePromise = waitForApiResponse(page, 'PATCH', updatePath);
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const updateResponse = await updateResponsePromise;
      const updatedMarkdown = (
        updateResponse.request().postDataJSON() as { content?: { descriptionMarkdown?: string } }
      ).content?.descriptionMarkdown;
      expect(updatedMarkdown).toContain('- [x] Completed task');
      expect(updatedMarkdown).toContain('- [ ] Open task');

      await expectStudentListPage(page);
      const updatedRow = page.getByRole('row').filter({ hasText: studentName });
      await expect(updatedRow).toBeVisible();

      const summaryPath = `/api/training/student/summary/${studentId}`;
      const summaryButton = updatedRow.getByRole('button', { name: 'Summary', exact: true });
      let summaryRequestCount = 0;
      let releaseSummaryRequest: (() => void) | undefined;
      const summaryRequestHeld = new Promise<void>(resolve => {
        releaseSummaryRequest = resolve;
      });
      const summaryRoute = async (route: Route) => {
        summaryRequestCount++;
        await summaryRequestHeld;
        await route.continue();
      };
      await page.route(summaryPath, summaryRoute);
      try {
        const summaryResponsePromise = waitForApiResponse(page, 'GET', summaryPath);
        await summaryButton.click();
        await expect.poll(() => summaryRequestCount).toBe(1);
        await expect(summaryButton).toBeDisabled();
        await expect(summaryButton).toHaveAttribute('aria-busy', 'true');
        await expect(summaryButton.locator('.v-btn__loader')).toHaveCount(1);
        await summaryButton.click({ force: true });
        await expect.poll(() => summaryRequestCount).toBe(1);

        releaseSummaryRequest?.();
        const summaryResponse = await summaryResponsePromise;
        const summary = (await summaryResponse.json()).data as {
          descriptionMarkdown?: string;
          descriptionHtml?: string;
        };
        expect(summary.descriptionMarkdown).toContain('- [x] Completed task');
        expect(summary.descriptionMarkdown).toContain('- [ ] Open task');
        expect(summary.descriptionHtml).toContain('Completed task');
        expect(summary.descriptionHtml).toContain('Open task');
      } finally {
        releaseSummaryRequest?.();
        await page.unroute(summaryPath, summaryRoute);
      }
      await expect(summaryButton).toBeEnabled();
      const dialog = page.getByRole('dialog').filter({
        has: page.getByText('Summary', { exact: true }),
      });
      const renderedDescription = dialog.locator('ul[data-type="taskList"]');
      const renderedCheckboxes = renderedDescription.locator('input[type="checkbox"]');
      await expect(renderedCheckboxes).toHaveCount(2);
      await expect(renderedCheckboxes.nth(0)).toBeDisabled();
      await expect(renderedCheckboxes.nth(1)).toBeDisabled();
      await expect(renderedCheckboxes.nth(0)).toBeChecked();
      await expect(renderedCheckboxes.nth(1)).not.toBeChecked();
      await expect(renderedDescription).toContainText('Completed task');
      await expect(renderedDescription).toContainText('Open task');
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
