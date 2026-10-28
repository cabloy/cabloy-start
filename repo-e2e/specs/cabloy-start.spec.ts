import type { Locator, Page, Request, Route } from '@playwright/test';

import { expect, test } from '../scripts/managedTest.ts';
import { loginAsAdmin as loginAsAdminApi, requestApiOk } from './helpers/cabloy-admin-api.ts';

const studentResourceUrl =
  /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/;

interface IModelPersistenceIdentity {
  appName: string;
  siteId: string;
  scope: readonly [string | null, string | null, string | null];
}

interface IStudentDraftSnapshot {
  storageKey: string;
  namespace: unknown[];
  identity: unknown[];
  queryKey: unknown[];
  schemaSignature: string;
  baselineSignature?: string;
  mode: string;
  id?: string;
  values: Record<string, unknown>;
  relations: Record<string, { id?: string | number; deleted?: boolean }[]>;
  undefinedPaths: string[];
}

function installStudentCreateResponseCapture(page: Page) {
  let studentId: string | number | undefined;
  const handler = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      request.method() !== 'POST' ||
      url.pathname !== '/api/training/student' ||
      request.headers()['x-vona-openapi-schema']
    ) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const payload = await response.json();
    if (response.ok() && ['string', 'number'].includes(typeof payload.data)) {
      studentId = payload.data;
    }
    await route.fulfill({ response });
  };
  return {
    async install() {
      await page.route('**/api/training/student', handler);
    },
    async uninstall() {
      await page.unroute('**/api/training/student', handler);
    },
    get studentId() {
      return studentId;
    },
  };
}

const studentDraftCreatePath = '/admin/rest/resource/training-student%3Astudent/create';

function studentDraftNameInput(page: Page) {
  // Cached list pages retain their identically labeled filter input when a task is active.
  return page
    .getByRole('group', { name: 'Student Profile', exact: true })
    .getByLabel('Student Name', { exact: true });
}

function studentDraftBanner(page: Page) {
  return page.getByTestId('resource-draft');
}

function collectDraftEffects(page: Page, includeNestedRecords = false) {
  const mutationMethods = includeNestedRecords
    ? ['POST', 'PUT', 'PATCH', 'DELETE']
    : ['POST', 'PATCH'];
  const resourcePaths = includeNestedRecords
    ? /^\/api\/training\/(?:student|record)(?:\/|$)/
    : /^\/api\/training\/student(?:\/|$)/;
  const mutations: string[] = [];
  const hydrationWarnings: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors = collectPageErrors(page);
  const requestHandler = (request: Request) => {
    if (
      mutationMethods.includes(request.method()) &&
      resourcePaths.test(new URL(request.url()).pathname) &&
      !request.headers()['x-vona-openapi-schema']
    ) {
      mutations.push(`${request.method()} ${new URL(request.url()).pathname}`);
    }
  };
  page.on('request', requestHandler);
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
    if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
      hydrationWarnings.push(message.text());
    }
  });
  return { mutations, hydrationWarnings, consoleErrors, pageErrors };
}

async function readModelPersistenceIdentity(page: Page): Promise<IModelPersistenceIdentity> {
  return page.evaluate(async (): Promise<IModelPersistenceIdentity> => {
    // ZovaApplication attaches itself to Vue's app, whose mount root exposes __vue_app__.
    const root = Array.from(document.querySelectorAll('*')).find(
      element => (element as any).__vue_app__?.zova,
    ) as any;
    const app = root?.__vue_app__?.zova;
    if (!app) throw new Error('Mounted Zova application not found');
    const passport = await app.bean._getBean('home-passport.model.passport', true);
    const scope: IModelPersistenceIdentity['scope'] = passport.$modelPersistence.capture().scope;
    return {
      appName: app.sys.env.APP_NAME ?? '',
      siteId: app.sys.env.SITE_ID,
      scope,
    };
  });
}

async function readStudentDrafts(page: Page, expectedIdentity?: IModelPersistenceIdentity) {
  const current = expectedIdentity ?? (await readModelPersistenceIdentity(page));
  const entries = await page.evaluate(async () => {
    if (!(await indexedDB.databases()).some(database => database.name === 'localforage')) {
      return [];
    }
    return await new Promise<{ key: IDBValidKey; value: unknown }[]>((resolve, reject) => {
      const opening = indexedDB.open('localforage');
      opening.onerror = () => reject(opening.error);
      opening.onsuccess = () => {
        const database = opening.result;
        if (!database.objectStoreNames.contains('keyvaluepairs')) {
          database.close();
          resolve([]);
          return;
        }
        const transaction = database.transaction('keyvaluepairs', 'readonly');
        const entries: { key: IDBValidKey; value: unknown }[] = [];
        const cursor = transaction.objectStore('keyvaluepairs').openCursor();
        cursor.onsuccess = () => {
          const entry = cursor.result;
          if (!entry) return;
          entries.push({ key: entry.key, value: entry.value });
          entry.continue();
        };
        transaction.oncomplete = () => {
          database.close();
          resolve(entries);
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      };
    });
  });
  // Decode outside the app: its global JSON.parse revives ISO strings into Dates.
  const drafts: IStudentDraftSnapshot[] = [];
  for (const entry of entries) {
    try {
      if (typeof entry.key !== 'string') continue;
      const namespace = JSON.parse(entry.key);
      if (
        !Array.isArray(namespace) ||
        namespace.length !== 5 ||
        namespace[0] !== 'zova-model-db' ||
        namespace[1] !== 1 ||
        namespace[2] !== current.appName ||
        JSON.stringify(namespace[3]) !== JSON.stringify(current.scope) ||
        typeof namespace[4] !== 'string'
      ) {
        continue;
      }
      const query = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
      if (query?.queryKey?.[0] !== 'start-pageentry.model.draft') continue;
      const identity = JSON.parse(query.queryKey[1]);
      const snapshot = query.state?.data;
      if (identity[0] === 'training-student:student' && snapshot?.projection?.values) {
        drafts.push({
          storageKey: entry.key,
          namespace,
          identity,
          queryKey: query.queryKey,
          schemaSignature: snapshot.schemaSignature,
          baselineSignature: snapshot.baselineSignature,
          mode: identity[1],
          id: identity[2] ?? undefined,
          values: snapshot.projection.values,
          relations: snapshot.projection.relations,
          undefinedPaths: snapshot.projection.undefinedPaths,
        });
      }
    } catch {
      // Other persisted models are not draft envelopes.
    }
  }
  return drafts;
}

async function waitForStudentDraft(page: Page, name: string, id?: string | number) {
  await expect
    .poll(async () => {
      return (await readStudentDrafts(page)).some(
        draft =>
          draft.mode === (id === undefined ? 'create' : 'edit') &&
          draft.id === (id === undefined ? undefined : String(id)) &&
          draft.values.name === name,
      );
    })
    .toBe(true);
}

async function expectNoStudentDraft(page: Page, id?: string | number) {
  await expect
    .poll(async () => {
      return (await readStudentDrafts(page)).filter(
        draft =>
          draft.mode === (id === undefined ? 'create' : 'edit') &&
          draft.id === (id === undefined ? undefined : String(id)),
      ).length;
    })
    .toBe(0);
}

async function reloadStudentDraft(page: Page) {
  await page.reload({ waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
  await expect(
    studentDraftBanner(page).getByRole('button', { name: 'Recover draft', exact: true }),
  ).toBeVisible();
}

async function recoverStudentDraft(page: Page) {
  await studentDraftBanner(page)
    .getByRole('button', { name: 'Recover draft', exact: true })
    .click();
  // Edit recovery rechecks the server baseline before replacing live values.
  await expect(studentDraftBanner(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
}

function studentDraftTrainingRecords(page: Page) {
  return page.locator('[role="tabpanel"]').filter({
    has: page.getByLabel('Training Stage', { exact: true }),
  });
}

function studentDraftTrainingRow(page: Page, name: string) {
  return studentDraftTrainingRecords(page)
    .locator('tbody tr')
    .filter({ has: page.getByRole('button', { name, exact: true }) });
}

function trainingTimeInput(dialog: Locator) {
  return dialog.getByLabel('Training Time', { exact: true });
}

async function browserLocalDateIso(page: Page, value: string) {
  // Keep date-only input at midnight in the browser timezone, matching the Start date field.
  return page.evaluate(date => new Date(`${date}T00:00:00`).toISOString(), value);
}

async function readStudentTrainingDraft(page: Page, id?: string | number) {
  const draft = (await readStudentDrafts(page)).find(
    draft =>
      draft.mode === (id === undefined ? 'create' : 'edit') &&
      draft.id === (id === undefined ? undefined : String(id)),
  );
  return {
    rows: draft?.values.trainingRecords as Record<string, unknown>[] | undefined,
    identities: draft?.relations[JSON.stringify(['trainingRecords'])],
    trainingTimeCleared: draft?.undefinedPaths.includes(
      JSON.stringify(['trainingRecords', 0, 'trainingTime']),
    ),
  };
}

async function openStudentDraftCreate(page: Page) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(studentResourceUrl);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
  await expect(studentDraftNameInput(page)).toBeVisible();
}

async function openStudentDraftEdit(page: Page, name: string, id: string | number) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(studentResourceUrl);
  await page.getByLabel('Student Name').fill(name);
  const select = waitForStudentSelect(page);
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await select;
  const row = page
    .locator('tbody tr')
    .filter({ has: page.getByRole('button', { name, exact: true }) });
  await expect(row).toHaveCount(1);
  await row.locator('button.v-btn--icon.text-primary').click();
  await expect(page).toHaveURL(
    new RegExp(`/training-student(?:%3A|:)student/${id}/edit(?:[?#]|$)`),
  );
  await expect(studentDraftNameInput(page)).toHaveValue(name);
}

async function withDraftStudents(
  page: Page,
  count: number,
  run: (
    students: { id: string | number; name: string }[],
    headers: Record<string, string>,
  ) => Promise<void>,
) {
  const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
  expect(token).toBeTruthy();
  const headers = { Authorization: `Bearer ${token}` };
  const students: { id: string | number; name: string }[] = [];
  try {
    for (let index = 0; index < count; index++) {
      const name = `Draft E2E ${Date.now()} ${index}`;
      const response = await page.request.post('/api/training/student', {
        headers,
        data: { name, mobile: '13812345678', level: 1 },
      });
      expect(response.ok()).toBeTruthy();
      const id = (await response.json()).data;
      expect(['string', 'number']).toContain(typeof id);
      students.push({ id, name });
    }
    await run(students, headers);
  } finally {
    if (students.length) {
      let cleanupToken = (await page.context().cookies()).find(
        cookie => cookie.name === 'token',
      )?.value;
      if (!cleanupToken || page.url().includes('/admin/login')) {
        await loginAsAdmin(page);
        cleanupToken = (await page.context().cookies()).find(
          cookie => cookie.name === 'token',
        )?.value;
      }
      expect(cleanupToken).toBeTruthy();
      let cleanupHeaders = { Authorization: `Bearer ${cleanupToken}` };
      const failures: string[] = [];
      for (const student of students.toReversed()) {
        let response = await page.request.delete(
          `/api/training/student/deleteForce/${student.id}`,
          { headers: cleanupHeaders },
        );
        if (response.status() === 401) {
          await loginAsAdmin(page);
          cleanupToken = (await page.context().cookies()).find(
            cookie => cookie.name === 'token',
          )?.value;
          expect(cleanupToken).toBeTruthy();
          cleanupHeaders = { Authorization: `Bearer ${cleanupToken}` };
          response = await page.request.delete(`/api/training/student/deleteForce/${student.id}`, {
            headers: cleanupHeaders,
          });
        }
        if (!response.ok() && response.status() !== 404) {
          failures.push(`Draft fixture cleanup ${student.id}: ${response.status()}`);
        }
      }
      expect(failures).toEqual([]);
    }
  }
}

function studentDraftLevelOption(page: Page, title: string) {
  return page.locator('.v-chip-group .v-chip').filter({
    has: page.getByText(title, { exact: true }),
  });
}

function studentDraftWorkspaceTabs(page: Page) {
  return page.getByRole('banner').locator('.v-toolbar__extension .v-tabs');
}

function studentDraftTaskTabs(page: Page) {
  return page.getByRole('banner').locator('.v-toolbar__content .v-tabs');
}

async function changeStudentDraftLocale(page: Page, title: 'Chinese' | '英语') {
  const activator = page
    .getByRole('banner')
    .getByRole('button')
    .filter({
      has: page.locator('svg use[*|href*="language"]'),
    });
  await expect(activator).toHaveCount(1);
  await activator.click();
  const list = page.locator('.v-overlay--active').getByRole('list');
  await list.getByText(title, { exact: true }).click();
  await expect(list).toBeHidden();
}

async function fillTrainingTime(page: Page, dialog: Locator, value: string) {
  // Start currently renders a labeled VTextField, not Basic's native date input.
  // Enter an unambiguous local-midnight ISO through the UI; never patch form state.
  await trainingTimeInput(dialog).fill(await browserLocalDateIso(page, value));
  await trainingTimeInput(dialog).blur();
}

async function expectTrainingTime(page: Page, dialog: Locator, value: string) {
  const formatted = await page.evaluate(date => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
  }, value);
  await expect(trainingTimeInput(dialog)).toHaveValue(formatted);
}

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

async function expectSiteEntryTables(page: Page, integratedTitle: string, standaloneTitle: string) {
  await expect(page.getByText(integratedTitle, { exact: true })).toBeVisible();
  await expect(page.getByText(standaloneTitle, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'http://localhost:7102/', exact: true }),
  ).toHaveAttribute('href', 'http://localhost:7102/');
  await expect(
    page.getByRole('link', { name: 'http://localhost:7102/admin/', exact: true }),
  ).toHaveAttribute('href', 'http://localhost:7102/admin/');
  await expect(
    page.getByRole('link', { name: 'http://localhost:9000/', exact: true }),
  ).toHaveAttribute('href', 'http://localhost:9000/');
  await expect(
    page.getByRole('link', { name: 'http://localhost:9000/admin/', exact: true }),
  ).toHaveAttribute('href', 'http://localhost:9000/admin/');
  await expect(page.locator('a[href^="http://localhost:"]')).toHaveCount(4);
  await expect(page.getByText(/Commerce/)).toHaveCount(0);
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
  const dashboardResponse = await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expectSiteEntryTables(page, 'Vona integrated SSR', 'Zova standalone SSR');
  return dashboardResponse;
}

async function openStudentListPage(page: Page) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/,
  );
  await expect(page.getByLabel('Student Name', { exact: true })).toBeVisible();
}

