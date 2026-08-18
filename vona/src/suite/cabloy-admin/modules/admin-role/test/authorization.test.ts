import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { createHash } from 'node:crypto';
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

async function issueFreshProof(proofHashes: string[]) {
  const result = await app.bean.executor.performAction(
    'post',
    '/admin/role/system-admin/fresh-proof',
    {
      innerAccess: false,
      body: { password: '123456' },
    },
  );
  proofHashes.push(createHash('sha256').update(result.proof).digest('hex'));
  return result;
}

describe('authorization.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-AUT-01:role actions admit only system administrators externally', async () => {
    const userIds: string[] = [];
    const roleIds: string[] = [];
    const proofHashes: string[] = [];
    let inactiveName!: string;
    let ordinaryName!: string;
    let targetId!: string;
    let fixtureRoleId!: string;
    let deletableRoleId!: string;
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
        await app.bean.user.activate(target);
        const fixtureRole = await app.scope('admin-role').service.role.create({
          name: `admin-auth-fixture-${crypto.randomUUID()}`,
          title: 'Authorization fixture',
          siteIds: ['admin'],
        });
        fixtureRoleId = String(fixtureRole.id);
        const deletableRole = await app.scope('admin-role').service.role.create({
          name: `admin-auth-deletable-${crypto.randomUUID()}`,
          title: 'Authorization deletable fixture',
          siteIds: ['admin'],
        });
        deletableRoleId = String(deletableRole.id);
        roleIds.push(fixtureRoleId, deletableRoleId);
      });

      const userNames = { inactive: inactiveName, ordinary: ordinaryName };
      const cases: AuthorizationCase[] = [
        {
          name: 'POST /admin/role',
          invoke: async _caller =>
            await app.bean.executor.performAction('post', '/admin/role', {
              innerAccess: false,
              body: {
                name: `admin-auth-created-${crypto.randomUUID()}`,
                title: 'Created by authorization acceptance',
                siteIds: ['admin'],
              },
            }),
          assertSuccess: result => {
            assert.ok(result.id);
            roleIds.push(String(result.id));
          },
        },
        {
          name: 'GET /admin/role',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/role', { innerAccess: false }),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/role/membership-select',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/role/membership-select', {
              innerAccess: false,
            }),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/role/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/role/:id', {
              innerAccess: false,
              params: { id: fixtureRoleId },
            }),
          assertSuccess: result => assert.equal(String(result.id), fixtureRoleId),
        },
        {
          name: 'PATCH /admin/role/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('patch', '/admin/role/:id', {
              innerAccess: false,
              params: { id: fixtureRoleId },
              body: { name: 'ignored', title: 'Updated authorization fixture', siteIds: ['admin'] },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'DELETE /admin/role/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('delete', '/admin/role/:id', {
              innerAccess: false,
              params: { id: deletableRoleId },
            }),
          assertSuccess: result => {
            assert.equal(result, null);
            roleIds.splice(roleIds.indexOf(deletableRoleId), 1);
          },
        },
        {
          name: 'PUT /admin/role/user/:userId/roles',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/role/user/:userId/roles', {
              innerAccess: false,
              params: { userId: targetId },
              body: { roleIds: [fixtureRoleId] },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'POST /admin/role/system-admin/fresh-proof',
          invoke: async caller =>
            caller === 'systemAdmin'
              ? await issueFreshProof(proofHashes)
              : await app.bean.executor.performAction(
                  'post',
                  '/admin/role/system-admin/fresh-proof',
                  {
                    innerAccess: false,
                    body: { password: '123456' },
                  },
                ),
          assertSuccess: result => assert.equal(typeof result.proof, 'string'),
        },
        {
          name: 'POST /admin/role/system-admin/grant/:userId',
          invoke: async caller => {
            const proof =
              caller === 'systemAdmin'
                ? await issueFreshProof(proofHashes)
                : { proof: 'authorization-rejection' };
            return await app.bean.executor.performAction(
              'post',
              '/admin/role/system-admin/grant/:userId',
              {
                innerAccess: false,
                params: { userId: targetId },
                body: { freshProof: proof.proof, reason: 'Authorization acceptance grant' },
              },
            );
          },
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/role/system-admin/account-status/:userId',
          invoke: async caller => {
            const proof =
              caller === 'systemAdmin'
                ? await issueFreshProof(proofHashes)
                : { proof: 'authorization-rejection' };
            return await app.bean.executor.performAction(
              'put',
              '/admin/role/system-admin/account-status/:userId',
              {
                innerAccess: false,
                params: { userId: targetId },
                body: {
                  accountStatus: 'disabled',
                  freshProof: proof.proof,
                  reason: 'Authorization acceptance status',
                },
              },
            );
          },
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/role/system-admin/activation/:userId',
          invoke: async caller => {
            const proof =
              caller === 'systemAdmin'
                ? await issueFreshProof(proofHashes)
                : { proof: 'authorization-rejection' };
            return await app.bean.executor.performAction(
              'put',
              '/admin/role/system-admin/activation/:userId',
              {
                innerAccess: false,
                params: { userId: targetId },
                body: {
                  activated: false,
                  freshProof: proof.proof,
                  reason: 'Authorization acceptance activation',
                },
              },
            );
          },
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'POST /admin/role/system-admin/revoke/:userId',
          invoke: async caller => {
            const proof =
              caller === 'systemAdmin'
                ? await issueFreshProof(proofHashes)
                : { proof: 'authorization-rejection' };
            return await app.bean.executor.performAction(
              'post',
              '/admin/role/system-admin/revoke/:userId',
              {
                innerAccess: false,
                params: { userId: targetId },
                body: { freshProof: proof.proof, reason: 'Authorization acceptance revoke' },
              },
            );
          },
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
      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        if (userIds.length) {
          await adminRole.model.systemAdminSessionEviction.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminAudit.delete({ targetId: { _in_: userIds } });
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
        }
        if (proofHashes.length) {
          await adminRole.model.systemAdminFreshProof.delete({ proofHash: { _in_: proofHashes } });
        }
        for (const roleId of roleIds.toReversed()) {
          const memberships = await homeUser.model.roleUser.select({ where: { roleId } });
          if (memberships.length)
            await homeUser.model.roleUser.deleteBulk(memberships.map(item => item.id));
          await homeUser.model.role.deleteById(roleId);
        }
        for (const userId of userIds.toReversed()) {
          await app.bean.user.removeById(userId);
        }
      });
    }
  });
});
