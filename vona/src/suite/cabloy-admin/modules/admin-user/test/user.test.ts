import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const userPath = '/admin/user';

describe('user.test.ts', { concurrency: false }, () => {
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
            },
          });
          assert.equal(updateResult, null);

          let view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assert.equal(view.name, user.name);
          assert.equal(view.avatar, ':emoji:rocket');
          assert.equal(view.email, updatedEmail);
          assert.equal('password' in view, false);
          assert.equal(view.activated, false);

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
          assert.equal(view.activated, true);

          const deactivateResult = await app.bean.executor.performAction(
            'post',
            '/admin/user/deactivate/:id',
            { params: { id: userId } },
          );
          assert.equal(deactivateResult, null);
          view = await app.bean.executor.performAction('get', '/admin/user/:id', {
            params: { id: userId },
          });
          assert.equal(view.activated, false);

          const admin = await app.bean.user.findOneByName('admin');
          assert.ok(admin);
          const [__, protectedTransitionError] = await catchError(() => {
            return app.bean.executor.performAction('post', '/admin/user/deactivate/:id', {
              params: { id: admin.id },
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
