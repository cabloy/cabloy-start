import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

import { DtoRbacGrantDepartmentCreate } from '../src/index.ts';

describe('rbacGrantDepartment.test.ts', { concurrency: false }, () => {
  it('dto:rbacGrantDepartment emits metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoRbacGrantDepartmentCreate);
      assert.ok(apiJson.components?.schemas);
    });
  });

  it('action:rbacGrantDepartment protects its control plane', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [result, error] = await catchError(() =>
        app.bean.executor.performAction('post', '/admin/rbac/rbacGrantDepartment', {
          innerAccess: false,
          body: { rbacGrantId: '999999', departmentId: '999999' },
        }),
      );
      assert.equal(result, undefined);
      assert.equal(error?.code, 401);
    });
  });

  it('service:rbacGrantDepartment rejects unavailable grants and departments', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [result, error] = await catchError(() =>
        app.scope('admin-rbac').service.rbacGrantDepartment.create({
          rbacGrantId: '999999',
          departmentId: '999999',
        }),
      );
      assert.equal(result, undefined);
      assert.equal(error?.code, 422);
    });
  });

  it('service:rbacGrantDepartment serializes duplicate creation', async () => {
    const roleName = `admin-rbac-grant-department-race-${crypto.randomUUID()}`;
    const departmentName = `Admin RBAC department race ${crypto.randomUUID()}`;
    const actionKey = 'test:controller#create';
    const getCatalog = mock.method(
      app.bean.rbacCatalog,
      'getCatalog',
      () =>
        new Map([
          [
            actionKey,
            {
              actionKey,
              controllerBeanFullName: 'test:controller',
              action: 'create',
              options: { dataScope: true },
            },
          ],
        ]),
    );
    let roleId: string | undefined;
    let grantId: string | undefined;
    let departmentId: string | undefined;
    const invalidationEvents: unknown[] = [];
    const policyInvalidated = app.scope('a-rbac').event.policyInvalidated;
    const originalEmit = policyInvalidated.emit.bind(policyInvalidated);
    const emitMock = mock.method(policyInvalidated, 'emit', async data => {
      invalidationEvents.push(data);
      return await originalEmit(data);
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'RBAC duplicate grant department race',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        const grant = await app.scope('admin-rbac').service.rbacGrant.create({
          roleId,
          actionKey,
          dataScope: 'customDepartments',
          enabled: true,
        });
        grantId = String(grant.id);
        const department = await app.scope('admin-department').service.department.create({
          name: departmentName,
          parentId: null,
        });
        departmentId = String(department.id);
      });

      assert.ok(grantId);
      assert.ok(departmentId);
      invalidationEvents.length = 0;
      const create = () =>
        app.bean.executor.mockCtx(async () => {
          return await catchError(() =>
            app.scope('admin-rbac').service.rbacGrantDepartment.create({
              rbacGrantId: grantId!,
              departmentId: departmentId!,
            }),
          );
        });
      const results = await Promise.all([create(), create()]);
      const created = results.flatMap(([grantDepartment]) =>
        grantDepartment ? [grantDepartment] : [],
      );

      assert.equal(created.length, 1);
      assert.equal(results.filter(([, error]) => error?.code === 409).length, 1);
      assert.deepEqual(invalidationEvents, [{ kind: 'policy' }]);

      await app.bean.executor.mockCtx(async () => {
        const associations = await app.scope('admin-rbac').model.rbacGrantDepartment.select({
          where: { rbacGrantId: grantId!, departmentId: departmentId! },
        });
        assert.equal(associations.length, 1);
        assert.equal(String(associations[0].id), String(created[0].id));
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminRbac = app.scope('admin-rbac');
          if (grantId && departmentId) {
            const associations = await adminRbac.model.rbacGrantDepartment.select({
              where: { rbacGrantId: grantId, departmentId },
            });
            for (const association of associations.reverse()) {
              await adminRbac.service.rbacGrantDepartment.delete(association.id);
            }
          }
          if (grantId) {
            const grant = await adminRbac.model.rbacGrant.getById(grantId);
            if (grant) await adminRbac.service.rbacGrant.delete(grant.id);
          }
          if (departmentId) {
            const department = await app
              .scope('admin-department')
              .model.department.getById(departmentId);
            if (department)
              await app.scope('admin-department').service.department.delete(department.id);
          }
          if (roleId) {
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        emitMock.mock.restore();
        getCatalog.mock.restore();
      }
    }
  });
});