function waitForStudentSelect(page: Page, requireSuccess = true) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      (!requireSuccess || response.ok()) &&
      url.pathname === '/api/training/student' &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

async function reloadStudentListPage(page: Page) {
  await page.reload({ waitUntil: 'load' });
  await expect(page.getByLabel('Student Name', { exact: true })).toBeVisible();
}

function waitForStudentBulkDelete(page: Page, requireSuccess = true) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'POST' &&
      (!requireSuccess || response.ok()) &&
      url.pathname === '/api/training/student/bulk/delete'
    );
  });
}

function waitForLayoutProfileSave(page: Page) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'POST' &&
      response.ok() &&
      url.pathname === '/api/layoutprofile/save'
    );
  });
}

function studentRow(page: Page, name: string) {
  return page.getByRole('row').filter({ has: page.getByText(name, { exact: true }) });
}

async function headerIndex(header: Locator) {
  return await header.evaluate(element =>
    Array.from(element.parentElement!.children).indexOf(element),
  );
}

async function createStudentFixture(page: Page, name: string, mobile: string) {
  const accessToken = (await page.context().cookies()).find(
    cookie => cookie.name === 'token',
  )?.value;
  expect(accessToken).toBeTruthy();
  const result = await page.evaluate(
    async ({ data, accessToken }) => {
      const response = await fetch('/api/training/student', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return { ok: response.ok, data: (await response.json()).data };
    },
    { data: { name, mobile, level: 1 }, accessToken },
  );
  expect(result.ok).toBeTruthy();
  return result.data as string | number;
}

async function deleteStudentFixture(page: Page, id: string | number | undefined) {
  if (id === undefined) return;
  const accessToken = (await page.context().cookies()).find(
    cookie => cookie.name === 'token',
  )?.value;
  if (!accessToken) return;
  await page.evaluate(
    async ({ id, accessToken }) => {
      await fetch(`/api/training/student/deleteForce/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    { id, accessToken },
  );
}

async function openStudentCreatePage(page: Page) {
  await openStudentListPage(page);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student\/create(?:[/?#]|$)/,
  );
  await expect(page.getByRole('group', { name: 'Student Profile' })).toBeVisible();
}

async function openTrainingRecordCreatePage(page: Page) {
  const response = await page.goto('/admin/rest/resource/training-record%3Arecord/create', {
    waitUntil: 'load',
  });
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL(
    /\/admin\/rest\/resource\/training-record(?:%3A|:|%253A)record\/create(?:[/?#]|$)/,
  );
  await expect(page.getByLabel('Training Record Name', { exact: true })).toBeVisible();
}

async function overrideStudentFilterBlocks(page: Page, mode: 'omit' | 'empty'): Promise<void> {
  await page.route('**/api/training/student**', async route => {
    const request = route.request();
    if (request.method() !== 'GET' || request.headers()['x-vona-openapi-schema'] !== 'true') {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const payload = await response.json();
    const schemas = payload.data.doc.components.schemas as Record<string, any>;
    const component = Object.values(schemas).find(item => item.properties?._operationsRow) as any;
    const filterBlock = component.rest.blocks[0].options.blocks[0];
    if (mode === 'omit') {
      delete filterBlock.options.blocks;
    } else {
      filterBlock.options.blocks = [];
    }
    await route.fulfill({ response, json: payload });
  });
}

async function expectStudentFilterFallback(page: Page) {
  const filterForm = page.locator('form').filter({
    has: page.getByLabel('Student Name', { exact: true }),
  });
  const container = filterForm.locator(':scope > .v-container');
  await expect(filterForm).toHaveCount(1);
  await expect(container).toHaveCount(1);
  await expect(container.locator(':scope > .v-row')).toHaveCount(1);
  await expect(page.getByLabel('Student Name', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Training Stage', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Created At', { exact: true })).toBeVisible();
  await expect(filterForm.getByRole('button', { name: 'Search', exact: true })).toHaveCount(1);
  await expect(filterForm.getByRole('button', { name: 'Reset', exact: true })).toHaveCount(1);
}

interface IGridGeometry {
  row: { left: number; right: number; top: number; width: number };
  columns: Array<{ left: number; right: number; top: number; bottom: number; width: number }>;
  fieldset: { clientWidth: number; scrollWidth: number };
  document: { clientWidth: number; scrollWidth: number };
}

interface ITableFooterGeometry {
  footer: {
    display: string;
    flexWrap: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    height: number;
    clientWidth: number;
    scrollWidth: number;
  };
  regions: Array<{ left: number; right: number; top: number; bottom: number }>;
  select: { width: number; height: number };
  info: { width: number };
  pagination: {
    display: string;
    alignItems: string;
    height: number;
    clientWidth: number;
    scrollWidth: number;
  };
  buttons: Array<{ width: number; height: number }>;
}

interface IFlowGeometry {
  container: {
    left: number;
    right: number;
    width: number;
    clientWidth: number;
    scrollWidth: number;
  };
  flow: {
    display: string;
    flexWrap: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    clientWidth: number;
    scrollWidth: number;
  };
  leaves: Array<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    clientWidth: number;
    scrollWidth: number;
  }>;
  form: { clientWidth: number; scrollWidth: number };
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

async function getTableFooterGeometry(footer: Locator): Promise<ITableFooterGeometry> {
  return await footer.evaluate(element => {
    const footerRect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const select = element.querySelector('.v-data-table-footer__items-per-page > .v-select')!;
    const info = element.querySelector('.v-data-table-footer__info')!;
    const pagination = element.querySelector('.v-data-table-footer__pagination')!;
    const paginationStyle = getComputedStyle(pagination);
    const selectRect = select.getBoundingClientRect();
    const infoRect = info.getBoundingClientRect();
    return {
      footer: {
        display: style.display,
        flexWrap: style.flexWrap,
        left: footerRect.left,
        right: footerRect.right,
        top: footerRect.top,
        bottom: footerRect.bottom,
        height: footerRect.height,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      },
      regions: Array.from(element.children).map(region => {
        const rect = region.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      }),
      select: { width: selectRect.width, height: selectRect.height },
      info: { width: infoRect.width },
      pagination: {
        display: paginationStyle.display,
        alignItems: paginationStyle.alignItems,
        height: pagination.getBoundingClientRect().height,
        clientWidth: pagination.clientWidth,
        scrollWidth: pagination.scrollWidth,
      },
      buttons: Array.from(pagination.querySelectorAll('.v-pagination .v-btn')).map(button => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    };
  });
}

function getVerticalBands(regions: ITableFooterGeometry['regions']) {
  const bands: Array<{ top: number; bottom: number }> = [];
  for (const region of regions.toSorted((left, right) => left.top - right.top)) {
    const band = bands.at(-1);
    if (band && region.top <= band.bottom + 1) {
      band.bottom = Math.max(band.bottom, region.bottom);
    } else {
      bands.push({ top: region.top, bottom: region.bottom });
    }
  }
  return bands;
}

async function getFlowGeometry(flow: Locator): Promise<IFlowGeometry> {
  return await flow.evaluate(element => {
    const flowRect = element.getBoundingClientRect();
    const container = element.closest('.v-container')!;
    const containerRect = container.getBoundingClientRect();
    const style = getComputedStyle(element);
    const leaves = Array.from(element.querySelectorAll(':scope > div'));
    const form = element.closest('form')!;
    const documentElement = document.documentElement;
    return {
      container: {
        left: containerRect.left,
        right: containerRect.right,
        width: containerRect.width,
        clientWidth: container.clientWidth,
        scrollWidth: container.scrollWidth,
      },
      flow: {
        display: style.display,
        flexWrap: style.flexWrap,
        left: flowRect.left,
        right: flowRect.right,
        top: flowRect.top,
        bottom: flowRect.bottom,
        width: flowRect.width,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      },
      leaves: leaves.map(leaf => {
        const rect = leaf.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          clientWidth: leaf.clientWidth,
          scrollWidth: leaf.scrollWidth,
        };
      }),
      form: { clientWidth: form.clientWidth, scrollWidth: form.scrollWidth },
      document: {
        clientWidth: documentElement.clientWidth,
        scrollWidth: documentElement.scrollWidth,
      },
    };
  });
}

function expectFlowGeometry(geometry: IFlowGeometry, tolerance: number) {
  expect(geometry.flow.left).toBeGreaterThanOrEqual(geometry.container.left - tolerance);
  expect(geometry.flow.right).toBeLessThanOrEqual(geometry.container.right + tolerance);
  expect(geometry.container.scrollWidth).toBeLessThanOrEqual(
    geometry.container.clientWidth + tolerance,
  );
  expect(geometry.flow.display).toBe('flex');
  expect(geometry.flow.flexWrap).toBe('wrap');
  for (const leaf of geometry.leaves) {
    expect(leaf.width).toBeGreaterThan(tolerance);
    expect(leaf.height).toBeGreaterThan(tolerance);
    expect(leaf.left).toBeGreaterThanOrEqual(geometry.flow.left - tolerance);
    expect(leaf.right).toBeLessThanOrEqual(geometry.flow.right + tolerance);
    expect(leaf.scrollWidth).toBeLessThanOrEqual(leaf.clientWidth + tolerance);
  }
  for (let index = 0; index < geometry.leaves.length; index++) {
    const current = geometry.leaves[index]!;
    const next = geometry.leaves[index + 1];
    if (next) {
      const sameLine = Math.abs(next.top - current.top) <= tolerance;
      if (sameLine) {
        expect(next.left).toBeGreaterThanOrEqual(current.right - tolerance);
      } else {
        expect(next.top).toBeGreaterThan(current.top + tolerance);
      }
    }
    for (const other of geometry.leaves.slice(index + 1)) {
      const overlaps =
        current.left < other.right - tolerance &&
        current.right > other.left + tolerance &&
        current.top < other.bottom - tolerance &&
        current.bottom > other.top + tolerance;
      expect(overlaps).toBe(false);
    }
  }
  expect(geometry.flow.scrollWidth).toBeLessThanOrEqual(geometry.flow.clientWidth + tolerance);
  expect(geometry.form.scrollWidth).toBeLessThanOrEqual(geometry.form.clientWidth + tolerance);
  expect(geometry.document.scrollWidth).toBeLessThanOrEqual(
    geometry.document.clientWidth + tolerance,
  );
}

test(
  'ATP-START-SSR-01: anonymous Web HTML hydrates through the default site',
  { tag: ['@web', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['cache-control']).toBe('public, max-age=600');
    const html = await response.text();
    expect(html).toContain('data-server-rendered');
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('ssr-body-ready-observer');
    expect(html).not.toContain('__leftDrawerOpenJS');

    const routeOverrideResponse = await request.get('/demo/basic/component');
    expect(routeOverrideResponse.ok()).toBeTruthy();
    expect(routeOverrideResponse.headers()['cache-control']).toBe(
      'no-cache, no-store, must-revalidate',
    );

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expectSiteEntryTables(page, 'Vona integrated SSR', 'Zova standalone SSR');
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
    await expectSiteEntryTables(page, 'Vona 集成式 SSR', 'Zova 独立式 SSR');
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-SSR-02: anonymous Admin redirects to and hydrates the login page',
  { tag: ['@admin', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/admin/', { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers()['cache-control']).toBe('private, no-store');
    const loginPath = response.headers().location;
    expect(loginPath).toMatch(/^\/admin\/login(?:\?|$)/);

    const loginResponse = await request.get(loginPath!);
    expect(loginResponse.ok()).toBeTruthy();
    const html = await loginResponse.text();
    expect(html).toContain('data-server-rendered');
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('ssr-body-ready-observer');
    expect(html).not.toContain('__leftDrawerOpenJS');

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
  'ATP-START-FLOW-02: admin can access system management resources',
  { tag: ['@admin', '@smoke'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    await expect(page.getByText('System Management', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'User', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Role', exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'User', exact: true }).click();
    await expect(page).toHaveURL(
      /\/admin\/rest\/resource\/admin-user(?:%3A|:|%253A)user(?:[/?#]|$)/,
    );

    await page.goto('/admin/', { waitUntil: 'load' });
    await page.getByRole('link', { name: 'Role', exact: true }).click();
    await expect(page).toHaveURL(
      /\/admin\/rest\/resource\/admin-role(?:%3A|:|%253A)role(?:[/?#]|$)/,
    );
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-LAYOUT-01: Admin drawer follows viewport breakpoint changes',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    const dashboardResponse = await loginAsAdmin(page);
    expect(dashboardResponse?.ok()).toBeTruthy();
    expect(dashboardResponse?.headers()['cache-control']).toBe('private, no-store');
    const dashboardHtml = await dashboardResponse!.text();
    expect(dashboardHtml).toMatch(/<body[^>]+style="[^"]*display:none;/);
    expect(dashboardHtml).toContain('__leftDrawerOpenJS');
    expect(dashboardHtml).toContain('ssr-body-ready-observer');

    const drawer = page.locator('.v-navigation-drawer--left');
    await expect(drawer).toHaveClass(/\bv-navigation-drawer--active\b/);

    await page.setViewportSize({ width: 1023, height: 900 });
    await expect(drawer).not.toHaveClass(/\bv-navigation-drawer--active\b/);

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(drawer).toHaveClass(/\bv-navigation-drawer--active\b/);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-TABLE-01: Student table submits server sorting and applies column metadata',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const studentName = `Table E2E ${Date.now()}`;
    const accessToken = (await page.context().cookies()).find(
      cookie => cookie.name === 'token',
    )?.value;
    expect(accessToken).toBeTruthy();
    let studentId: string | number | undefined;
    try {
      const createResult = await page.evaluate(
        async ({ data, accessToken }) => {
          const response = await fetch('/api/training/student', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          return { ok: response.ok, data: (await response.json()).data };
        },
        { data: { name: studentName, mobile: '13812345678', level: 1 }, accessToken },
      );
      expect(createResult.ok).toBeTruthy();
      studentId = createResult.data;
      expect(['string', 'number']).toContain(typeof studentId);

      const initialSelect = waitForStudentSelect(page);
      await openStudentListPage(page);
      const initial = await initialSelect;
      const initialUrl = new URL(initial.url());
      expect(initialUrl.searchParams.has('orders')).toBe(false);
      const tableBlock = page.locator('div[data-table-compact]').filter({
        has: page.getByRole('columnheader', { name: 'Operations', exact: true }),
      });
      await expect(tableBlock).toHaveAttribute('data-table-compact', 'false');
      expect(await tableBlock.evaluate(element => element.clientWidth)).toBeGreaterThanOrEqual(768);

      const nameHeader = page.getByRole('columnheader', { name: 'Student Name', exact: true });
      const levelHeader = page.getByRole('columnheader', { name: 'Training Stage', exact: true });
      const operationsHeader = page.getByRole('columnheader', { name: 'Operations', exact: true });
      await expect(nameHeader).toBeVisible();
      await expect(levelHeader).toBeVisible();
      await expect(operationsHeader).toBeVisible();
      await expect(nameHeader).toHaveCSS('position', 'sticky');
      await expect(nameHeader).toHaveCSS('min-width', '240px');
      await expect(nameHeader).toHaveCSS('text-align', 'start');
      await expect(nameHeader).toHaveClass(/\bv-data-table__th--sortable\b/);
      await expect(nameHeader).not.toHaveClass(/\bv-data-table__th--sorted\b/);
      await expect(nameHeader.locator('.v-data-table-header__sort-icon')).toHaveCSS(
        'opacity',
        '0.5',
      );
      await expect(operationsHeader).toHaveCSS('position', 'sticky');
      await expect(operationsHeader).toHaveCSS('min-width', '360px');
      await expect(operationsHeader).toHaveCSS('text-align', 'center');
      await expect(operationsHeader.locator('.v-data-table-header__sort-icon')).toHaveCount(0);

      const bulkToolbar = page.getByRole('toolbar', { name: 'Bulk Actions' });
      await expect(bulkToolbar).toBeVisible();
      const bulkToolbarIconActionSizes = await bulkToolbar
        .locator(':scope > .v-btn-group--horizontal.v-btn-group--density-compact > .v-btn--icon')
        .evaluateAll(buttons => {
          return buttons.map(button => {
            const { width, height } = button.getBoundingClientRect();
            return { width, height };
          });
        });
      expect(bulkToolbarIconActionSizes).toHaveLength(2);
      for (const { width, height } of bulkToolbarIconActionSizes) {
        expect(width).toBeCloseTo(36);
        expect(height).toBeCloseTo(36);
      }

      const studentRow = page.getByRole('row').filter({ hasText: studentName });
      await expect(studentRow).toBeVisible();
      const iconActionSizes = await studentRow
        .locator('.v-btn-group--horizontal.v-btn-group--density-compact > .v-btn--icon')
        .evaluateAll(buttons => {
          return buttons.map(button => {
            const { width, height } = button.getBoundingClientRect();
            return { width, height };
          });
        });
      expect(iconActionSizes.length).toBeGreaterThanOrEqual(2);
      for (const { width, height } of iconActionSizes) {
        expect(width).toBeCloseTo(36);
        expect(height).toBeCloseTo(36);
      }

      const descendingResponse = waitForStudentSelect(page, false);
      await nameHeader.click();
      const descending = await descendingResponse;
      expect(descending.status()).toBe(200);
      const descendingUrl = new URL(descending.url());
      expect(JSON.parse(descendingUrl.searchParams.get('orders')!)).toEqual([['name', 'desc']]);
      await expect(nameHeader).toHaveClass(/\bv-data-table__th--sorted\b/);
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      await expect(nameHeader.locator('.v-data-table-header__sort-icon')).toHaveCSS('opacity', '1');

      const ascendingResponse = waitForStudentSelect(page, false);
      await nameHeader.click();
      const ascending = await ascendingResponse;
      expect(ascending.status()).toBe(200);
      const ascendingUrl = new URL(ascending.url());
      expect(JSON.parse(ascendingUrl.searchParams.get('orders')!)).toEqual([['name', 'asc']]);
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      await expect(nameHeader.locator('.v-data-table-header__sort-icon')).toHaveCSS('opacity', '1');

      // This repeats the initial descending query, so the model may serve it from its query cache.
      await nameHeader.click();
      await expect(nameHeader).toHaveClass(/\bv-data-table__th--sorted\b/);
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      await expect(nameHeader.locator('.v-data-table-header__sort-icon')).toHaveCSS('opacity', '1');

      const levelAscendingResponse = waitForStudentSelect(page, false);
      await levelHeader.click();
      const levelAscending = await levelAscendingResponse;
      expect(levelAscending.status()).toBe(200);
      const levelAscendingUrl = new URL(levelAscending.url());
      expect(JSON.parse(levelAscendingUrl.searchParams.get('orders')!)).toEqual([['level', 'asc']]);
      await expect(levelHeader).toHaveAttribute('aria-sort', 'ascending');

      // Returning to the same descending query may use the warmed query cache.
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

      const tableWrapper = page
        .locator('.v-table__wrapper')
        .filter({ has: page.locator('table') })
        .first();
      await expect(tableWrapper).toBeVisible();
      expect(
        await tableWrapper.evaluate(element => element.scrollWidth > element.clientWidth),
      ).toBeTruthy();
      await tableWrapper.evaluate(element => {
        element.scrollLeft = element.scrollWidth;
      });
      await expect(operationsHeader).toHaveCSS('position', 'sticky');

      // Header widths and desktop row actions above require a genuinely wide container.
      // Keep the footer's existing 800px/390px viewport geometry coverage independent.
      await page.setViewportSize({ width: 800, height: 900 });
      const footer = page.locator('.v-data-table-footer').first();
      await expect(footer).toBeVisible();
      const footerGeometry = await getTableFooterGeometry(footer);
      expect(footerGeometry.footer.display).toBe('flex');
      expect(footerGeometry.footer.flexWrap).toBe('wrap');
      expect(footerGeometry.footer.height).toBeCloseTo(36);
      expect(getVerticalBands(footerGeometry.regions)).toHaveLength(1);
      expect(footerGeometry.select.width).toBeCloseTo(88);
      expect(footerGeometry.select.height).toBeCloseTo(36);
      expect(footerGeometry.info.width).toBeGreaterThanOrEqual(96);
      expect(footerGeometry.pagination.display).toBe('flex');
      expect(footerGeometry.pagination.alignItems).toBe('center');
      expect(footerGeometry.pagination.height).toBeCloseTo(36);
      expect(footerGeometry.buttons.length).toBeGreaterThanOrEqual(4);
      for (const { width, height } of footerGeometry.buttons) {
        expect(width).toBeGreaterThanOrEqual(36);
        expect(height).toBeCloseTo(36);
      }

      await page.setViewportSize({ width: 390, height: 900 });
      await expect
        .poll(async () => {
          const geometry = await getTableFooterGeometry(footer);
          return (
            geometry.footer.flexWrap === 'wrap' &&
            geometry.footer.height > 36 &&
            getVerticalBands(geometry.regions).length > 1
          );
        })
        .toBe(true);
      const narrowFooterGeometry = await getTableFooterGeometry(footer);
      expect(narrowFooterGeometry.footer.height).toBeGreaterThan(36);
      expect(getVerticalBands(narrowFooterGeometry.regions).length).toBeGreaterThan(1);
      expect(narrowFooterGeometry.footer.scrollWidth).toBeLessThanOrEqual(
        narrowFooterGeometry.footer.clientWidth + 1,
      );
      expect(narrowFooterGeometry.pagination.scrollWidth).toBeLessThanOrEqual(
        narrowFooterGeometry.pagination.clientWidth + 1,
      );
      for (const region of narrowFooterGeometry.regions) {
        expect(region.left).toBeGreaterThanOrEqual(narrowFooterGeometry.footer.left - 1);
        expect(region.right).toBeLessThanOrEqual(narrowFooterGeometry.footer.right + 1);
      }
      expect(narrowFooterGeometry.select.width).toBeCloseTo(88);
      expect(narrowFooterGeometry.select.height).toBeCloseTo(36);
      for (const { width, height } of narrowFooterGeometry.buttons) {
        expect(width).toBeGreaterThanOrEqual(36);
        expect(height).toBeCloseTo(36);
      }

      expect(pageErrors).toEqual([]);
    } finally {
      if (studentId !== undefined) {
        const deleteResult = await page.evaluate(
          async ({ id, accessToken }) => {
            const response = await fetch(`/api/training/student/deleteForce/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            return { ok: response.ok };
          },
          { id: studentId, accessToken },
        );
        expect(deleteResult.ok).toBeTruthy();
      }
    }
  },
);

