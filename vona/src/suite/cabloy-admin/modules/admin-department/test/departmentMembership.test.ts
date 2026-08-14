import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import { DtoDepartmentMembershipCreate, DtoDepartmentMembershipUpdate } from '../src/index.ts';

function departmentService() {
  return app.scope('admin-department').service.department;
}

async function deleteMemberships(ids: string[]) {
  await app.bean.executor.mockCtx(async () => {
    if (ids.length) {
      await app.scope('admin-department').model.departmentMembership.deleteBulk(ids);
    }
  });
}

async function deleteDepartments(ids: string[]) {
  await app.bean.executor.mockCtx(async () => {
    for (const id of ids.toReversed()) {
      const department = await departmentService().view(id);
      if (department) await departmentService().delete(id);
    }
  });
}

async function deleteUsers(ids: string[]) {
  await app.bean.executor.mockCtx(async () => {
    const homeUser = app.scope('home-user');
    await homeUser.model.roleUser.delete({ userId: { _in_: ids } });
    for (const id of ids.toReversed()) {
      await app.bean.user.removeById(id);
    }
  });
}

describe('departmentMembership.test.ts', { concurrency: false }, () => {
  it('dto:departmentMembership emits metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const DtoClass of [DtoDepartmentMembershipCreate, DtoDepartmentMembershipUpdate]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        assert.ok(apiJson.components?.schemas);
      }
    });
  });

  it('action:departmentMembership:lifecycleAndBoundaries', async () => {
    const departmentIds: string[] = [];
    const membershipIds: string[] = [];
    const userIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `department-member-${crypto.randomUUID()}`,
        });
        userIds.push(String(user.id));
        const otherUser = await app.bean.user.register({
          name: `department-member-other-${crypto.randomUUID()}`,
        });
        userIds.push(String(otherUser.id));
        const [_, unauthenticatedError] = await catchError(() => {
          return app.bean.executor.performAction(
            'post',
            '/admin/department/:departmentId/memberships',
            {
              innerAccess: false,
              params: { departmentId: -1 },
              body: { userId: user.id, position: 'Engineer' },
            },
          );
        });
        assert.equal(unauthenticatedError?.code, 401);

        await app.bean.passport.signinMock();
        const departmentA = await departmentService().create({
          name: `Department-A-${crypto.randomUUID()}`,
          parentId: null,
        });
        const departmentB = await departmentService().create({
          name: `Department-B-${crypto.randomUUID()}`,
          parentId: null,
        });
        departmentIds.push(String(departmentA.id), String(departmentB.id));

        await app.bean.passport.signout();
        await app.bean.passport.signinSystem('mock', -10001 as any, user.name);
        try {
          const [forbiddenResult, forbiddenError] = await catchError(() => {
            return app.bean.executor.performAction(
              'get',
              '/admin/department/:departmentId/memberships',
              {
                innerAccess: false,
                params: { departmentId: departmentA.id },
              },
            );
          });
          assert.equal(forbiddenResult, undefined);
          assert.equal(forbiddenError?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
        await app.bean.passport.signinMock();

        const membershipA = await app.bean.executor.performAction(
          'post',
          '/admin/department/:departmentId/memberships',
          {
            params: { departmentId: departmentA.id },
            body: { userId: user.id, position: '  Engineer  ' },
          },
        );
        membershipIds.push(String(membershipA));
        const membershipB = await app.bean.executor.performAction(
          'post',
          '/admin/department/:departmentId/memberships',
          {
            params: { departmentId: departmentB.id },
            body: { userId: user.id, position: 'Manager' },
          },
        );
        membershipIds.push(String(membershipB));

        const membershipsA = await app.bean.executor.performAction(
          'get',
          '/admin/department/:departmentId/memberships',
          { params: { departmentId: departmentA.id } },
        );
        assert.deepEqual(membershipsA.list, [
          {
            id: membershipA,
            userId: user.id,
            position: 'Engineer',
            enabled: true,
          },
        ]);
        const membershipsB = await app.bean.executor.performAction(
          'get',
          '/admin/department/:departmentId/memberships',
          { params: { departmentId: departmentB.id } },
        );
        assert.equal(membershipsB.list[0].position, 'Manager');

        const [duplicateResult, duplicateError] = await catchError(() => {
          return app.bean.executor.performAction(
            'post',
            '/admin/department/:departmentId/memberships',
            {
              params: { departmentId: departmentA.id },
              body: { userId: user.id, position: 'Duplicate' },
            },
          );
        });
        assert.equal(duplicateResult, undefined);
        assert.equal(duplicateError?.code, 'admin-department:1006');
        assert.equal(duplicateError?.status, 409);

        const updateResult = await app.bean.executor.performAction(
          'patch',
          '/admin/department/:departmentId/memberships/:membershipId',
          {
            params: { departmentId: departmentA.id, membershipId: membershipA },
            body: {
              userId: otherUser.id,
              departmentId: departmentB.id,
              primary: true,
              position: '  Principal Engineer  ',
              enabled: true,
            },
          },
        );
        assert.equal(updateResult, null);
        const updated = await app
          .scope('admin-department')
          .model.departmentMembership.getById(membershipA);
        assert.ok(updated);
        assert.equal(String(updated!.departmentId), String(departmentA.id));
        assert.equal(String(updated!.userId), String(user.id));
        assert.equal(updated!.primary, false);
        assert.equal(updated!.position, 'Principal Engineer');

        const [disableResult, disableError] = await catchError(() => {
          return app.bean.executor.performAction('put', '/admin/department/:id/activation', {
            params: { id: departmentA.id },
            body: { enabled: false },
          });
        });
        assert.equal(disableResult, undefined);
        assert.equal(disableError?.code, 'admin-department:1005');

        const [deleteResult, deleteError] = await catchError(() => {
          return app.bean.executor.performAction('delete', '/admin/department/:id', {
            params: { id: departmentA.id },
          });
        });
        assert.equal(deleteResult, undefined);
        assert.equal(deleteError?.code, 'admin-department:1005');

        const membershipDeleteResult = await app.bean.executor.performAction(
          'delete',
          '/admin/department/:departmentId/memberships/:membershipId',
          { params: { departmentId: departmentA.id, membershipId: membershipA } },
        );
        assert.equal(membershipDeleteResult, null);
        membershipIds.splice(membershipIds.indexOf(String(membershipA)), 1);
        await app.bean.executor.performAction('put', '/admin/department/:id/activation', {
          params: { id: departmentA.id },
          body: { enabled: false },
        });
      });
    } finally {
      await deleteMemberships(membershipIds);
      await deleteDepartments(departmentIds);
      await deleteUsers(userIds);
    }
  });

  it('action:departmentMembership:scopesMembershipsByInstance', async () => {
    const departmentIds: string[] = [];
    const membershipIds: string[] = [];
    const userIds: string[] = [];
    try {
      let departmentId: string | undefined;
      let membershipId: string | undefined;
      let userId: string | undefined;
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        const department = await departmentService().create({
          name: `Department-Scoped-${crypto.randomUUID()}`,
          parentId: null,
        });
        departmentId = String(department.id);
        departmentIds.push(departmentId);
        const user = await app.bean.user.register({
          name: `department-scoped-${crypto.randomUUID()}`,
        });
        userId = String(user.id);
        userIds.push(userId);
        membershipId = String(
          await app.bean.executor.performAction(
            'post',
            '/admin/department/:departmentId/memberships',
            {
              params: { departmentId },
              body: { userId, position: 'Scoped' },
            },
          ),
        );
        membershipIds.push(membershipId);
      });

      assert.ok(departmentId);
      assert.ok(membershipId);
      assert.ok(userId);
      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          const [createResult, createError] = await catchError(() => {
            return app.bean.executor.performAction(
              'post',
              '/admin/department/:departmentId/memberships',
              {
                params: { departmentId },
                body: { userId, position: 'Foreign' },
              },
            );
          });
          assert.equal(createResult, undefined);
          assert.equal(createError?.code, 404);

          const [listResult, listError] = await catchError(() => {
            return app.bean.executor.performAction(
              'get',
              '/admin/department/:departmentId/memberships',
              {
                params: { departmentId },
              },
            );
          });
          assert.equal(listResult, undefined);
          assert.equal(listError?.code, 404);

          const [updateResult, updateError] = await catchError(() => {
            return app.bean.executor.performAction(
              'patch',
              '/admin/department/:departmentId/memberships/:membershipId',
              {
                params: { departmentId, membershipId },
                body: { position: 'Foreign update' },
              },
            );
          });
          assert.equal(updateResult, undefined);
          assert.equal(updateError?.code, 404);

          const [deleteResult, deleteError] = await catchError(() => {
            return app.bean.executor.performAction(
              'delete',
              '/admin/department/:departmentId/memberships/:membershipId',
              { params: { departmentId, membershipId } },
            );
          });
          assert.equal(deleteResult, undefined);
          assert.equal(deleteError?.code, 404);
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        const membership = await app
          .scope('admin-department')
          .model.departmentMembership.getById(membershipId);
        assert.ok(membership);
        assert.equal(membership!.position, 'Scoped');
      });
    } finally {
      await deleteMemberships(membershipIds);
      await deleteDepartments(departmentIds);
      await deleteUsers(userIds);
    }
  });

  it('action:departmentMembership:serializesDuplicateCreate', async () => {
    const departmentIds: string[] = [];
    const membershipIds: string[] = [];
    const userIds: string[] = [];
    try {
      let departmentId: string | undefined;
      let userId: string | undefined;
      await app.bean.executor.mockCtx(async () => {
        const department = await departmentService().create({
          name: `Department-Race-${crypto.randomUUID()}`,
          parentId: null,
        });
        departmentId = String(department.id);
        departmentIds.push(departmentId);
        const user = await app.bean.user.register({
          name: `department-race-${crypto.randomUUID()}`,
        });
        userId = String(user.id);
        userIds.push(userId);
      });

      assert.ok(departmentId);
      assert.ok(userId);
      const results = await Promise.all([
        app.bean.executor.mockCtx(async () => {
          return await catchError(() => {
            return departmentService().createMembership(departmentId, {
              userId,
              position: 'First',
            });
          });
        }),
        app.bean.executor.mockCtx(async () => {
          return await catchError(() => {
            return departmentService().createMembership(departmentId, {
              userId,
              position: 'Second',
            });
          });
        }),
      ]);
      const created = results.flatMap(([membership]) => (membership ? [membership] : []));
      membershipIds.push(...created.map(item => String(item.id)));
      assert.equal(created.length, 1);
      assert.equal(
        results.filter(([_, error]) => error?.code === 'admin-department:1006').length,
        1,
      );
    } finally {
      await deleteMemberships(membershipIds);
      await deleteDepartments(departmentIds);
      await deleteUsers(userIds);
    }
  });
});
