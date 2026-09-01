import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createRoleMenuTree,
  getConfigurableDescendantMenus,
  getRoleMenuTreeGroupState,
} from '../../src/component/blockRoleMenuEditor/tree.js';

test('builds fully identifiable nested role-menu groups and menus', () => {
  const tree = createRoleMenuTree({
    ssrSiteName: 'test:admin',
    title: 'Admin',
    groups: [
      {
        ssrMenuGroupName: 'test:root',
        onionName: 'test:root',
        title: 'Root group',
      },
      {
        ssrMenuGroupName: 'test:nested',
        onionName: 'test:nested',
        title: 'Nested group',
        group: 'test:root',
      },
    ],
    menus: [
      {
        ssrMenuName: 'test:menu#item',
        onionName: 'test:menu',
        configurable: true,
        enabled: true,
        title: 'Nested menu',
        group: 'test:nested',
      },
    ],
  });

  assert.equal(tree.title, 'Admin');
  assert.deepEqual(tree.children, [
    {
      id: '["group","test:root"]',
      kind: 'group',
      ssrMenuGroupName: 'test:root',
      onionName: 'test:root',
      title: 'Root group',
      children: [
        {
          id: '["group","test:root","test:nested"]',
          kind: 'group',
          ssrMenuGroupName: 'test:nested',
          onionName: 'test:nested',
          title: 'Nested group',
          group: 'test:root',
          children: [
            {
              id: '["menu","test:root","test:nested","test:menu#item"]',
              kind: 'menu',
              ssrSiteName: 'test:admin',
              ssrMenuName: 'test:menu#item',
              onionName: 'test:menu',
              configurable: true,
              enabled: true,
              title: 'Nested menu',
              group: 'test:nested',
            },
          ],
        },
      ],
    },
  ]);
});

test('renders each multi-group membership and derives group state from it', () => {
  const tree = createRoleMenuTree({
    ssrSiteName: 'test:admin',
    title: 'Admin',
    groups: [
      { ssrMenuGroupName: 'test:first', onionName: 'test:first' },
      { ssrMenuGroupName: 'test:second', onionName: 'test:second' },
    ],
    menus: [
      {
        ssrMenuName: 'test:shared',
        onionName: 'test:shared',
        configurable: true,
        enabled: false,
        group: ['test:first', 'test:second'],
      },
    ],
  });
  const first = tree.children.find(item => item.id === '["group","test:first"]');
  const second = tree.children.find(item => item.id === '["group","test:second"]');
  assert.equal(first?.kind, 'group');
  assert.equal(second?.kind, 'group');
  if (first?.kind !== 'group' || second?.kind !== 'group') return;

  assert.deepEqual(
    getConfigurableDescendantMenus(first).map(menu => menu.ssrMenuName),
    ['test:shared'],
  );
  assert.deepEqual(
    getConfigurableDescendantMenus(second).map(menu => menu.ssrMenuName),
    ['test:shared'],
  );
  assert.equal(getRoleMenuTreeGroupState(first, menu => menu.enabled).targetEnabled, true);
  assert.equal(getRoleMenuTreeGroupState(second, () => true).targetEnabled, false);
});

test('collects configurable descendants and derives nested group states', () => {
  const tree = createRoleMenuTree({
    ssrSiteName: 'test:admin',
    title: 'Admin',
    groups: [
      { ssrMenuGroupName: 'test:root', onionName: 'test:root' },
      { ssrMenuGroupName: 'test:nested', onionName: 'test:nested', group: 'test:root' },
      { ssrMenuGroupName: 'test:public', onionName: 'test:public' },
    ],
    menus: [
      {
        ssrMenuName: 'test:enabled',
        onionName: 'test:enabled',
        configurable: true,
        enabled: true,
        group: 'test:root',
      },
      {
        ssrMenuName: 'test:disabled',
        onionName: 'test:disabled',
        configurable: true,
        enabled: false,
        group: 'test:nested',
      },
      {
        ssrMenuName: 'test:public',
        onionName: 'test:public',
        configurable: false,
        enabled: false,
        group: ['test:nested', 'test:public'],
      },
    ],
  });
  const root = tree.children.find(item => item.id === '["group","test:root"]');
  const nested =
    root?.kind === 'group'
      ? root.children.find(item => item.id === '["group","test:root","test:nested"]')
      : undefined;
  const publicGroup = tree.children.find(item => item.id === '["group","test:public"]');
  assert.equal(root?.kind, 'group');
  assert.equal(nested?.kind, 'group');
  assert.equal(publicGroup?.kind, 'group');
  if (root?.kind !== 'group' || nested?.kind !== 'group' || publicGroup?.kind !== 'group') return;

  assert.deepEqual(
    getConfigurableDescendantMenus(root).map(menu => menu.ssrMenuName),
    ['test:enabled', 'test:disabled'],
  );
  assert.deepEqual(
    getConfigurableDescendantMenus(nested).map(menu => menu.ssrMenuName),
    ['test:disabled'],
  );
  assert.deepEqual(getConfigurableDescendantMenus(publicGroup), []);

  assert.deepEqual(
    getRoleMenuTreeGroupState(root, menu => menu.enabled),
    {
      menus: getConfigurableDescendantMenus(root),
      enabled: false,
      indeterminate: true,
      targetEnabled: true,
    },
  );
  assert.deepEqual(
    getRoleMenuTreeGroupState(nested, () => false),
    {
      menus: getConfigurableDescendantMenus(nested),
      enabled: false,
      indeterminate: false,
      targetEnabled: true,
    },
  );
  assert.deepEqual(
    getRoleMenuTreeGroupState(publicGroup, () => false),
    {
      menus: [],
      enabled: false,
      indeterminate: false,
      targetEnabled: true,
    },
  );
  assert.deepEqual(
    getRoleMenuTreeGroupState(root, () => true),
    {
      menus: getConfigurableDescendantMenus(root),
      enabled: true,
      indeterminate: false,
      targetEnabled: false,
    },
  );
});
