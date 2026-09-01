import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyRoleMenuEditorOperation,
  commitRoleMenuEditorOperation,
  getRoleMenuEditorEnabled,
  reconcileRoleMenuEditorLayers,
  rejectRoleMenuEditorOperation,
  type IRoleMenuEditorOperation,
  type RoleMenuEditorLayers,
} from '../../src/component/blockRoleMenuEditor/state.js';

const menu = { ssrSiteName: 'test:admin', ssrMenuName: 'test:menu' };

function operation(token: number, enabled: boolean): IRoleMenuEditorOperation {
  return { token, changes: [{ ...menu, enabled }] };
}

test('keeps sequential group intents optimistic until committed data catches up', () => {
  const layers: RoleMenuEditorLayers = {};
  const enable = operation(1, true);
  const disable = operation(2, false);

  applyRoleMenuEditorOperation(layers, enable);
  applyRoleMenuEditorOperation(layers, disable);
  assert.equal(getRoleMenuEditorEnabled(layers, menu, false), false);

  commitRoleMenuEditorOperation(layers, enable);
  reconcileRoleMenuEditorLayers(layers, () => false);
  assert.equal(getRoleMenuEditorEnabled(layers, menu, false), false);

  commitRoleMenuEditorOperation(layers, disable);
  reconcileRoleMenuEditorLayers(layers, () => false);
  assert.equal(getRoleMenuEditorEnabled(layers, menu, false), false);
  assert.deepEqual(layers, {});
});

test('preserves a later intent when an earlier overlapping operation fails', () => {
  const layers: RoleMenuEditorLayers = {};
  const enable = operation(1, true);
  const disable = operation(2, false);

  applyRoleMenuEditorOperation(layers, enable);
  applyRoleMenuEditorOperation(layers, disable);
  rejectRoleMenuEditorOperation(layers, enable);

  assert.equal(getRoleMenuEditorEnabled(layers, menu, true), false);
  rejectRoleMenuEditorOperation(layers, disable);
  assert.equal(getRoleMenuEditorEnabled(layers, menu, true), true);
  assert.deepEqual(layers, {});
});

test('retains a successful earlier intent when a later overlapping operation fails', () => {
  const layers: RoleMenuEditorLayers = {};
  const enable = operation(1, true);
  const disable = operation(2, false);

  applyRoleMenuEditorOperation(layers, enable);
  applyRoleMenuEditorOperation(layers, disable);
  commitRoleMenuEditorOperation(layers, enable);
  rejectRoleMenuEditorOperation(layers, disable);

  assert.equal(getRoleMenuEditorEnabled(layers, menu, false), true);
  reconcileRoleMenuEditorLayers(layers, () => false);
  assert.equal(getRoleMenuEditorEnabled(layers, menu, false), true);
  reconcileRoleMenuEditorLayers(layers, () => true);
  assert.deepEqual(layers, {});
});

test('reconciles only committed layers represented by the server configuration', () => {
  const layers: RoleMenuEditorLayers = {};
  const enable = operation(1, true);
  const disable = operation(2, false);

  applyRoleMenuEditorOperation(layers, enable);
  commitRoleMenuEditorOperation(layers, enable);
  applyRoleMenuEditorOperation(layers, disable);
  reconcileRoleMenuEditorLayers(layers, () => true);

  assert.equal(getRoleMenuEditorEnabled(layers, menu, true), false);
  assert.deepEqual(layers, {
    '["test:admin","test:menu"]': [{ token: 2, enabled: false, committed: false }],
  });
});
