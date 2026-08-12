import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const activateCurrentPath = '/home/user/passportTest/activateCurrent';
const accountStatusPath = '/admin/user/account-status/:id';

describe('passportTest.test.ts', () => {
  it('action:passportTest:activateCurrent', async () => {
    let userId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `passport-test-${crypto.randomUUID()}`,
        });
        userId = user.id as string;
        assert.equal(user.activated, false);
        assert.equal(user.accountStatus, 'active');

        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('post', activateCurrentPath, {
            innerAccess: false,
          });
        });
        assert.equal(error?.code, 401);
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        assert.equal(user?.activated, false);
        await app.bean.passport.signinSystem('mock', -10001 as any, user!.name);
        try {
          const result = await app.bean.executor.performAction('post', activateCurrentPath, {
            innerAccess: false,
          });
          assert.equal(result, undefined);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const scope = app.scope('home-user');
        const user = await app.bean.user.findOneById(userId!);
        assert.equal(user?.activated, true);
        const registeredUser = await scope.model.role.getByName('registeredUser');
        const roleUser = await scope.model.roleUser.get({
          roleId: registeredUser!.id,
          userId: userId!,
        });
        assert.ok(roleUser);
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        await app.bean.passport.signinSystem('mock', -10001 as any, user!.name);
        try {
          const [_, error] = await catchError(() => {
            return app.bean.executor.performAction('post', activateCurrentPath, {
              innerAccess: false,
            });
          });
          assert.equal(error?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      if (userId) {
        await app.bean.executor.mockCtx(async () => {
          const scope = app.scope('home-user');
          await scope.model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId!);
        });
      }
    }
  });

  it('action:passportTest:rejectsDisabledAccountTokens', async () => {
    let userId: string | undefined;
    let userName: string | undefined;
    try {
      let jwt: { accessToken: string; refreshToken: string };
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `passport-disabled-test-${crypto.randomUUID()}`,
        });
        userId = user.id as string;
        userName = user.name;
        jwt = await app.bean.passport.signinSystem('mock', -10001 as any, userName);
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const result = await app.bean.executor.performAction('put', accountStatusPath, {
            params: { id: userId },
            body: { accountStatus: 'disabled' },
          });
          assert.equal(result, null);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const [signinResult, signinError] = await catchError(() => {
          return app.bean.passport.signinSystem('mock', -10001 as any, userName);
        });
        assert.equal(signinResult, undefined);
        assert.equal(signinError?.code, 403);

        const [accessResult, accessError] = await catchError(() => {
          return app.bean.passport.checkAuthToken(jwt.accessToken);
        });
        assert.equal(accessResult, undefined);
        assert.equal(accessError?.code, 403);

        const [refreshResult, refreshError] = await catchError(() => {
          return app.bean.passport.refreshAuthToken(jwt.refreshToken);
        });
        assert.equal(refreshResult, undefined);
        assert.equal(refreshError?.code, 403);
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const result = await app.bean.executor.performAction('put', accountStatusPath, {
            params: { id: userId },
            body: { accountStatus: 'active' },
          });
          assert.equal(result, null);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const [accessResult, accessError] = await catchError(() => {
          return app.bean.passport.checkAuthToken(jwt.accessToken);
        });
        assert.equal(accessResult, undefined);
        assert.equal(accessError?.code, 401);

        const [refreshResult, refreshError] = await catchError(() => {
          return app.bean.passport.refreshAuthToken(jwt.refreshToken);
        });
        assert.equal(refreshResult, undefined);
        assert.equal(refreshError?.code, 401);
      });
    } finally {
      if (userId) {
        await app.bean.executor.mockCtx(async () => {
          await app.bean.user.removeById(userId!);
        });
      }
    }
  });
});
