import assert from 'node:assert/strict';
import test from 'node:test';
import type { TableIdentity } from 'table-identity';

import {
  reconcileSelection,
  resolveSelectionMaxIds,
  resolveTableActionBulkDynamicProps,
  selectionKey,
  selectionRowIds,
} from '../../src/lib/selection.js';

test('Selection keys normalize numeric and string identities', () => {
  assert.equal(selectionKey(1), '1');
  assert.equal(selectionKey('1'), '1');
  assert.throws(() => selectionKey(undefined as unknown as TableIdentity));
  assert.throws(() => selectionKey(''));
});

test('Selection reconciliation preserves selections from another page', () => {
  const selection = reconcileSelection(
    { '1': true, '2': true },
    [{ id: 3 }, { id: 4 }],
    { '3': true },
  );
  assert.deepEqual(selection, { '1': true, '2': true, '3': true });

  const deselected = reconcileSelection(selection, [{ id: 3 }, { id: 4 }], {});
  assert.deepEqual(deselected, { '1': true, '2': true });
});

test('Selection reconciliation rejects duplicate normalized page identities', () => {
  assert.throws(() => selectionRowIds([{ id: 1 }, { id: '1' }]));
  assert.throws(() => selectionRowIds([{ id: undefined }]));
});

test('Selection bulk actions apply the default and authored limits independently', () => {
  assert.equal(resolveSelectionMaxIds(undefined), 100);
  assert.equal(resolveSelectionMaxIds(3), 3);

  const selection = { ids: [1, 2, 3], rows: [{ id: 1 }, { id: 2 }, { id: 3 }], count: 3 };
  assert.deepEqual(resolveTableActionBulkDynamicProps(undefined, selection, false), {
    dynamicSelection: selection,
    dynamicDisabled: false,
    dynamicDisabledReason: undefined,
    selectedMaxIds: undefined,
  });
  assert.deepEqual(
    resolveTableActionBulkDynamicProps({ requiresSelection: true, selectedMaxIds: 2 }, selection, true),
    {
      dynamicSelection: selection,
      dynamicDisabled: true,
      dynamicDisabledReason: 'maxExceeded',
      selectedMaxIds: 2,
    },
  );
  assert.deepEqual(resolveTableActionBulkDynamicProps({ requiresSelection: true }, selection, false), {
    dynamicSelection: selection,
    dynamicDisabled: true,
    dynamicDisabledReason: 'selectionUnavailable',
    selectedMaxIds: 100,
  });
});
