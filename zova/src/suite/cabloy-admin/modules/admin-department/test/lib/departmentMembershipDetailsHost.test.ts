import type { IResourceRenderBlockOptionsBlock } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { createDepartmentMembershipDetailsHostOptions } from '../../src/lib/departmentMembershipDetailsHost.js';

test('Department membership details host preserves owner callbacks and overrides schema callbacks', () => {
  const formMeta = { formScene: 'view' } as any;
  const schemaRow = { type: 'object' } as any;
  const memberships = [{ id: 1 }];
  const hostCheckPermission = () => true;
  const schemaCheckPermission = () => false;
  const block = {
    render: 'start-details:blockDetails',
    options: {
      class: 'membership-details',
      checkPermission: schemaCheckPermission,
    },
  } as IResourceRenderBlockOptionsBlock;

  const options = createDepartmentMembershipDetailsHostOptions(
    4,
    block,
    formMeta,
    schemaRow,
    17,
    () => memberships,
    hostCheckPermission,
  );

  assert.equal(options.key, 4);
  assert.equal(options.class, 'membership-details');
  assert.strictEqual(options.formMeta, formMeta);
  assert.strictEqual(options.schemaForm, schemaRow);
  assert.strictEqual(options.schemaRow, schemaRow);
  assert.equal(options.departmentId, 17);
  assert.strictEqual(options.getDetailItems!(), memberships);
  assert.strictEqual(options.checkPermission, hostCheckPermission);
  assert.equal('setDetailItems' in options, false);
});
