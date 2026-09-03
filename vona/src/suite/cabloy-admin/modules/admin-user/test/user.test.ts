import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import { DtoUserDepartmentMembershipSummary } from '../src/dto/userDepartmentMembershipSummary.ts';
import { DtoUserRoleSummary } from '../src/dto/userRoleSummary.ts';
import { DtoUserUpdate } from '../src/dto/userUpdate.tsx';

const userPath = '/admin/user';

function assertUserListProjection(user: Record<string, unknown>) {
  assert.deepEqual(Object.keys(user).sort(), [
    'accountStatus',
    'activated',
    'avatar',
    'email',
    'id',
    'locale',
    'mobile',
    'name',
    'tz',
  ]);
}

function assertUserViewProjection(user: Record<string, unknown>) {
  assert.deepEqual(Object.keys(user).sort(), [
    'accountStatus',
    'activated',
    'avatar',
    'departmentMemberships',
    'email',
    'id',
    'locale',
    'mobile',
    'name',
    'roles',
    'tz',
  ]);
}

describe('user.test.ts', { concurrency: false }, () => {
  it('dto:user:update emits optional readonly name metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoUserUpdate);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.name;
      }) as any;
      assert.ok(component, JSON.stringify(apiJson.components?.schemas));
      assert.equal(component.properties.name.rest?.readonly, true);
      assert.equal(component.required?.includes('name'), false);
      const rootMetadata = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).rest?.schemaScene === 'form';
      });
      assert.ok(rootMetadata);
    });
  });

  it('dto:user:role summary emits protected-role presentation and a view-only replacement action', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoUserRoleSummary);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.name && (item as any).properties?.title;
      }) as any;
      assert.ok(component, JSON.stringify(apiJson.components?.schemas));
      assert.equal(component.properties.title.rest?.table?.render, 'admin-user:roleTitle');
      assert.equal(component.properties.systemAdmin.rest?.visible, false);
      const action = component.rest?.blocks?.[0]?.options?.blocks?.[0]?.options?.actions?.[0];
      assert.equal(action?.render, 'admin-role:actionReplaceUserRoles');
      assert.deepEqual(action?.options?.permission, { formScene: ['view'] });
    });
  });

  it('dto:user:department membership summary emits switch-cell metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(
        DtoUserDepartmentMembershipSummary,
      );
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.enabled && (item as any).properties?.primary;
      }) as any;
      assert.ok(component, JSON.stringify(apiJson.components?.schemas));
      for (const name of ['enabled', 'primary']) {
        assert.equal(component.properties[name].rest?.table?.render, 'start-switch:switch');
        assert.equal(component.properties[name].rest?.table?.columnProps?.color, 'success');
      }
      assert.equal(
        component.properties.departmentId.rest?.table?.render,
        'admin-department:departmentName',
      );
      assert.equal(
        component.properties.departmentId.rest?.table?.columnProps?.resource,
        'admin-department:department',
      );
      const departmentRef = component.properties.department.$ref as string | undefined;
      assert.ok(departmentRef, JSON.stringify(component.properties.department));
      const departmentSchemaName = departmentRef.slice('#/components/schemas/'.length);
      const department = apiJson.components?.schemas?.[departmentSchemaName] as any;
      assert.ok(department, departmentSchemaName);
      assert.equal(department.rest?.visible, false);
      assert.deepEqual(Object.keys(department.properties).sort(), ['id', 'name']);
      assert.equal(component.properties.departmentName, undefined);
    });
  });

  it('action:user:view resolves department membership relation', async () => {
    let userId: string | undefined;
    let departmentId: string | undefined;
    let membershipId: string | undefined;
    const departmentName = `department-user-view-${crypto.randomUUID()}`;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `admin-user-department-${crypto.randomUUID()}`,
        });
        userId = String(user.id);
        const departmentService = app.scope('admin-department').service.department;
        const department = await departmentService.create({ name: departmentName, parentId: null });
        departmentId = String(department.id);
        const membership = await departmentService.createMembership(department.id, {
          userId: user.id,
          position: 'Engineer',
        });
        membershipId = String(membership.id);

        await app.bean.passport.signinMock();
        try {
          const view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: user.id },
          });
          const membershipSummary = view.departmentMemberships.find(
            item => String(item.id) === String(membership.id),
          );
          assert.deepEqual(membershipSummary, {
            id: membership.id,
            departmentId: department.id,
            department: { id: department.id, name: departmentName },
            position: 'Engineer',
            enabled: true,
            primary: false,
          });
          assert.equal('departmentName' in membershipSummary, false);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const departmentScope = app.scope('admin-department');
        if (membershipId)
          await departmentScope.model.departmentMembership.deleteBulk([membershipId]);
        if (departmentId) await departmentScope.service.department.delete(departmentId);
        if (userId) {
          const homeUser = app.scope('home-user');
          await homeUser.model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('action:user:operationalProfileAndActivationCommands', async () => {
    const userIds: string[] = [];
    let userId!: string;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `admin-user-test-${crypto.randomUUID()}`,
        });
        userId = user.id as string;
        userIds.push(userId);
        const otherUser = await app.bean.user.register({
          name: `admin-user-other-test-${crypto.randomUUID()}`,
        });
        const otherUserId = otherUser.id as string;
        userIds.push(otherUserId);

        const [_, unauthenticatedError] = await catchError(() => {
          return app.bean.executor.performAction('get', userPath, { innerAccess: false });
        });
        assert.equal(unauthenticatedError?.code, 401);

        await app.bean.passport.signinMock();
        try {
          const updatedEmail = `admin-user-${crypto.randomUUID()}@example.com`;
          const updateResult = await app.bean.executor.performAction('patch', '/admin/user/:id', {
            params: { id: userId },
            body: {
              avatar: ':emoji:rocket',
              email: updatedEmail,
              mobile: '10000000000',
              locale: 'zh-CN',
              tz: 'Asia/Shanghai',
              name: 'must-not-be-updated',
              activated: true,
              accountStatus: 'disabled',
              password: 'must-not-be-updated',
            },
          });
          assert.equal(updateResult, null);

          let view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assertUserViewProjection(view);
          assert.deepEqual(view.roles, []);
          assert.deepEqual(view.departmentMemberships, []);
          assert.equal(view.name, user.name);
          assert.equal(view.avatar, ':emoji:rocket');
          assert.equal(view.email, updatedEmail);
          assert.equal(view.mobile, '10000000000');
          assert.equal(view.locale, 'zh-CN');
          assert.equal(view.tz, 'Asia/Shanghai');
          assert.equal(view.activated, false);
          assert.equal(view.accountStatus, 'active');

          const users = await app.bean.executor.performAction('get', userPath, {
            query: { where: { name: { _eq_: user.name } } },
          });
          assert.deepEqual(
            users.list.map(item => item.id),
            [userId],
          );
          assertUserListProjection(users.list[0]);

          const [emailConflictResult, emailConflictError] = await catchError(() => {
            return app.bean.executor.performAction('patch', '/admin/user/:id', {
              params: { id: otherUserId },
              body: { email: updatedEmail },
            });
          });
          assert.equal(emailConflictResult, undefined);
          assert.equal(emailConflictError?.code, 'admin-user:1001');
          assert.equal(emailConflictError?.status, 409);

          const activateResult = await app.bean.executor.performAction(
            'post',
            '/admin/user/activate/:id',
            { params: { id: userId } },
          );
          assert.equal(activateResult, null);
          view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assertUserViewProjection(view);
          assert.equal(view.activated, true);
          assert.deepEqual(view.roles, [
            {
              id: (await app.scope('home-user').model.role.getByName('registeredUser'))!.id,
              name: 'registeredUser',
              title: 'Registered User',
              systemAdmin: false,
            },
          ]);

          const disableResult = await app.bean.executor.performAction(
            'put',
            '/admin/user/account-status/:id',
            { params: { id: userId }, body: { accountStatus: 'disabled' } },
          );
          assert.equal(disableResult, null);
          view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assertUserViewProjection(view);
          assert.equal(view.activated, true);
          assert.equal(view.accountStatus, 'disabled');

          const enableResult = await app.bean.executor.performAction(
            'put',
            '/admin/user/account-status/:id',
            { params: { id: userId }, body: { accountStatus: 'active' } },
          );
          assert.equal(enableResult, null);
          view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assert.equal(view.accountStatus, 'active');

          const admin = await app.bean.user.findOneByName('admin');
          assert.ok(admin);
          const [__, protectedTransitionError] = await catchError(() => {
            return app.bean.executor.performAction('put', '/admin/user/account-status/:id', {
              params: { id: admin.id },
              body: { accountStatus: 'disabled' },
            });
          });
          assert.equal(protectedTransitionError?.code, 'admin-user:1002');
          assert.equal(protectedTransitionError?.status, 409);
          const protectedView = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: admin.id },
          });
          assert.equal(protectedView.accountStatus, 'active');
        } finally {
          await app.bean.passport.signout();
        }

        await app.bean.passport.signinSystem('mock', -10001 as any, otherUser.name);
        try {
          const [forbiddenResult, forbiddenError] = await catchError(() => {
            return app.bean.executor.performAction('get', '/admin/user/:id', {
              params: { id: userId },
              innerAccess: false,
            });
          });
          assert.equal(forbiddenResult, undefined);
          assert.equal(forbiddenError?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            assert.equal(
              await app.bean.executor.performAction('get', '/admin/user/:id', {
                params: { id: userId },
              }),
              undefined,
            );
            const users = await app.bean.executor.performAction('get', userPath);
            assert.equal(
              users.list.some(item => String(item.id) === String(userId)),
              false,
            );
            for (const [method, path, body] of [
              ['patch', '/admin/user/:id', { avatar: ':emoji:alien' }],
              ['post', '/admin/user/activate/:id', undefined],
              ['put', '/admin/user/account-status/:id', { accountStatus: 'disabled' }],
            ] as const) {
              const [result, error] = await catchError(() => {
                return app.bean.executor.performAction(method, path, {
                  params: { id: userId },
                  body,
                });
              });
              assert.equal(result, undefined);
              assert.equal(error?.code, 404);
            }
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.scope('home-user').model.user.getById(userId);
        assert.equal(user?.avatar, ':emoji:rocket');
        assert.equal(user?.activated, true);
        assert.equal(user?.accountStatus, 'active');
      });
      if (userIds.length) {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) {
            await app.bean.user.removeById(userId);
          }
        });
      }
    }
  });
});
