import type { IResourceRenderBlockOptionsBlock } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { createResourcePickerPageHost } from '../../src/lib/resourcePickerPageHost.ts';

function createDialog() {
  const resolved: unknown[] = [];
  let cancelled = false;
  const dialog = {
    id: 1,
    props: {
      resource: 'training-student:student',
      selectionMode: 'multiple' as const,
      selectionMax: 2,
    },
    session: {
      selectedIds: [1],
      selectedRows: [{ id: 1, name: 'One' }],
    },
    resolve(value: unknown) {
      resolved.push(value);
    },
    cancel() {
      cancelled = true;
    },
  };
  return {
    dialog,
    resolved,
    get cancelled() {
      return cancelled;
    },
  };
}

test('Start picker host adapts only the Start page block and preserves picker state', () => {
  const { dialog } = createDialog();
  const host = createResourcePickerPageHost(dialog);
  const unrelated: IResourceRenderBlockOptionsBlock = {
    render: 'other:block' as never,
    options: { class: 'other' },
  };
  const startPage: IResourceRenderBlockOptionsBlock = {
    render: 'start-page:blockPage' as never,
    options: {
      blocks: [{ render: 'start-page:blockTable' as never }],
    } as any,
  };

  const context = { options: dialog.props, session: dialog.session, dialog: host };
  const blocks = host.prepareBlocks([unrelated, startPage], context)!;

  assert.equal(blocks[0], unrelated);
  const { onSelectionChange, ...pageOptions } = blocks[1].options as any;
  assert.deepEqual(pageOptions, {
    actionPath: undefined,
    queryFixed: undefined,
    selectionPolicy: 'always',
    selectionMode: 'multiple',
    selectionMax: 2,
    selectedIds: [1],
    selectedRows: [{ id: 1, name: 'One' }],
    blocks: [
      { render: 'start-page:blockTable' },
      { render: 'start-resource:blockResourcePickerActions' },
    ],
  });

  onSelectionChange({ ids: [2], rows: [{ id: 2, name: 'Two' }], count: 1 });
  assert.deepEqual(dialog.session, {
    selectedIds: [2],
    selectedRows: [{ id: 2, name: 'Two' }],
  });
});

test('Start picker host forwards resolve and cancel', () => {
  const state = createDialog();
  const host = createResourcePickerPageHost(state.dialog);
  const selection = { ids: [1], rows: [{ id: 1 }], count: 1 };

  host.resolve(selection);
  host.cancel();

  assert.deepEqual(state.resolved, [selection]);
  assert.equal(state.cancelled, true);
});