test(
  'ATP-START-TABLE-02: Student table deletes selected rows through the Resource bulk contract',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const suffix = Date.now();
    const firstName = `Bulk E2E A ${suffix}`;
    const secondName = `Bulk E2E B ${suffix}`;
    let firstId: string | number | undefined;
    let secondId: string | number | undefined;
    try {
      firstId = await createStudentFixture(page, firstName, '13812345678');
      secondId = await createStudentFixture(page, secondName, '13812345679');

      const loaded = waitForStudentSelect(page);
      await openStudentListPage(page);
      await loaded;

      const bulkActions = page.locator('[aria-label="Bulk actions"]');
      const select = bulkActions.getByRole('button', { name: 'Select', exact: true });
      await expect(select).toBeVisible();
      const deleteSelected = bulkActions.getByRole('button', {
        name: 'Bulk Delete',
        exact: true,
      });
      await expect(deleteSelected).toBeDisabled();

      await select.click();
      const done = bulkActions.getByRole('button', { name: 'Done', exact: true });
      const create = bulkActions.getByRole('button', { name: 'Create', exact: true });
      const selectedCount = bulkActions.getByRole('status');
      const deleteButtonRoot = deleteSelected;
      await expect(done).toBeVisible();
      await expect(create).toBeVisible();
      await expect(selectedCount).toHaveText('0 selected');
      await expect(deleteButtonRoot).toHaveCount(1);
      await expect
        .poll(async () => {
          const [deleteHeight, createHeight, doneHeight] = await Promise.all(
            [deleteButtonRoot, create, done].map(button =>
              button.evaluate(element => element.getBoundingClientRect().height),
            ),
          );
          return Math.max(
            Math.abs(deleteHeight - createHeight),
            Math.abs(deleteHeight - doneHeight),
          );
        })
        .toBeLessThanOrEqual(1);
      await expect(
        page.getByRole('columnheader').filter({ has: page.getByRole('checkbox') }),
      ).toHaveCount(1);

      const firstRow = studentRow(page, firstName);
      const secondRow = studentRow(page, secondName);
      await expect(firstRow).toBeVisible();
      await expect(secondRow).toBeVisible();
      await firstRow.getByRole('checkbox').check();
      await secondRow.getByRole('checkbox').check();
      await expect(bulkActions.getByText('2 selected', { exact: true })).toBeVisible();
      await expect(deleteSelected).toBeEnabled();

      await deleteSelected.click();
      const cancelledConfirmation = page.getByRole('dialog');
      await expect(
        cancelledConfirmation.getByText('Are you sure you want to delete 2 selected items?', {
          exact: true,
        }),
      ).toBeVisible();
      await cancelledConfirmation.getByRole('button', { name: 'No', exact: true }).click();
      await expect(cancelledConfirmation).toBeHidden();
      await expect(bulkActions.getByText('2 selected', { exact: true })).toBeVisible();
      await expect(firstRow.getByRole('checkbox')).toBeChecked();
      await expect(secondRow.getByRole('checkbox')).toBeChecked();

      await deleteSelected.click();
      const confirmation = page.getByRole('dialog');
      const deleted = waitForStudentBulkDelete(page);
      const refetched = waitForStudentSelect(page);
      await confirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const deletedResponse = await deleted;
      expect(deletedResponse.request().postDataJSON()).toEqual({ ids: [firstId, secondId] });
      await refetched;
      await expect(studentRow(page, firstName)).toHaveCount(0);
      await expect(studentRow(page, secondName)).toHaveCount(0);
      await expect(bulkActions.getByText('0 selected', { exact: true })).toBeVisible();
      await expect(deleteSelected).toBeDisabled();
      expect(pageErrors).toEqual([]);
    } finally {
      await deleteStudentFixture(page, firstId);
      await deleteStudentFixture(page, secondId);
    }
  },
);

