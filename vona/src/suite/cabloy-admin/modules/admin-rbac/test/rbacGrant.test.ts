import type {
  DtoRbacGrantCreate,
  DtoRbacGrantSelectRes,
  DtoRbacGrantUpdate,
  EntityRbacGrant,
} from 'vona-module-admin-rbac';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('rbacGrant.test.ts', () => {
  it('action:rbacGrant', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoRbacGrantCreate = {
        name: '__Tom__',
        description: 'This is a test',
      };
      const dataUpdate: DtoRbacGrantUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
      };
      // role-less authenticated users cannot access generated admin actions
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const actions = ['create', 'select', 'view', 'update', 'delete'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('admin-rbac:rbacGrant', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => false),
        );
      } finally {
        await app.bean.passport.signout();
      }
      // login as system admin
      await app.bean.passport.signinMock();
      // create
      const rbacGrantId = await app.bean.executor.performAction('post', '/admin/rbac/rbacGrant', {
        body: data,
      });
      assert.equal(!!rbacGrantId, true);
      // findMany
      const selectRes: DtoRbacGrantSelectRes = await app.bean.executor.performAction(
        'get',
        '/admin/rbac/rbacGrant',
      );
      assert.equal(selectRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      const updateRes = await app.bean.executor.performAction(
        'patch',
        '/admin/rbac/rbacGrant/:id',
        {
          params: { id: rbacGrantId },
          body: dataUpdate,
        },
      );
      assert.equal(updateRes, null);
      // findOne
      let rbacGrant: EntityRbacGrant = await app.bean.executor.performAction(
        'get',
        '/admin/rbac/rbacGrant/:id',
        { params: { id: rbacGrantId } },
      );
      assert.equal(rbacGrant.name, dataUpdate.name);
      // delete
      const deleteRes = await app.bean.executor.performAction(
        'delete',
        '/admin/rbac/rbacGrant/:id',
        { params: { id: rbacGrant.id } },
      );
      assert.equal(deleteRes, null);
      // findOne
      rbacGrant = await app.bean.executor.performAction('get', '/admin/rbac/rbacGrant/:id', {
        params: { id: rbacGrant.id },
      });
      assert.equal(rbacGrant, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
