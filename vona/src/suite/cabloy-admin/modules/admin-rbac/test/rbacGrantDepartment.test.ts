import type {
  DtoRbacGrantDepartmentCreate,
  DtoRbacGrantDepartmentSelectRes,
  DtoRbacGrantDepartmentUpdate,
  EntityRbacGrantDepartment,
} from 'vona-module-admin-rbac';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('rbacGrantDepartment.test.ts', () => {
  it('action:rbacGrantDepartment', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoRbacGrantDepartmentCreate = {
        name: '__Tom__',
        description: 'This is a test',
      };
      const dataUpdate: DtoRbacGrantDepartmentUpdate = {
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
            app.bean.permission.retrievePermissionAction('admin-rbac:rbacGrantDepartment', action),
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
      const rbacGrantDepartmentId = await app.bean.executor.performAction(
        'post',
        '/admin/rbac/rbacGrantDepartment',
        { body: data },
      );
      assert.equal(!!rbacGrantDepartmentId, true);
      // findMany
      const selectRes: DtoRbacGrantDepartmentSelectRes = await app.bean.executor.performAction(
        'get',
        '/admin/rbac/rbacGrantDepartment',
      );
      assert.equal(selectRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      const updateRes = await app.bean.executor.performAction(
        'patch',
        '/admin/rbac/rbacGrantDepartment/:id',
        {
          params: { id: rbacGrantDepartmentId },
          body: dataUpdate,
        },
      );
      assert.equal(updateRes, null);
      // findOne
      let rbacGrantDepartment: EntityRbacGrantDepartment = await app.bean.executor.performAction(
        'get',
        '/admin/rbac/rbacGrantDepartment/:id',
        { params: { id: rbacGrantDepartmentId } },
      );
      assert.equal(rbacGrantDepartment.name, dataUpdate.name);
      // delete
      const deleteRes = await app.bean.executor.performAction(
        'delete',
        '/admin/rbac/rbacGrantDepartment/:id',
        { params: { id: rbacGrantDepartment.id } },
      );
      assert.equal(deleteRes, null);
      // findOne
      rbacGrantDepartment = await app.bean.executor.performAction(
        'get',
        '/admin/rbac/rbacGrantDepartment/:id',
        { params: { id: rbacGrantDepartment.id } },
      );
      assert.equal(rbacGrantDepartment, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