test(
  'ATP-START-TABLE-03: Student column configuration persists for the authenticated user across reload',
  { tag: ['@admin', '@flow', '@layout'] },
  async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    const admin = await loginAsAdminApi(request);
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Student', exact: true }).waitFor();
    let layoutKey: string | undefined;
    try {
      const loaded = waitForStudentSelect(page);
      await openStudentListPage(page);
      await loaded;
      layoutKey = new URL(page.url()).pathname.replace(/^\/admin/, '');

      const toolbar = page.getByRole('toolbar', { name: 'Bulk actions' });
      await toolbar.getByRole('button', { name: 'Column Configuration', exact: true }).click();
      const dialog = page.getByRole('dialog').filter({
        hasText: 'Column Configuration',
      });
      await expect(dialog).toBeVisible();
      await dialog.getByLabel('Visible Student Image', { exact: true }).uncheck();
      await dialog.getByLabel('Width Student Name', { exact: true }).fill('320');
      const levelRow = dialog.getByRole('group', { name: 'Training Stage', exact: true });
      const mobileRow = dialog.getByRole('group', { name: 'Mobile', exact: true });
      await expect(levelRow).toBeVisible();
      await expect(mobileRow).toBeVisible();
      await levelRow.getByRole('button', { name: 'Move up', exact: true }).click();
      await levelRow.getByRole('button', { name: 'Move up', exact: true }).click();

      const saved = waitForLayoutProfileSave(page);
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const savedResponse = await saved;
      const savedProfile = savedResponse.request().postDataJSON() as {
        layoutKey: string;
        profile: {
          version: number;
          columns: Array<{ key: string; visible: boolean; width: number | 'auto' }>;
        };
      };
      expect(savedProfile.layoutKey).toBe(layoutKey);
      expect(savedProfile.profile.version).toBe(1);
      expect(savedProfile.profile.columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'imageId', visible: false }),
          expect.objectContaining({ key: 'name', width: 320 }),
        ]),
      );
      const savedColumns = savedProfile.profile.columns;
      expect(savedColumns.findIndex(column => column.key === 'level')).toBeLessThan(
        savedColumns.findIndex(column => column.key === 'mobile'),
      );
      await expect(dialog).toBeHidden();

      const imageHeader = page.getByRole('columnheader', { name: 'Student Image', exact: true });
      const nameHeader = page.getByRole('columnheader', { name: 'Student Name', exact: true });
      const levelHeader = page.getByRole('columnheader', { name: 'Training Stage', exact: true });
      const mobileHeader = page.getByRole('columnheader', { name: 'Mobile', exact: true });
      await expect(imageHeader).toHaveCount(0);
      await expect(nameHeader).toHaveCSS('min-width', '320px');
      expect(await headerIndex(levelHeader)).toBeLessThan(await headerIndex(mobileHeader));

      await toolbar.getByRole('button', { name: 'Column Configuration', exact: true }).click();
      const resetDialog = page.getByRole('dialog').filter({
        hasText: 'Column Configuration',
      });
      const reset = page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          response.request().method() === 'DELETE' &&
          response.ok() &&
          url.pathname === '/api/layoutprofile/reset'
        );
      });
      await resetDialog.getByRole('button', { name: 'Reset', exact: true }).click();
      await resetDialog.getByRole('button', { name: 'Save', exact: true }).click();
      await reset;
      await expect(resetDialog).toBeHidden();
      await expect(
        page.getByRole('columnheader', { name: 'Student Image', exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Student Name', exact: true })).toHaveCSS(
        'min-width',
        '240px',
      );

      await toolbar.getByRole('button', { name: 'Column Configuration', exact: true }).click();
      const persistedDialog = page.getByRole('dialog').filter({
        hasText: 'Column Configuration',
      });
      await persistedDialog.getByLabel('Visible Student Image', { exact: true }).uncheck();
      await persistedDialog.getByLabel('Width Student Name', { exact: true }).fill('320');
      const persistedLevelRow = persistedDialog.getByRole('group', {
        name: 'Training Stage',
        exact: true,
      });
      await persistedLevelRow.getByRole('button', { name: 'Move up', exact: true }).click();
      await persistedLevelRow.getByRole('button', { name: 'Move up', exact: true }).click();
      const savedAgain = waitForLayoutProfileSave(page);
      await persistedDialog.getByRole('button', { name: 'Save', exact: true }).click();
      await savedAgain;
      await expect(persistedDialog).toBeHidden();

      await reloadStudentListPage(page);
      await expect(imageHeader).toHaveCount(0);
      await expect(nameHeader).toHaveCSS('min-width', '320px');
      expect(await headerIndex(levelHeader)).toBeLessThan(await headerIndex(mobileHeader));
      expect(pageErrors).toEqual([]);
    } finally {
      if (layoutKey) {
        await requestApiOk<null>(request, 'DELETE', '/api/layoutprofile/reset', {
          accessToken: admin.accessToken,
          params: { layoutKey },
        });
      }
    }
  },
);

