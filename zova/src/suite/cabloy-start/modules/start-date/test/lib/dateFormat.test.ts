import assert from 'node:assert/strict';
import test from 'node:test';

import { dateFormatUtil } from '../../src/lib/utils.js';

const iso = '2026-03-14T09:26:53.000Z';

test('date formatting accepts recovered ISO values with the same presentation as native Dates', () => {
  for (const options of [
    { preset: 'DATE_FULL' as const },
    { preset: 'DATETIME_SHORT' as const },
    { format: 'yyyy-LL-dd HH:mm:ss' },
  ]) {
    const native = dateFormatUtil(new Date(iso), options);
    assert.notEqual(native, 'Invalid DateTime');
    assert.equal(dateFormatUtil(iso, options), native);
  }
});

test('date formatting preserves empty values and unformatted inputs', () => {
  assert.equal(dateFormatUtil(undefined, { preset: 'DATE_FULL' }), undefined);
  assert.equal(dateFormatUtil(null, { preset: 'DATE_FULL' }), undefined);
  assert.equal(dateFormatUtil('', { preset: 'DATE_FULL' }), undefined);
  assert.equal(dateFormatUtil(iso), iso);
  assert.equal(dateFormatUtil(iso, {}), iso);
});
