import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
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