test(
  'ATP-START-TABLE-04: compact Student row actions follow container width and survive dismissal and reload',
  { tag: ['@admin', '@flow', '@layout', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const wideViewport = { width: 1440, height: 900 };
    await page.setViewportSize(wideViewport);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const effects = collectDraftEffects(page, true);
      const profileWrites: string[] = [];
      page.on('request', request => {
        const path = new URL(request.url()).pathname;
        if (request.method() !== 'GET' && path.startsWith('/api/layoutprofile/')) {
          profileWrites.push(`${request.method()} ${path}`);
        }
      });
      const loaded = waitForStudentSelect(page);
      await openStudentListPage(page);
      await loaded;
      const listUrl = page.url();
      const tableBlock = page.locator('div[data-table-compact]').filter({
        has: page.getByRole('columnheader', { name: 'Operations', exact: true }),
      });
      const operationsHeader = tableBlock.getByRole('columnheader', {
        name: 'Operations',
        exact: true,
      });
      const nameHeader = tableBlock.getByRole('columnheader', {
        name: 'Student Name',
        exact: true,
      });
      const row = studentRow(page, student.name);
      const trigger = row.getByRole('button', { name: 'More actions', exact: true });
      const resolveActions = async () => {
        const id = (await trigger.count())
          ? await trigger.getAttribute('aria-controls')
          : await row.locator('[data-row-actions-content]').getAttribute('id');
        const popup = page.locator(`[id="${id}"]`);
        const actions = popup.getByRole('group', {
          name: 'Row actions',
          exact: true,
          includeHidden: true,
        });
        return {
          popup,
          actions,
          summary: actions.getByRole('button', {
            name: 'Summary',
            exact: true,
            includeHidden: true,
          }),
          forceDelete: actions.getByRole('button', {
            name: 'Force Delete',
            exact: true,
            includeHidden: true,
          }),
        };
      };
      let { popup, actions, summary, forceDelete } = await resolveActions();
      const expectNoDocumentOverflow = async () => {
        const geometry = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
      };
      const expectActionIcons = async () => {
        for (const name of ['Edit', 'Delete']) {
          const icon = actions.getByRole('button', { name, exact: true }).locator('.v-icon svg');
          await expect(icon).toBeVisible();
          await expect(icon.locator('use')).toHaveAttribute('xlink:href', /^#.+/);
        }
      };
      const openActions = async () => {
        // The operations column deliberately remains inside the table's horizontal scroller.
        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();
        await expect(popup).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(actions).toBeVisible();
        await expect(actions.getByRole('button', { name: 'Edit', exact: true })).toHaveText('Edit');
        await expect(actions.getByRole('button', { name: 'Delete', exact: true })).toHaveText(
          'Delete',
        );
        await expectActionIcons();
        const layout = await actions.evaluate(element => {
          const group = element.getBoundingClientRect();
          return Array.from(element.querySelectorAll('button')).map(button => {
            const rect = button.getBoundingClientRect();
            const style = getComputedStyle(button);
            return {
              width: rect.width,
              height: rect.height,
              left: rect.left - group.left,
              right: rect.right - group.right,
              top: rect.top,
              bottom: rect.bottom,
              borderWidth: style.borderTopWidth,
              radius: style.borderTopLeftRadius,
              justifyContent: style.justifyContent,
              textAlign: style.textAlign,
            };
          });
        });
        expect(layout).toHaveLength(4);
        for (const [index, button] of layout.entries()) {
          expect(button.width).toBeGreaterThanOrEqual(140);
          expect(button.height).toBeGreaterThanOrEqual(36);
          expect(Math.abs(button.left)).toBeLessThanOrEqual(1);
          expect(Math.abs(button.right)).toBeLessThanOrEqual(1);
          expect(button.borderWidth).toBe('0px');
          expect(button.radius).toBe('4px');
          expect(button.justifyContent).toBe('flex-start');
          expect(button.textAlign).toBe('left');
          if (index > 0) expect(button.top - layout[index - 1]!.bottom).toBeGreaterThanOrEqual(4);
        }
      };

      await expect(tableBlock).toHaveAttribute('data-table-compact', 'false');
      expect(await tableBlock.evaluate(element => element.clientWidth)).toBeGreaterThanOrEqual(768);
      await expect(operationsHeader).toHaveCSS('min-width', '360px');
      await expect(operationsHeader).toHaveCSS('position', 'sticky');
      await expect(nameHeader).toHaveCSS('position', 'sticky');
      await expect(actions).toHaveClass(/\bv-btn-group--horizontal\b/);
      await expect(summary).toBeVisible();
      await expect(actions.getByRole('button', { name: 'Edit', exact: true })).toHaveText('');
      await expect(actions.getByRole('button', { name: 'Delete', exact: true })).toHaveText('');
      await expectActionIcons();
      await expect(trigger).toHaveCount(0);

      // Resize only the owning block: a wide viewport must not force desktop operations.
      const originalStyle = await tableBlock.getAttribute('style');
      try {
        await tableBlock.evaluate(element => {
          (element as HTMLElement).style.width = '360px';
        });
        await expect.poll(() => tableBlock.evaluate(element => element.clientWidth)).toBe(360);
        await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
        expect(page.viewportSize()).toEqual(wideViewport);
        await expect(operationsHeader).toHaveCSS('min-width', '80px');
        await expect(operationsHeader).not.toHaveCSS('position', 'sticky');
        await expect(nameHeader).not.toHaveCSS('position', 'sticky');
        await expect(trigger).toBeVisible();
        await expect(popup.locator('xpath=ancestor::div[contains(@class, "v-menu")]')).toHaveCount(
          1,
        );
        await expect(popup).toBeHidden();
        await expect(actions).toHaveClass(/\bv-btn-group--vertical\b/);

        await trigger.scrollIntoViewIfNeeded();
        await trigger.focus();
        await trigger.press('Enter');
        await expect(popup).toBeVisible();
        await expect(summary).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(popup).toBeHidden();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();

        await openActions();
        // Observe the button's capture phase, before its original onPerform handler runs.
        await forceDelete.evaluate(element => {
          element.addEventListener(
            'click',
            () => {
              element.setAttribute(
                'data-e2e-popup-open-at-action',
                String(
                  getComputedStyle(element).visibility !== 'hidden' &&
                    element.getClientRects().length > 0,
                ),
              );
            },
            { capture: true, once: true },
          );
        });
        await forceDelete.click();
        await expect(forceDelete).toHaveAttribute('data-e2e-popup-open-at-action', 'false');
        await expect(popup).toBeHidden();
        const confirmation = page.getByRole('dialog');
        await expect(
          confirmation.getByText('Are you sure you want to permanently delete this student?', {
            exact: true,
          }),
        ).toBeVisible();
        // Closing the popup must not unmount the ZButton that owns the pending action.
        await expect(forceDelete).toHaveAttribute('aria-busy', 'true');
        await expect(forceDelete).toBeDisabled();
        await tableBlock.evaluate((element, style) => {
          if (style === null) element.removeAttribute('style');
          else element.setAttribute('style', style);
        }, originalStyle);
        await expect(tableBlock).toHaveAttribute('data-table-compact', 'false');
        await expect(forceDelete).toHaveAttribute('data-e2e-popup-open-at-action', 'false');
        await expect(forceDelete).toHaveAttribute('aria-busy', 'true');
        await expect(forceDelete).toBeDisabled();
        await tableBlock.evaluate(element => {
          (element as HTMLElement).style.width = '360px';
        });
        await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
        await expect(forceDelete).toBeDisabled();
        await confirmation.getByRole('button', { name: 'No', exact: true }).click();
        await expect(confirmation).toBeHidden();
        await expect(forceDelete).toBeEnabled();
        await expect(forceDelete).not.toHaveAttribute('aria-busy', 'true');
        await expect(row).toHaveCount(1);
        expect(effects.mutations).toEqual([]);

        await openActions();
        await summary.focus();
        await summary.press('Enter');
        await expect(popup).toBeHidden();
        const summaryDialog = page.getByRole('dialog');
        await expect(summaryDialog.getByText('Summary', { exact: true })).toBeVisible();
        await expect(summaryDialog).toContainText(student.name);
        await page.keyboard.press('Escape');
        await expect(summaryDialog).toBeHidden();

        await openActions();
        const tableWrapper = tableBlock.locator('.v-table__wrapper');
        const scrollLeft = await tableWrapper.evaluate(element => element.scrollLeft);
        expect(scrollLeft).toBeGreaterThan(0);
        await tableWrapper.evaluate(element => {
          element.scrollLeft = 0;
        });
        await expect(popup).toBeHidden();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');

        await openActions();
        // Still compact before and after a viewport resize: dismissal is not just a mode switch.
        await page.setViewportSize({ width: 1400, height: 900 });
        await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
        await expect(popup).toBeHidden();
        await page.setViewportSize(wideViewport);
        await openActions();
      } finally {
        await tableBlock.evaluate((element, style) => {
          if (style === null) element.removeAttribute('style');
          else element.setAttribute('style', style);
        }, originalStyle);
      }
      await expect(tableBlock).toHaveAttribute('data-table-compact', 'false');
      await expect(trigger).toHaveCount(0);
      await expect(row.locator('[data-row-actions-content]')).toHaveCount(1);
      await expect(operationsHeader).toHaveCSS('min-width', '360px');
      await expect(operationsHeader).toHaveCSS('position', 'sticky');
      await expect(nameHeader).toHaveCSS('position', 'sticky');
      await expect(actions).toHaveClass(/\bv-btn-group--horizontal\b/);
      await expect(summary).toBeVisible();
      await expectActionIcons();
      expect(profileWrites).toEqual([]);

      await page.setViewportSize({ width: 390, height: 900 });
      await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
      await openActions();
      const workspace = studentDraftWorkspaceTabs(page).getByRole('tab', {
        name: 'Student',
        exact: true,
      });
      await workspace.hover();
      await workspace.locator('.close').click();
      await expect(workspace).toHaveCount(0);
      await expect(tableBlock).toHaveCount(0);
      await expect(page.locator('.v-menu.v-overlay--active')).toHaveCount(0);
      // Reopen through the real menu with the drawer visible at the desktop breakpoint.
      await page.setViewportSize(wideViewport);
      await openStudentListPage(page);
      await expect(tableBlock).toHaveAttribute('data-table-compact', 'false');
      await expect(row).toHaveCount(1);
      ({ popup, actions, summary, forceDelete } = await resolveActions());
      await page.setViewportSize({ width: 390, height: 900 });
      await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
      await openActions();
      await page.keyboard.press('Escape');
      await expect(popup).toBeHidden();

      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.reload({ waitUntil: 'load' });
        expect(response?.ok()).toBeTruthy();
        expect(await response!.text()).toContain('data-server-rendered');
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
        await expect(page).toHaveURL(listUrl);
        await expect(tableBlock).toHaveAttribute('data-table-compact', 'true');
        ({ popup, actions, summary, forceDelete } = await resolveActions());
        expect(await tableBlock.evaluate(element => element.clientWidth)).toBeLessThan(768);
        await expect(operationsHeader).toHaveCSS('min-width', '80px');
        await expect(operationsHeader).not.toHaveCSS('position', 'sticky');
        await expect(nameHeader).not.toHaveCSS('position', 'sticky');
        await expectNoDocumentOverflow();
        await openActions();
        const popupBounds = await popup.boundingBox();
        expect(popupBounds).not.toBeNull();
        expect(popupBounds!.x).toBeGreaterThanOrEqual(0);
        expect(popupBounds!.x + popupBounds!.width).toBeLessThanOrEqual(width + 1);
        await expectNoDocumentOverflow();
        await page.keyboard.press('Escape');
        await expect(popup).toBeHidden();
        await expect(trigger).toBeFocused();
      }
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      expect((await unchanged.json()).name).toBe(student.name);
      expect(profileWrites).toEqual([]);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-RESOURCE-PICKER-01: Training Record selects and retains a Student through a routed dialog',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const studentName = `Picker E2E ${Date.now()}`;
    let studentId: string | number | undefined;
    try {
      studentId = await createStudentFixture(page, studentName, '13812345678');
      await openTrainingRecordCreatePage(page);

      const pickerField = page.getByRole('group', { name: 'Student', exact: true });
      const pickerTrigger = pickerField.getByRole('button');
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(pickerField).toBeVisible();
      await expect(pickerTrigger).toHaveText('Please select...');
      const browserUrl = page.url();
      const loaded = waitForStudentSelect(page);
      await pickerTrigger.press('Enter');

      const pickerDialog = page.getByRole('dialog');
      await expect(pickerDialog).toHaveCount(1);
      await loaded;
      const studentPickerRow = pickerDialog.getByRole('row').filter({ hasText: studentName });
      await expect(studentPickerRow).toBeVisible();
      await expect(page).toHaveURL(browserUrl);

      const select = pickerDialog.getByRole('button', { name: 'Select', exact: true });
      await expect(select).toBeDisabled();
      await studentPickerRow.getByRole('checkbox').check();
      await expect(pickerDialog.locator('[role="status"]')).toHaveCount(2);
      await expect(pickerDialog.locator('[role="status"]').last()).toHaveText('Selected one item');
      await expect(select).toBeEnabled();
      await select.click();

      await expect(pickerDialog).toBeHidden();
      await expect(page).toHaveURL(browserUrl);
      const selectedPickerTrigger = page.getByRole('button', { name: studentName, exact: true });
      await expect(selectedPickerTrigger).toBeVisible();

      await selectedPickerTrigger.click();
      await expect(pickerDialog).toBeVisible();
      await expect(studentPickerRow.getByRole('checkbox')).toBeChecked();
      await pickerDialog.getByRole('button', { name: 'Cancel', exact: true }).click();

      await expect(pickerDialog).toBeHidden();
      await expect(page).toHaveURL(browserUrl);
      await expect(selectedPickerTrigger).toHaveText(studentName);
      expect(pageErrors).toEqual([]);
    } finally {
      await deleteStudentFixture(page, studentId);
    }
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

test(
  'ATP-START-LAYOUT-03: Student create tabs use Vuetify selection behavior',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await openStudentCreatePage(page);

    const basicInformationTab = page.getByRole('tab', { name: 'Basic Information', exact: true });
    const trainingRecordsTab = page.getByRole('tab', {
      name: 'Student Training Records',
      exact: true,
    });
    const basicInformationPanel = page
      .locator('[role="tabpanel"]')
      .filter({ has: page.getByRole('group', { name: 'Student Profile' }) });
    const trainingRecordsPanel = page
      .locator('[role="tabpanel"]')
      .filter({ has: page.getByLabel('Training Stage', { exact: true }) });

    await expect(basicInformationTab).toHaveAttribute('aria-selected', 'true');
    await expect(trainingRecordsTab).toHaveAttribute('aria-selected', 'false');
    await expect(basicInformationPanel).toBeVisible();
    await expect(trainingRecordsPanel).toBeHidden();

    await trainingRecordsTab.click();

    await expect(basicInformationTab).toHaveAttribute('aria-selected', 'false');
    await expect(trainingRecordsTab).toHaveAttribute('aria-selected', 'true');
    await expect(basicInformationPanel).toBeHidden();
    await expect(trainingRecordsPanel).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-FILTER-01: Student filter form uses schema fallback when blocks are omitted',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await overrideStudentFilterBlocks(page, 'omit');
    await openStudentListPage(page);
    await expectStudentFilterFallback(page);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-FILTER-02: Student filter form uses schema fallback when blocks are empty',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await overrideStudentFilterBlocks(page, 'empty');
    await openStudentListPage(page);
    await expectStudentFilterFallback(page);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-LAYOUT-03: Student filter form preserves flow layout across viewports',
  { tag: ['@admin', '@layout'] },
  async ({ page }) => {
    const tolerance = 4;
    const fieldPreferredWidth = 240;
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);
    await openStudentListPage(page);

    const filterForm = page.locator('form').filter({
      has: page.getByLabel('Student Name', { exact: true }),
    });
    const container = filterForm.locator(':scope > .v-container');
    const flow = filterForm.locator('section > .d-flex.flex-wrap.align-start.ga-4');
    const leaves = flow.locator(':scope > div');
    await expect(filterForm).toHaveCount(1);
    await expect(container).toHaveCount(1);
    await expect(container.locator(':scope > .v-row')).toHaveCount(0);
    await expect(flow).toHaveCount(1);
    await expect(leaves).toHaveCount(4);
    await expect(leaves.nth(0).getByLabel('Student Name', { exact: true })).toBeVisible();
    await expect(leaves.nth(1).getByLabel('Training Stage', { exact: true })).toBeVisible();
    await expect(leaves.nth(2).getByLabel('Created At', { exact: true })).toBeVisible();
    await expect(leaves.nth(3).getByRole('button', { name: 'Search', exact: true })).toBeVisible();
    await expect(leaves.nth(3).getByRole('button', { name: 'Reset', exact: true })).toBeVisible();

    const wide = await getFlowGeometry(flow);
    expectFlowGeometry(wide, tolerance);
    expect(new Set(wide.leaves.map(leaf => Math.round(leaf.top))).size).toBe(1);
    for (const field of wide.leaves.slice(0, 3)) {
      expect(field.width).toBeGreaterThanOrEqual(fieldPreferredWidth - tolerance);
    }
    expect(wide.leaves[3]!.width).toBeLessThan(wide.leaves[0]!.width - tolerance);

    await page.setViewportSize({ width: 700, height: 900 });
    await expect
      .poll(async () => {
        const geometry = await getFlowGeometry(flow);
        return new Set(geometry.leaves.map(leaf => Math.round(leaf.top))).size > 1;
      })
      .toBe(true);

    await expect(leaves.nth(0).getByLabel('Student Name', { exact: true })).toBeVisible();
    await expect(leaves.nth(1).getByLabel('Training Stage', { exact: true })).toBeVisible();
    await expect(leaves.nth(2).getByLabel('Created At', { exact: true })).toBeVisible();
    await expect(leaves.nth(3).getByRole('button', { name: 'Search', exact: true })).toBeVisible();
    await expect(leaves.nth(3).getByRole('button', { name: 'Reset', exact: true })).toBeVisible();

    const narrow = await getFlowGeometry(flow);
    expectFlowGeometry(narrow, tolerance);
    for (const field of narrow.leaves.slice(0, 3)) {
      expect(field.width).toBeGreaterThanOrEqual(
        Math.min(fieldPreferredWidth, narrow.flow.width) - tolerance,
      );
    }
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-01: default-on create recovery restores ordinary and nested fields without submitting',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    const name = `Create Draft E2E ${Date.now()}`;
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await studentDraftNameInput(page).fill(name);
    await page.getByLabel('Mobile', { exact: true }).fill('13812345678');
    await page.locator('.ProseMirror').last().fill(`Nested draft ${name}`);
    await waitForStudentDraft(page, name);
    await expect
      .poll(async () => {
        const snapshot = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return (snapshot?.values.content as { descriptionMarkdown?: string } | undefined)
          ?.descriptionMarkdown;
      })
      .toContain(name);
    await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
    const progress = studentDraftLevelOption(page, 'Progress Track');
    await progress.click();
    await expect(progress).toHaveClass(/\bv-chip--selected\b/);
    await expect
      .poll(async () => {
        const snapshot = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return snapshot?.values.level;
      })
      .toBe(2);

    const html = await (await page.request.get(studentDraftCreatePath)).text();
    expect(html).not.toContain('Unsaved draft available');
    expect(html).not.toContain(name);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
    await reloadStudentDraft(page);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await recoverStudentDraft(page);
    await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
    await expect(progress).toHaveClass(/\bv-chip--selected\b/);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).toHaveValue(name);
    await expect(page.getByLabel('Mobile', { exact: true })).toHaveValue('13812345678');
    await expect(page.locator('.ProseMirror').last()).toContainText(name);
    await waitForStudentDraft(page, name);
    expect(effects.mutations).toEqual([]);

    await reloadStudentDraft(page);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-02: default-on edit recovery and candidate discard never PATCH the record',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const editedName = `${student.name} unsaved`;
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftNameInput(page).fill(editedName);
      await waitForStudentDraft(page, editedName, student.id);
      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      const response = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(response.ok()).toBeTruthy();
      expect((await response.json()).name).toBe(student.name);
      expect(effects.mutations).toEqual([]);

      await reloadStudentDraft(page);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expectNoStudentDraft(page, student.id);
      await page.reload({ waitUntil: 'load' });
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-DRAFT-03: successful create and edit submission remove their exact draft identities',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const capture = installStudentCreateResponseCapture(page);
    await capture.install();
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const headers = { Authorization: `Bearer ${token}` };
    const name = `Submitted Draft E2E ${Date.now()}`;
    let studentId: string | number | undefined;
    try {
      await openStudentDraftCreate(page);
      await studentDraftNameInput(page).fill(name);
      await page.getByLabel('Mobile', { exact: true }).fill('13812345678');
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await studentDraftLevelOption(page, 'Foundation Track').click();
      await waitForStudentDraft(page, name);
      const create = page.waitForResponse(
        response =>
          response.request().method() === 'POST' &&
          new URL(response.url()).pathname === '/api/training/student' &&
          !response.request().headers()['x-vona-openapi-schema'],
      );
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      expect((await create).ok()).toBeTruthy();
      studentId = capture.studentId;
      expect(['string', 'number']).toContain(typeof studentId);
      await expect(page).toHaveURL(studentResourceUrl);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expectNoStudentDraft(page);
      await openStudentDraftCreate(page);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(studentDraftNameInput(page)).not.toHaveValue(name);

      await page.goto(`/admin/rest/resource/training-student%3Astudent/${studentId}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const updatedName = `${name} updated`;
      await studentDraftNameInput(page).fill(updatedName);
      await waitForStudentDraft(page, updatedName, studentId);
      const update = page.waitForResponse(
        response =>
          response.request().method() === 'PATCH' &&
          new URL(response.url()).pathname === `/api/training/student/${studentId}` &&
          !response.request().headers()['x-vona-openapi-schema'],
      );
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      expect((await update).ok()).toBeTruthy();
      await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
      await page.waitForLoadState('load');
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expectNoStudentDraft(page, studentId);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${studentId}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(updatedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
    } finally {
      studentId ??= capture.studentId;
      try {
        if (studentId !== undefined) {
          const response = await page.request.delete(
            `/api/training/student/deleteForce/${studentId}`,
            { headers },
          );
          expect(response.ok() || response.status() === 404).toBeTruthy();
        }
      } finally {
        await capture.uninstall();
      }
    }
  },
);

test(
  'ATP-START-DRAFT-04: ordinary Back and explicit task close delete drafts instead of recovering them',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const backName = `Back Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(backName);
    await waitForStudentDraft(page, backName);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(studentResourceUrl);
    await expectNoStudentDraft(page);
    await openStudentDraftCreate(page);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(backName);

    const closeName = `Closed Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(closeName);
    await waitForStudentDraft(page, closeName);
    const task = page.getByRole('tab', { name: closeName, exact: true });
    await expect(task).toBeVisible();
    await task.hover();
    await task.locator('.close').click();
    await expect(task).toHaveCount(0);
    await expectNoStudentDraft(page);
    await openStudentDraftCreate(page);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(closeName);
    expect(effects.mutations).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-05: switching tasks retains drafts and workspace close removes inactive edit drafts',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 2, async ([first, second]) => {
      await openStudentDraftEdit(page, first.name, first.id);
      const firstDraft = `${first.name} unsaved`;
      await studentDraftNameInput(page).fill(firstDraft);
      await waitForStudentDraft(page, firstDraft, first.id);
      await openStudentDraftEdit(page, second.name, second.id);
      const secondDraft = `${second.name} unsaved`;
      await studentDraftNameInput(page).fill(secondDraft);
      await waitForStudentDraft(page, secondDraft, second.id);

      await page.getByRole('tab', { name: firstDraft, exact: true }).click();
      await expect(studentDraftNameInput(page)).toHaveValue(firstDraft);
      await waitForStudentDraft(page, firstDraft, first.id);
      await waitForStudentDraft(page, secondDraft, second.id);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      const workspace = studentDraftWorkspaceTabs(page).getByRole('tab', {
        name: 'Student',
        exact: true,
      });
      await workspace.hover();
      await workspace.locator('.close').click();
      await expect(workspace).toHaveCount(0);
      await expectNoStudentDraft(page, first.id);
      await expectNoStudentDraft(page, second.id);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${first.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(studentDraftNameInput(page)).toHaveValue(first.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${second.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(studentDraftNameInput(page)).toHaveValue(second.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-DRAFT-06: edit recovery rejects a changed server baseline without overwriting it',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const unsavedName = `${student.name} unsaved`;
      await studentDraftNameInput(page).fill(unsavedName);
      await waitForStudentDraft(page, unsavedName, student.id);
      const serverName = `${student.name} changed on server`;
      const change = await page.request.patch(`/api/training/student/${student.id}`, {
        headers,
        data: { name: serverName, mobile: '13812345678', level: 1 },
      });
      expect(change.ok()).toBeTruthy();
      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(serverName);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Recover draft', exact: true })
        .click();
      await expect(studentDraftBanner(page)).toContainText(
        'This draft cannot be recovered because the form or record has changed.',
      );
      await expect(studentDraftNameInput(page)).toHaveValue(serverName);
      await waitForStudentDraft(page, unsavedName, student.id);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      expect((await unchanged.json()).name).toBe(serverName);
      expect(effects.mutations).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-DRAFT-07: failed create validation retains recoverable incomplete input',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const name = `Invalid Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    const mobile = page.getByLabel('Mobile', { exact: true });
    await mobile.fill('123');
    await waitForStudentDraft(page, name);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    const mobileField = page.locator('.v-input').filter({ has: mobile });
    await expect(mobileField).toHaveClass(/\bv-input--error\b/);
    await expect(mobileField.locator('.v-messages__message')).toBeVisible();
    await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
    await waitForStudentDraft(page, name);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);

    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(name);
    await expect(mobile).toHaveValue('123');
    await waitForStudentDraft(page, name);
    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-08: locale changes preserve recovered dirty input and current-schema persistence',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const name = `Locale Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    await waitForStudentDraft(page, name);
    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(name);

    await changeStudentDraftLocale(page, 'Chinese');
    const chineseName = page.getByLabel('学生姓名', { exact: true });
    await expect(chineseName).toBeVisible();
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: '丢弃草稿', exact: true })).toHaveCount(0);
    await waitForStudentDraft(page, name);
    await expect(chineseName).toHaveValue(name);
    const nextName = `${name} 中文`;
    await chineseName.fill(nextName);
    await waitForStudentDraft(page, nextName);

    await changeStudentDraftLocale(page, '英语');
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await waitForStudentDraft(page, nextName);
    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-11: edit locale refresh preserves recovered names but resets translated level options to the server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const effects = collectDraftEffects(page);
      const editedName = `${student.name} locale unsaved`;
      const selectBasic = async (locale = 'en') => {
        await page
          .getByRole('tab', {
            name: locale === 'en' ? 'Basic Information' : '基本信息',
            exact: true,
          })
          .click();
      };
      const selectTraining = async (locale = 'en') => {
        await page
          .getByRole('tab', {
            name: locale === 'en' ? 'Student Training Records' : '学生培训记录',
            exact: true,
          })
          .click();
      };
      const expectDraftValues = async (level: number) => {
        await expect
          .poll(async () => {
            const draft = (await readStudentDrafts(page)).find(
              draft => draft.mode === 'edit' && draft.id === String(student.id),
            );
            return { name: draft?.values.name, level: draft?.values.level };
          })
          .toEqual({ name: editedName, level });
      };
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      const foundation = studentDraftLevelOption(page, 'Foundation Track');
      const progress = studentDraftLevelOption(page, 'Progress Track');
      await studentDraftNameInput(page).fill(editedName);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bv-chip--selected\b/);
      await progress.click();
      await expect(progress).toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(2);

      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bv-chip--selected\b/);
      await expect(progress).not.toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(2);
      await recoverStudentDraft(page);
      await expect(progress).toHaveClass(/\bv-chip--selected\b/);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);

      await changeStudentDraftLocale(page, 'Chinese');
      const chineseName = page.getByLabel('学生姓名', { exact: true });
      const chineseFoundation = studentDraftLevelOption(page, '基础班');
      const chineseProgress = studentDraftLevelOption(page, '提升班');
      await selectBasic('zh');
      await expect(chineseName).toHaveValue(editedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: '丢弃草稿', exact: true })).toHaveCount(0);
      // This custom renderer has localized options and an opaque slot, so it takes normal reset.
      await selectTraining('zh');
      await expect(chineseFoundation).toHaveClass(/\bv-chip--selected\b/);
      await expect(chineseProgress).not.toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(1);
      expect(effects.mutations).toEqual([]);

      // Make level dirty again to prove the reverse locale change also resets to server truth.
      await chineseProgress.click();
      await expect(chineseProgress).toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(2);
      await changeStudentDraftLocale(page, '英语');
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bv-chip--selected\b/);
      await expect(progress).not.toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(1);
      expect(effects.mutations).toEqual([]);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      const persisted = await unchanged.json();
      expect(persisted.name).toBe(student.name);
      expect(persisted.level).toBe(1);

      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expectDraftValues(1);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bv-chip--selected\b/);
      await expect(progress).not.toHaveClass(/\bv-chip--selected\b/);
      await expectDraftValues(1);
      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-DRAFT-12: nested Training Time create drafts persist ISO and reopen the recovered date without submitting',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const effects = collectDraftEffects(page, true);
    const capture = installStudentCreateResponseCapture(page);
    await capture.install();
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const headers = { Authorization: `Bearer ${token}` };
    const name = `Training Time Draft E2E ${Date.now()}`;
    const recordName = `${name} record`;
    const date = '2026-03-10';
    const iso = await browserLocalDateIso(page, date);
    const expectNoBusinessRecords = async () => {
      for (const [resource, ownedName] of [
        ['student', name],
        ['record', recordName],
      ]) {
        const response = await page.request.get(`/api/training/${resource}`, {
          headers,
          params: { name: ownedName },
        });
        expect(response.ok()).toBeTruthy();
        expect((await response.json()).list).toEqual([]);
      }
    };
    try {
      await expectNoBusinessRecords();
      await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await studentDraftNameInput(page).fill(name);
      await waitForStudentDraft(page, name);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      const details = studentDraftTrainingRecords(page);
      await details.getByRole('button', { name: 'Add Detail', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveCount(1);
      await dialog.getByLabel('Training Record Name', { exact: true }).fill(recordName);
      await fillTrainingTime(page, dialog, date);
      await expectTrainingTime(page, dialog, date);
      // The child form is not part of the parent draft until its own OK boundary.
      expect((await readStudentTrainingDraft(page)).rows ?? []).toEqual([]);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(studentDraftTrainingRow(page, recordName)).toHaveCount(1);
      const expectDateDraft = async () => {
        await expect
          .poll(async () => {
            const draft = await readStudentTrainingDraft(page);
            return {
              rows: draft.rows?.map(row => ({ name: row.name, trainingTime: row.trainingTime })),
              identities: draft.identities,
            };
          })
          // The create DTO omits row IDs, so this array has no relation identity metadata.
          .toEqual({ rows: [{ name: recordName, trainingTime: iso }], identities: undefined });
      };
      await expectDateDraft();
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      const serverHtml = await page.request.get(studentDraftCreatePath);
      expect(serverHtml.ok()).toBeTruthy();
      const html = await serverHtml.text();
      expect(html).not.toContain(recordName);
      expect(html).not.toContain(iso);

      await reloadStudentDraft(page);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await expect(studentDraftTrainingRow(page, recordName)).toHaveCount(0);
      await expectDateDraft();
      await recoverStudentDraft(page);
      const row = studentDraftTrainingRow(page, recordName);
      await expect(row).toHaveCount(1);
      await row.locator('button.v-btn--icon.text-primary').click();
      await expect(dialog).toHaveCount(1);
      // Recovered ISO strings must remain usable by the Start DATE_FULL text renderer.
      await expectTrainingTime(page, dialog, date);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft();
      await expectNoBusinessRecords();

      await reloadStudentDraft(page);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await expect(row).toHaveCount(0);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page);
      await expect(row).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    } finally {
      try {
        // Normally no business row exists; capture only this form's accidental create, if any.
        if (capture.studentId !== undefined) {
          const response = await page.request.delete(
            `/api/training/student/deleteForce/${capture.studentId}`,
            { headers },
          );
          expect(response.ok() || response.status() === 404).toBeTruthy();
        }
      } finally {
        await capture.uninstall();
      }
    }
  },
);

