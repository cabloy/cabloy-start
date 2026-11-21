import type { Locator, Page, Route } from '@playwright/test';

import { expect, test } from '../scripts/managedTest.ts';
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
  return root.locator('ul[data-type="taskList"] li > label > input[type="checkbox"]');
}

async function expectTaskCheckboxLayout(root: Locator) {
  const layout = await root.locator('ul[data-type="taskList"] li').evaluateAll(taskItems =>
    taskItems.map(taskItem => {
      const checkbox = taskItem.querySelector<HTMLInputElement>('label > input[type="checkbox"]');
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
        textCenter: textRect.top + Number.parseFloat(getComputedStyle(text).lineHeight) / 2,
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
      const editButton = row.getByRole('button', { name: 'Edit', exact: true });
      await expect(editButton).toBeVisible();
      await editButton.click();
      await expect(page).toHaveURL(new RegExp(`${studentId}/edit(?:[/?#]|$)`));
      const reopenedEditor = descriptionEditor(page);
      const reopenedCheckboxes = taskCheckboxes(reopenedEditor);
      await expect(reopenedCheckboxes).toHaveCount(2);
      await expect(reopenedCheckboxes.nth(0)).toBeChecked();
      await expect(reopenedCheckboxes.nth(1)).not.toBeChecked();
      await expect(reopenedCheckboxes.nth(0)).toBeEnabled();
      await expect(reopenedCheckboxes.nth(1)).toBeEnabled();
      await expectTaskCheckboxLayout(reopenedEditor);

      const description = page.getByRole('group', { name: 'Description', exact: true });
      const toolbar = description.getByRole('toolbar', { name: 'Markdown toolbar', exact: true });
      const sourceButton = toolbar.getByRole('button', {
        name: 'Source editing mode',
        exact: true,
      });
      const sourceInput = description.getByRole('textbox', {
        name: 'Markdown source',
        exact: true,
      });
      await expect(sourceButton).toHaveAttribute('type', 'button');
      await expect(sourceButton).toHaveAttribute('aria-pressed', 'false');
      await sourceButton.click();
      await expect(sourceButton).toHaveAttribute('aria-pressed', 'true');
      await expect(sourceInput).toBeVisible();
      const originalMarkdown = await sourceInput.inputValue();
      expect(originalMarkdown).toContain('- [x] Completed task');
      expect(originalMarkdown).toContain('- [ ] Open task');
      await expect(reopenedEditor).toBeHidden();
      await expect(toolbar.getByRole('button', { name: 'Bold', exact: true })).toHaveCount(0);
      await sourceInput.click();
      await expect(sourceInput).toBeFocused();
      await sourceButton.click();
      await expect(reopenedEditor).toBeVisible();
      await sourceButton.click();
      await expect(sourceInput).toHaveValue(originalMarkdown);
      const sourceMarkdown = `${originalMarkdown}\n\n## Source heading\n\nSource **content**`;
      await sourceInput.fill(sourceMarkdown);
      await sourceButton.click();
      await expect(reopenedEditor.locator('h2')).toHaveText('Source heading');
      await expect(reopenedEditor.locator('strong')).toHaveText('content');
      await sourceButton.click();
      await expect(sourceInput).toHaveValue(sourceMarkdown);
      const savedMarkdown = `${sourceMarkdown}\n\nSaved from source\n`;
      await sourceInput.fill(savedMarkdown);

      const updatePath = `/api/training/student/${studentId}`;
      const updateResponsePromise = waitForApiResponse(page, 'PATCH', updatePath);
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const updateResponse = await updateResponsePromise;
      const updatedMarkdown = (
        updateResponse.request().postDataJSON() as { content?: { descriptionMarkdown?: string } }
      ).content?.descriptionMarkdown;
      expect(updatedMarkdown).toBe(savedMarkdown);
      expect(updatedMarkdown).toContain('- [x] Completed task');
      expect(updatedMarkdown).toContain('- [ ] Open task');

      await expectStudentListPage(page);
      const updatedRow = page.getByRole('row').filter({ hasText: studentName });
      await expect(updatedRow).toBeVisible();

      const summaryPath = `/api/training/student/summary/${studentId}`;
      const moreActions = updatedRow.getByRole('button', {
        name: 'More actions',
        exact: true,
      });
      await moreActions.click();
      const summaryButton = page
        .locator(`[id="${await moreActions.getAttribute('aria-controls')}"]`)
        .getByRole('button', { name: 'Summary', exact: true, includeHidden: true });
      await expect(summaryButton).toBeVisible();
      let summaryRequestCount = 0;
      let summaryRouteActive = 0;
      let resolveSummaryRoutesDrained: (() => void) | undefined;
      const summaryRoutesDrained = new Promise<void>(resolve => {
        resolveSummaryRoutesDrained = resolve;
      });
      let releaseSummaryRequest: (() => void) | undefined;
      const summaryRequestHeld = new Promise<void>(resolve => {
        releaseSummaryRequest = resolve;
      });
      const summaryFixtureResponse = await requestApi(request, 'GET', summaryPath, {
        accessToken: admin.accessToken,
      });
      expect(summaryFixtureResponse.ok()).toBeTruthy();
      const summaryFixture = await summaryFixtureResponse.json();
      const summaryRoute = async (route: Route) => {
        const request = route.request();
        if (request.method() !== 'GET' || request.headers()['x-vona-openapi-schema']) {
          await route.fallback();
          return;
        }
        summaryRequestCount++;
        summaryRouteActive++;
        try {
          await summaryRequestHeld;
          await route.fulfill({ json: summaryFixture });
        } finally {
          summaryRouteActive--;
          if (summaryRouteActive === 0) resolveSummaryRoutesDrained?.();
        }
      };
      const summaryRouteUrl = (url: URL) => url.pathname === summaryPath;
      await page.route(summaryRouteUrl, summaryRoute);
      try {
        const summaryResponsePromise = waitForApiResponse(page, 'GET', summaryPath);
        await summaryButton.click();
        await expect.poll(() => summaryRequestCount).toBe(1);
        await expect(summaryButton).toBeDisabled();
        await expect(summaryButton).toHaveAttribute('aria-busy', 'true');
        await expect(summaryButton.locator('.v-btn__loader')).toHaveCount(1);
        await summaryButton.evaluate(element => element.click());
        await expect.poll(() => summaryRequestCount).toBe(1);

        releaseSummaryRequest?.();
        const summaryResponse = await summaryResponsePromise;
        const summaryResponseBody = (await summaryResponse.json()) as {
          data?: {
            descriptionMarkdown?: string;
            descriptionHtml?: string;
          };
          descriptionMarkdown?: string;
          descriptionHtml?: string;
        };
        const summary = summaryResponseBody.data ?? summaryResponseBody;
        expect(summary.descriptionMarkdown).toContain('- [x] Completed task');
        expect(summary.descriptionMarkdown).toContain('- [ ] Open task');
        expect(summary.descriptionMarkdown).toContain('Saved from source');
        expect(summary.descriptionHtml).toContain('<h2>Source heading</h2>');
        expect(summary.descriptionHtml).toContain('<strong>content</strong>');
        expect(summary.descriptionHtml).toContain('Completed task');
        expect(summary.descriptionHtml).toContain('Open task');
      } finally {
        releaseSummaryRequest?.();
        if (summaryRouteActive > 0) await summaryRoutesDrained;
        await page.unroute(summaryRouteUrl, summaryRoute);
      }
      await expect(summaryButton).toBeEnabled();
      const dialog = page.getByRole('dialog').filter({
        has: page.getByText('Summary', { exact: true }),
      });
      await expect(dialog).toBeVisible();
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
