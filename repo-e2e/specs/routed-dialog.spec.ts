import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));
  return errors;
}

function dialogByTitle(page: Page, title: 'A' | 'B') {
  return page.getByRole('dialog').filter({ hasText: `Routed Dialog ${title}` });
}

function routeRow(dialog: ReturnType<typeof dialogByTitle>, name: string) {
  return dialog.locator('tbody tr').filter({ hasText: name }).last();
}

async function expectRouteValue(
  dialog: ReturnType<typeof dialogByTitle>,
  name: string,
  value: string,
) {
  await expect(routeRow(dialog, name).getByRole('cell').nth(1)).toHaveText(value);
}

async function openDemo(page: Page) {
  const pageErrors = collectPageErrors(page);
  const response = await page.goto('/start/demo/routedDialog', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await expect(page.getByRole('heading', { name: 'Routed Dialog', exact: true })).toBeVisible();
  return { browserUrl: page.url(), pageErrors };
}

async function expectRoutedCardGeometry(
  dialog: ReturnType<typeof dialogByTitle>,
  expected: { maxWidth: string; top: number; bottom: number },
) {
  const card = dialog.locator('.v-card').first();
  await expect(card).toBeVisible();
  await expect
    .poll(async () => {
      return await card.evaluate(element => {
        const content = element.parentElement!;
        const overlay = content.closest('.v-overlay')!;
        const cardRect = element.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        return {
          maxWidth: getComputedStyle(element).maxWidth,
          top: Math.round(contentRect.top),
          bottom: Math.round(overlayRect.bottom - contentRect.bottom),
          cardCenter: Math.round(cardRect.left + cardRect.width / 2),
          contentCenter: Math.round(contentRect.left + contentRect.width / 2),
        };
      });
    })
    .toMatchObject({
      maxWidth: expected.maxWidth,
      top: expected.top,
      bottom: expected.bottom,
    });

  await expect
    .poll(async () => {
      return await card.evaluate(element => {
        const content = element.parentElement!;
        const cardRect = element.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        return Math.abs(
          cardRect.left + cardRect.width / 2 - (contentRect.left + contentRect.width / 2),
        );
      });
    })
    .toBeLessThanOrEqual(1);
}

test(
  'ATP-START-ROUTED-DIALOG-01: local navigation does not change the browser URL',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const { browserUrl, pageErrors } = await openDemo(page);

    await page.getByRole('button', { name: 'Open A', exact: true }).click();
    const dialogA = dialogByTitle(page, 'A');
    await expect(dialogA).toHaveCount(1);
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, 'token', 'dialog-a-entry');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);

    await dialogA.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, 'id', '1');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    expect(page.url()).toBe(browserUrl);

    await dialogA.getByRole('button', { name: 'Local replace next detail', exact: true }).click();
    await expectRouteValue(dialogA, 'id', '11');
    await dialogA.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-ROUTED-DIALOG-ANCHOR-01: routed dialogs honor responsive top anchoring',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    const { browserUrl, pageErrors } = await openDemo(page);

    await page.getByRole('button', { name: 'Open A', exact: true }).click();
    const dialogA = dialogByTitle(page, 'A');
    await expectRoutedCardGeometry(dialogA, { maxWidth: '640px', top: 16, bottom: 16 });

    await dialogA.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRoutedCardGeometry(dialogA, { maxWidth: '640px', top: 16, bottom: 16 });
    expect(page.url()).toBe(browserUrl);

    await page.setViewportSize({ width: 900, height: 900 });
    await expectRoutedCardGeometry(dialogA, { maxWidth: '768px', top: 32, bottom: 32 });

    await page.setViewportSize({ width: 1100, height: 900 });
    await expectRoutedCardGeometry(dialogA, { maxWidth: '1024px', top: 48, bottom: 48 });

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-START-ROUTED-DIALOG-02: handles and concurrent dialogs remain isolated',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const { browserUrl, pageErrors } = await openDemo(page);

    await page.getByRole('button', { name: 'Open A and B', exact: true }).click();
    const dialogA = dialogByTitle(page, 'A');
    const dialogB = dialogByTitle(page, 'B');
    await expect(dialogA).toHaveCount(1);
    await expect(dialogB).toHaveCount(1);
    await expectRouteValue(dialogA, 'token', 'dialog-a-entry');
    await expectRouteValue(dialogB, 'token', 'dialog-b-entry');

    await dialogB.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogB.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, 'token', 'dialog-a-entry');
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogB).toHaveCount(0);
    await expect(dialogA).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);

    await page.getByRole('button', { name: 'Open A with handle.push', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, 'id', '101');
    await expect(page.getByText('A: handle.push', { exact: true })).toBeVisible();
    expect(page.url()).toBe(browserUrl);
    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);