test(
  'ATP-START-DRAFT-13: nested Training Time edit drafts recover changed and cleared dates then discard to the server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const recordName = `${student.name} dated record`;
      const baselineDate = '2026-03-10';
      const changedDate = '2026-04-18';
      const baselineIso = await browserLocalDateIso(page, baselineDate);
      const changedIso = await browserLocalDateIso(page, changedDate);
      // API-only fixture setup; the tested UI never submits a business resource.
      const setup = await page.request.patch(`/api/training/student/${student.id}`, {
        headers,
        data: {
          name: student.name,
          mobile: '13812345678',
          level: 1,
          trainingRecords: [{ name: recordName, trainingTime: baselineIso }],
        },
      });
      expect(setup.ok()).toBeTruthy();
      const initial = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(initial.ok()).toBeTruthy();
      const baseline = await initial.json();
      expect(baseline.trainingRecords).toHaveLength(1);
      const record = baseline.trainingRecords[0];
      expect(['string', 'number']).toContain(typeof record.id);
      expect(record.name).toBe(recordName);
      expect(new Date(record.trainingTime).toISOString()).toBe(baselineIso);
      const effects = collectDraftEffects(page, true);
      const expectServerBaseline = async () => {
        const response = await page.request.get(`/api/training/student/${student.id}`, { headers });
        expect(response.ok()).toBeTruthy();
        expect(await response.json()).toEqual(baseline);
        expect(effects.mutations).toEqual([]);
      };
      const expectDateDraft = async (trainingTime: string | undefined) => {
        await expect
          .poll(async () => {
            const draft = await readStudentTrainingDraft(page, student.id);
            return {
              rows: draft.rows?.map(row => ({ name: row.name, trainingTime: row.trainingTime })),
              identities: draft.identities,
              cleared: draft.trainingTimeCleared,
            };
          })
          .toEqual({
            rows: [{ name: recordName, trainingTime }],
            identities: [{ id: record.id }],
            cleared: trainingTime === undefined,
          });
      };
      const openRecord = async () => {
        await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
        const row = studentDraftTrainingRow(page, recordName);
        await expect(row).toHaveCount(1);
        await row.locator('button.v-btn--icon.text-primary').click();
        await expect(page.getByRole('dialog')).toHaveCount(1);
      };
      const dialog = page.getByRole('dialog');
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await openRecord();
      await expectTrainingTime(page, dialog, baselineDate);
      await fillTrainingTime(page, dialog, changedDate);
      await expectNoStudentDraft(page, student.id);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(changedIso);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);

      await reloadStudentDraft(page);
      await openRecord();
      await expectTrainingTime(page, dialog, baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await recoverStudentDraft(page);
      await openRecord();
      await expectTrainingTime(page, dialog, changedDate);
      await expectServerBaseline();
      await trainingTimeInput(dialog).fill('');
      await expect(trainingTimeInput(dialog)).toHaveValue('');
      // Clearing the optional date is committed to the parent only on dialog OK.
      await expectDateDraft(changedIso);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(undefined);

      await reloadStudentDraft(page);
      await openRecord();
      await expectTrainingTime(page, dialog, baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await recoverStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue('');
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(undefined);
      await expectServerBaseline();

      await reloadStudentDraft(page);
      await openRecord();
      await expectTrainingTime(page, dialog, baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await openRecord();
      await expectTrainingTime(page, dialog, baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectNoStudentDraft(page, student.id);
      await expectServerBaseline();
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
      // withDraftStudents finally deletes this exact student and its nested record via include.
    });
  },
);

