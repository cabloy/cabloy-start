import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

type Caller = 'anonymous' | 'inactive' | 'ordinary' | 'systemAdmin';

interface AuthorizationCase {
  name: string;
  invoke: (caller: Caller) => Promise<any>;
  assertSuccess: (result: any) => void;
}

async function withCaller(
  caller: Caller,
  userNames: { inactive: string; ordinary: string },
  fn: () => Promise<void>,
) {
  await app.bean.executor.mockCtx(async () => {
    if (caller === 'inactive') {
      await app.bean.passport.signinSystem('mock', -10001 as any, userNames.inactive);
    } else if (caller === 'ordinary') {
      await app.bean.passport.signinSystem('mock', -10002 as any, userNames.ordinary);
    } else if (caller === 'systemAdmin') {
      await app.bean.passport.signinMock();
    }
    try {
      await fn();
    } finally {
      if (caller !== 'anonymous') await app.bean.passport.signout();
    }
  });
}

async function assertRejected(
  caller: Exclude<Caller, 'systemAdmin'>,
  userNames: { inactive: string; ordinary: string },
  testCase: AuthorizationCase,
  expectedCode: 401 | 403,
) {
  await withCaller(caller, userNames, async () => {
    const [result, error] = await catchError(() => testCase.invoke(caller));
    assert.equal(result, undefined, `${caller}: ${testCase.name}`);
    assert.equal(error?.code, expectedCode, `${caller}: ${testCase.name}`);
  });
}

describe('authorization.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-AUT-01:user actions admit only system administrators externally', async () => {
    const userIds: string[] = [];
    let targetId!: string;
    let inactiveName!: string;
    let ordinaryName!: string;
    try {
      await app.bean.executor.mockCtx(async () => {
        const inactive = await app.bean.user.register({
          name: `admin-auth-inactive-${crypto.randomUUID()}`,
        });
        const ordinary = await app.bean.user.register({
          name: `admin-auth-ordinary-${crypto.randomUUID()}`,
        });
        const target = await app.bean.user.register({
          name: `admin-auth-target-${crypto.randomUUID()}`,
        });
        userIds.push(String(inactive.id), String(ordinary.id), String(target.id));
        inactiveName = inactive.name;
        ordinaryName = ordinary.name;
        targetId = String(target.id);
        await app.bean.user.activate(ordinary);
      });

      const userNames = { inactive: inactiveName, ordinary: ordinaryName };
      const cases: AuthorizationCase[] = [
        {
          name: 'GET /admin/user',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/user', { innerAccess: false }),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/user/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/user/:id', {
              innerAccess: false,
              params: { id: targetId },
            }),
          assertSuccess: result => assert.equal(String(result.id), targetId),
        },
        {
          name: 'PATCH /admin/user/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('patch', '/admin/user/:id', {
              innerAccess: false,
              params: { id: targetId },
              body: { avatar: ':emoji:shield' },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'POST /admin/user/activate/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('post', '/admin/user/activate/:id', {
              innerAccess: false,
              params: { id: targetId },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/user/account-status/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/user/account-status/:id', {
              innerAccess: false,
              params: { id: targetId },
              body: { accountStatus: 'active' },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
      ];

      for (const testCase of cases) {
        await assertRejected('anonymous', userNames, testCase, 401);
        await assertRejected('inactive', userNames, testCase, 403);
        await assertRejected('ordinary', userNames, testCase, 403);
      }
      await withCaller('systemAdmin', userNames, async () => {
        for (const testCase of cases) {
          const result = await testCase.invoke('systemAdmin');
          testCase.assertSuccess(result);
        }
      });
    } finally {
      if (userIds.length) {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.toReversed()) {
            await app.bean.user.removeById(userId);
          }
        });
      }
    }
  });
});
