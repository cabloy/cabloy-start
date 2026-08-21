import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

import { DtoRbacGrantCreate, DtoRbacGrantUpdate } from '../src/index.ts';

describe('rbacGrant.test.ts', { concurrency: false }, () => {
  it('dto:rbacGrant emits metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const DtoClass of [DtoRbacGrantCreate, DtoRbacGrantUpdate]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        assert.ok(apiJson.components?.schemas);
      }
    });
  });

  it('action:rbacGrant protects its control plane and rejects unavailable actions', async () => {
    const roleName = `admin-rbac-invalid-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'RBAC validation fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const [result, error] = await catchError(() =>
          app.bean.executor.performAction('post', '/admin/rbac/rbacGrant', {
            innerAccess: false,
            body: {
              roleId,
              actionKey: 'test:controller#unavailable',
              dataScope: 'all',
              enabled: true,
            },
          }),
        );
        assert.equal(result, undefined);
        assert.equal(error?.code, 401);
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const [result, error] = await catchError(() =>
            app.bean.executor.performAction('post', '/admin/rbac/rbacGrant', {
              body: {
                roleId,
                actionKey: 'test:controller#unavailable',
                dataScope: 'all',
                enabled: true,
              },
            }),
          );
          assert.equal(result, undefined);
          assert.equal(error?.code, 422);
          const grants = await app.scope('admin-rbac').model.rbacGrant.select({
            where: { roleId },
          });
          assert.equal(grants.length, 0);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (!roleId) return;
        const role = await app.scope('home-user').model.role.getById(roleId);
        if (role) await app.scope('admin-role').service.role.delete(role.id);
      });
    }
  });

  it('service:rbacGrant serializes duplicate creation', async () => {
    const roleName = `admin-rbac-grant-race-${crypto.randomUUID()}`;
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
              options: {},
            },
          ],
        ]),
    );
    let roleId: string | undefined;
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
          title: 'RBAC duplicate grant race',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      assert.ok(roleId);
      const create = () =>
        app.bean.executor.mockCtx(async () => {
          return await catchError(() =>
            app.scope('admin-rbac').service.rbacGrant.create({
              roleId: roleId!,
              actionKey,
              dataScope: 'all',
              enabled: true,
            }),
          );
        });
      const results = await Promise.all([create(), create()]);
      const created = results.flatMap(([grant]) => (grant ? [grant] : []));

      assert.equal(created.length, 1);
      assert.equal(results.filter(([, error]) => error?.code === 409).length, 1);
      assert.deepEqual(invalidationEvents, [{ kind: 'policy' }]);

      await app.bean.executor.mockCtx(async () => {
        const grants = await app.scope('admin-rbac').model.rbacGrant.select({
          where: { roleId: roleId!, actionKey, dataScope: 'all' },
        });
        assert.equal(grants.length, 1);
        assert.equal(String(grants[0].id), String(created[0].id));
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminRbac = app.scope('admin-rbac');
          if (roleId) {
            const grants = await adminRbac.model.rbacGrant.select({
              where: { roleId, actionKey, dataScope: 'all' },
            });
            for (const grant of grants.reverse()) {
              await adminRbac.service.rbacGrant.delete(grant.id);
            }
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
