import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('rbacScope.test.ts', { concurrency: false }, () => {
  it('exposes the configured Start RBAC scope adapter', async () => {
    await app.bean.executor.mockCtx(async () => {
      const adapter = app.scope('admin-rbac').service.rbacScopeAdapter;
      assert.equal(typeof adapter.isUnrestricted, 'function');
      assert.equal(typeof adapter.ownerValues, 'function');
    });
  });
});
