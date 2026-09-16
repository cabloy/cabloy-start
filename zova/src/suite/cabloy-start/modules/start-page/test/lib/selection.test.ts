import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  groupTableActionBulkActions,
  limitPickerRowSelection,
  reconcileSelection,
  resolvePickerSelectionMax,
  resolveSelectionMaxIds,
  resolveTableActionBulkDynamicProps,
  selectionKey,
  selectionRowIds,
} from '../../src/lib/selection.js';

test('Bulk actions group by placement without changing declaration order', () => {
  const items = [
    { item: 'create' },
    { item: 'columnConfig', placement: 'end' },
    { item: 'delete' },
    { item: 'export', placement: 'end' },
    { item: 'unknown', placement: 'other' },
  ];

  assert.deepEqual(groupTableActionBulkActions(items), {
    start: ['create', 'delete', 'unknown'],
    end: ['columnConfig', 'export'],
  });
  assert.deepEqual(items, [
    { item: 'create' },
    { item: 'columnConfig', placement: 'end' },
    { item: 'delete' },
    { item: 'export', placement: 'end' },
    { item: 'unknown', placement: 'other' },
  ]);
});

test('Selection keys normalize numeric and string identities', () => {
  assert.equal(selectionKey(1), '1');
  assert.equal(selectionKey('1'), '1');
  assert.throws(() => selectionKey(undefined as unknown as TableIdentity));
  assert.throws(() => selectionKey(''));
});

test('Picker selection maximum distinguishes single and multiple modes', () => {
  assert.equal(resolvePickerSelectionMax(undefined, undefined), 100);
  assert.equal(resolvePickerSelectionMax('multiple', undefined), 100);
  assert.equal(resolvePickerSelectionMax('multiple', 3), 3);
  assert.equal(resolvePickerSelectionMax('multiple', 0), 0);
  assert.equal(resolvePickerSelectionMax('single', 99), 1);
  assert.equal(resolvePickerSelectionMax('multiple', -1), 100);
  assert.equal(resolvePickerSelectionMax('multiple', 1.5), 100);
  assert.equal(resolvePickerSelectionMax('multiple', Number.NaN), 100);
});

test('Selection reconciliation preserves selections from another page', () => {
  const selection = reconcileSelection({ '1': true, '2': true }, [{ id: 3 }, { id: 4 }], {
    '3': true,
  });
  assert.deepEqual(selection, { '1': true, '2': true, '3': true });

  const deselected = reconcileSelection(selection, [{ id: 3 }, { id: 4 }], {});
  assert.deepEqual(deselected, { '1': true, '2': true });
});

test('Picker selection caps page-wide updates while retaining earlier identities', () => {
  const rows = [{ id: '2' }, { id: '3' }, { id: '4' }];
  assert.deepEqual(
    limitPickerRowSelection({ 1: true, 2: true, 3: true, 4: true }, rows, 'multiple', 3),
    { 1: true, 2: true, 3: true },
  );
  assert.deepEqual(limitPickerRowSelection({ previous: true, 2: true }, rows, 'single', 1), {
    2: true,
  });
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
    resolveTableActionBulkDynamicProps(
      { requiresSelection: true, selectedMaxIds: 2 },
      selection,
      true,
    ),
    {
      dynamicSelection: selection,
      dynamicDisabled: true,
      dynamicDisabledReason: 'maxExceeded',
      selectedMaxIds: 2,
    },
  );
  assert.deepEqual(
    resolveTableActionBulkDynamicProps({ requiresSelection: true }, selection, false),
    {
      dynamicSelection: selection,
      dynamicDisabled: true,
      dynamicDisabledReason: 'selectionUnavailable',
      selectedMaxIds: 100,
    },
  );
});