test(
  'ATP-START-DRAFT-14: new create input replaces an unrecovered candidate without merging old values',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const effects = collectDraftEffects(page, true);
    const oldName = `Create Takeover E2E ${Date.now()} old`;
    const nextName = `${oldName} replacement`;
    const mobile = page.getByLabel('Mobile', { exact: true });
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await studentDraftNameInput(page).fill(oldName);
    await mobile.fill('13912345678');
    await expect
      .poll(async () => {
        const draft = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return { name: draft?.values.name, mobile: draft?.values.mobile };
      })
      .toEqual({ name: oldName, mobile: '13912345678' });
    await expect(studentDraftBanner(page)).toHaveCount(0);

    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(oldName);
    await expect(mobile).toHaveValue('');
    // A parent onChanged takes over the complete current form, not the stored candidate.
    await studentDraftNameInput(page).fill(nextName);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
    await expect(mobile).toHaveValue('');
    await expect
      .poll(async () => {
        return (await readStudentDrafts(page))
          .filter(draft => draft.mode === 'create')
          .map(draft => ({ name: draft.values.name, mobile: draft.values.mobile ?? '' }));
      })
      .toEqual([{ name: nextName, mobile: '' }]);

    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await waitForStudentDraft(page, nextName);
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    for (const name of [oldName, nextName]) {
      const response = await page.request.get('/api/training/student', {
        headers: { Authorization: `Bearer ${token}` },
        params: { name },
      });
      expect(response.ok()).toBeTruthy();
      expect((await response.json()).list).toEqual([]);
    }

    await reloadStudentDraft(page);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-15: new edit input replaces an unrecovered candidate with the live server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const initial = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(initial.ok()).toBeTruthy();
      const baseline = await initial.json();
      const effects = collectDraftEffects(page, true);
      const oldName = `${student.name} old candidate`;
      const nextName = `${student.name} replacement`;
      const mobile = page.getByLabel('Mobile', { exact: true });
      const expectDraftValues = async (name: string, mobile: string) => {
        await expect
          .poll(async () => {
            return (await readStudentDrafts(page))
              .filter(draft => draft.mode === 'edit' && draft.id === String(student.id))
              .map(draft => ({ name: draft.values.name, mobile: draft.values.mobile }));
          })
          .toEqual([{ name, mobile }]);
      };
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftNameInput(page).fill(oldName);
      await mobile.fill('13912345678');
      await expectDraftValues(oldName, '13912345678');
      await expect(studentDraftBanner(page)).toHaveCount(0);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      // The read contract masks mobile; takeover retains that live baseline, not the old draft.
      await expect(mobile).toHaveValue(baseline.mobile);
      await studentDraftNameInput(page).fill(nextName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expectDraftValues(nextName, baseline.mobile);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(mobile).toHaveValue(baseline.mobile);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(nextName);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expectDraftValues(nextName, baseline.mobile);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      expect(await unchanged.json()).toEqual(baseline);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

for (const mode of ['edit', 'create'] as const) {
  test(
    `ATP-START-DRAFT-${mode === 'edit' ? '16' : '17'}: inactive ${mode} task offers recovery after list reload`,
    { tag: ['@admin', '@flow', '@ssr'] },
    async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await loginAsAdmin(page);
      await withDraftStudents(page, mode === 'edit' ? 1 : 0, async ([student], headers) => {
        const effects = collectDraftEffects(page, true);
        const id = student?.id;
        const baseline = student
          ? await (await page.request.get(`/api/training/student/${id}`, { headers })).json()
          : undefined;
        if (student) await openStudentDraftEdit(page, student.name, student.id);
        else await openStudentDraftCreate(page);
        const entryUrl = page.url();
        const baselineName = await studentDraftNameInput(page).inputValue();
        const name = `Inactive ${mode} Draft ${Date.now()}`;
        await studentDraftNameInput(page).fill(name);
        await waitForStudentDraft(page, name, id);
        const stored = (await readStudentDrafts(page)).filter(draft => draft.mode === mode);
        const checkpoint = async (label: string) => {
          const drafts = (await readStudentDrafts(page)).filter(draft => draft.mode === mode);
          await testInfo.attach(label, {
            body: JSON.stringify(drafts, null, 2),
            contentType: 'application/json',
          });
          expect(drafts, label).toEqual(stored);
        };
        await checkpoint('before-switch');
        const workspace = studentDraftWorkspaceTabs(page).getByRole('tab', {
          name: 'Student',
          exact: true,
        });
        await workspace.click();
        await expect(page).not.toHaveURL(entryUrl);
        await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
        await checkpoint('after-switch');
        await page.reload({ waitUntil: 'load' });
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
        // Restored task titles and dirty markers need not retain their live presentation.
        const task = studentDraftTaskTabs(page).getByRole('tab');
        await expect(task).toHaveCount(1);
        await checkpoint('after-list-reload');
        await task.click();
        await expect(page).toHaveURL(entryUrl);
        await expect(studentDraftNameInput(page)).toHaveValue(baselineName);
        await checkpoint('after-entry-activation');
        await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
        await expect(
          studentDraftBanner(page).getByRole('button', {
            name: 'Discard draft',
            exact: true,
          }),
        ).toBeVisible();
        await recoverStudentDraft(page);
        await expect(studentDraftNameInput(page)).toHaveValue(name);
        await workspace.click();
        await task.click();
        await expect(studentDraftNameInput(page)).toHaveValue(name);
        await expect(studentDraftBanner(page)).toHaveCount(0);
        if (student) {
          const unchanged = await page.request.get(`/api/training/student/${id}`, { headers });
          expect(await unchanged.json()).toEqual(baseline);
        }
        expect(effects.mutations).toEqual([]);
        expect(effects.hydrationWarnings).toEqual([]);
        expect(effects.pageErrors).toEqual([]);
      });
    },
  );
}

test(
  'ATP-START-DRAFT-09: logout removes persisted create and inactive edit drafts before relogin',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student]) => {
      await openStudentDraftEdit(page, student.name, student.id);
      const editName = `${student.name} logout`;
      await studentDraftNameInput(page).fill(editName);
      await waitForStudentDraft(page, editName, student.id);
      await openStudentDraftCreate(page);
      const createName = `Logout Draft E2E ${Date.now()}`;
      await studentDraftNameInput(page).fill(createName);
      await waitForStudentDraft(page, createName);
      const authenticatedIdentity = await readModelPersistenceIdentity(page);
      expect(authenticatedIdentity.scope[2]).not.toBeNull();
      await page.getByRole('banner').getByRole('button', { name: 'admin', exact: true }).click();
      const userMenu = page
        .locator('.v-overlay-container')
        .getByRole('list')
        .filter({ hasText: 'Logout' });
      await expect(userMenu).toBeVisible();
      const outgoingProtectedRequests: string[] = [];
      const outgoingUnauthorizedResponses: string[] = [];
      let loggingOut = true;
      page.on('request', request => {
        const path = new URL(request.url()).pathname;
        if (
          loggingOut &&
          request.method() === 'GET' &&
          /^\/api\/(?:training\/student(?:\/|$)|home\/base\/permission\/)/.test(path)
        ) {
          outgoingProtectedRequests.push(`${request.method()} ${path}`);
        }
      });
      page.on('response', response => {
        const path = new URL(response.url()).pathname;
        if (loggingOut && path.startsWith('/api/') && response.status() === 401) {
          outgoingUnauthorizedResponses.push(`${response.status()} ${path}`);
        }
      });
      await userMenu.getByText('Logout', { exact: true }).click();
      await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
      await expectNoStudentDraft(page);
      await expectNoStudentDraft(page, student.id);
      await expect
        .poll(async () => (await readStudentDrafts(page, authenticatedIdentity)).length)
        .toBe(0);
      const anonymousIdentity = await readModelPersistenceIdentity(page);
      expect(anonymousIdentity.scope).toEqual([null, authenticatedIdentity.siteId, null]);
      loggingOut = false;
      expect(outgoingProtectedRequests).toEqual([]);
      expect(outgoingUnauthorizedResponses).toEqual([]);
      expect(effects.consoleErrors).toEqual([]);
      await loginAsAdmin(page);
      expect(await readModelPersistenceIdentity(page)).toEqual(authenticatedIdentity);
      await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(studentDraftNameInput(page)).not.toHaveValue(createName);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.consoleErrors).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-START-DRAFT-18: actual Passport namespaces survive another tab and global model clear prevents draft resurrection',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    const identity = await readModelPersistenceIdentity(page);
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const current = await page.request.get('/api/home/user/passport/current', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    expect(current.ok()).toBeTruthy();
    const passport = (await current.json()).data;
    expect(Object.hasOwn(passport, 'instanceId')).toBe(true);
    expect(identity.scope).toEqual([
      passport.instanceId == null ? null : String(passport.instanceId),
      identity.siteId,
      String(passport.user.id),
    ]);

    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    const name = `Namespace Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    await waitForStudentDraft(page, name);
    const draft = (await readStudentDrafts(page)).find(draft => draft.values.name === name)!;
    expect(draft.namespace).toEqual([
      'zova-model-db',
      1,
      identity.appName,
      identity.scope,
      expect.any(String),
    ]);
    expect(draft.identity).toEqual([
      'training-student:student',
      'create',
      null,
      expect.stringContaining('/training-student'),
    ]);
    expect(draft.queryKey).toEqual([
      'start-pageentry.model.draft',
      JSON.stringify(draft.identity),
      'snapshot',
    ]);

    const otherTab = await page.context().newPage();
    const otherEffects = collectDraftEffects(otherTab);
    try {
      await otherTab.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(otherTab.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      expect(await readModelPersistenceIdentity(otherTab)).toEqual(identity);
      await expect(studentDraftBanner(otherTab)).toContainText('Unsaved draft available');
      await expect(studentDraftNameInput(otherTab)).not.toHaveValue(name);
      await recoverStudentDraft(otherTab);
      await expect(studentDraftNameInput(otherTab)).toHaveValue(name);
      await waitForStudentDraft(otherTab, name);
      expect(
        (await readStudentDrafts(otherTab)).find(draft => draft.values.name === name)?.storageKey,
      ).toBe(draft.storageKey);
    } finally {
      // Cross-tab notification is not the contract; stop the second writer before clearing.
      await otherTab.close();
    }
    expect(otherEffects.mutations).toEqual([]);
    expect(otherEffects.hydrationWarnings).toEqual([]);
    expect(otherEffects.pageErrors).toEqual([]);

    const draftKeyExistsAfterClear = await page.evaluate(async storageKey => {
      const root = Array.from(document.querySelectorAll('*')).find(
        element => (element as any).__vue_app__?.zova,
      ) as any;
      const app = root?.__vue_app__?.zova;
      if (!app) throw new Error('Mounted Zova application not found');
      const passport = await app.bean._getBean('home-passport.model.passport', true);
      await passport.$clear();
      return new Promise<boolean>((resolve, reject) => {
        const opening = indexedDB.open('localforage');
        opening.onerror = () => reject(opening.error);
        opening.onsuccess = () => {
          const database = opening.result;
          const transaction = database.transaction('keyvaluepairs', 'readonly');
          const request = transaction.objectStore('keyvaluepairs').getKey(storageKey);
          transaction.oncomplete = () => {
            database.close();
            resolve(request.result !== undefined);
          };
          transaction.onerror = () => {
            database.close();
            reject(transaction.error);
          };
        };
      });
    }, draft.storageKey);
    expect(draftKeyExistsAfterClear).toBe(false);
    await expect.poll(async () => (await readStudentDrafts(page, identity)).length).toBe(0);
    // Global clear resets query memory too; use real login if authentication was cleared.
    await loginAsAdmin(page);
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-DRAFT-10: deleted edit records retain reachable discard without recovering or submitting',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const unsavedName = `${student.name} deleted record draft`;
      await studentDraftNameInput(page).fill(unsavedName);
      await waitForStudentDraft(page, unsavedName, student.id);
      const deletion = await page.request.delete(`/api/training/student/${student.id}`, {
        headers,
      });
      expect(deletion.ok()).toBeTruthy();

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('The entry does not exist', { exact: true })).toBeVisible();
      await expect(studentDraftNameInput(page)).toHaveCount(0);
      await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
      await expect(
        studentDraftBanner(page).getByRole('button', { name: 'Recover draft', exact: true }),
      ).toHaveCount(0);
      const discard = studentDraftBanner(page).getByRole('button', {
        name: 'Discard draft',
        exact: true,
      });
      await expect(discard).toBeVisible();
      await waitForStudentDraft(page, unsavedName, student.id);
      await discard.click();
      await expectNoStudentDraft(page, student.id);
      await expect(studentDraftBanner(page)).toHaveCount(0);

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('The entry does not exist', { exact: true })).toBeVisible();
      await expect(studentDraftNameInput(page)).toHaveCount(0);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expectNoStudentDraft(page, student.id);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);
