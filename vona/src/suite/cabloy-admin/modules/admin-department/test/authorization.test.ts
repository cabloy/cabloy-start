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

function departmentService() {
  return app.scope('admin-department').service.department;
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
  it('ATP-ADM-AUT-01:department actions admit only system administrators externally', async () => {
    const departmentIds: string[] = [];
    const membershipIds: string[] = [];
    const userIds: string[] = [];
    let inactiveName!: string;
    let ordinaryName!: string;
    let targetUserId!: string;
    let membershipCreateUserId!: string;
    let rootId!: string;
    let childId!: string;
    let deletableDepartmentId!: string;
    let membershipId!: string;
    let deletableMembershipId!: string;
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
        const membershipCreateUser = await app.bean.user.register({
          name: `admin-auth-membership-create-${crypto.randomUUID()}`,
        });
        const deletionTarget = await app.bean.user.register({
          name: `admin-auth-membership-delete-${crypto.randomUUID()}`,
        });
        userIds.push(
          String(inactive.id),
          String(ordinary.id),
          String(target.id),
          String(membershipCreateUser.id),
          String(deletionTarget.id),
        );
        inactiveName = inactive.name;
        ordinaryName = ordinary.name;
        targetUserId = String(target.id);
        membershipCreateUserId = String(membershipCreateUser.id);
        await app.bean.user.activate(ordinary);

        const root = await departmentService().create({
          name: `Department-Authorization-Root-${crypto.randomUUID()}`,
          parentId: null,
        });
        const child = await departmentService().create({
          name: `Department-Authorization-Child-${crypto.randomUUID()}`,
          parentId: root.id,
        });
        const deletable = await departmentService().create({
          name: `Department-Authorization-Delete-${crypto.randomUUID()}`,
          parentId: null,
        });
        rootId = String(root.id);
        childId = String(child.id);
        deletableDepartmentId = String(deletable.id);
        departmentIds.push(rootId, childId, deletableDepartmentId);

        const membership = await departmentService().createMembership(rootId, {
          userId: targetUserId,
          position: 'Authorization member',
        });
        const deletableMembership = await departmentService().createMembership(childId, {
          userId: deletionTarget.id,
          position: 'Delete authorization member',
        });
        membershipId = String(membership.id);
        deletableMembershipId = String(deletableMembership.id);
        membershipIds.push(membershipId, deletableMembershipId);
        await departmentService().updateMembershipPrimary(rootId, membershipId, { primary: true });
        await departmentService().updateManager(rootId, { membershipId });
      });

      const userNames = { inactive: inactiveName, ordinary: ordinaryName };
      const cases: AuthorizationCase[] = [
        {
          name: 'POST /admin/department',
          invoke: async _caller =>
            await app.bean.executor.performAction('post', '/admin/department', {
              innerAccess: false,
              body: {
                name: `Department-Authorization-Created-${crypto.randomUUID()}`,
                parentId: null,
              },
            }),
          assertSuccess: result => {
            assert.ok(result);
            departmentIds.push(String(result));
          },
        },
        {
          name: 'GET /admin/department',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/department', {
              innerAccess: false,
            }),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/department/tree',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/department/tree', {
              innerAccess: false,
            }),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/department/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('get', '/admin/department/:id', {
              innerAccess: false,
              params: { id: rootId },
            }),
          assertSuccess: result => assert.equal(String(result.id), rootId),
        },
        {
          name: 'PATCH /admin/department/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('patch', '/admin/department/:id', {
              innerAccess: false,
              params: { id: rootId },
              body: { name: 'Updated authorization root' },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'DELETE /admin/department/:id',
          invoke: async _caller =>
            await app.bean.executor.performAction('delete', '/admin/department/:id', {
              innerAccess: false,
              params: { id: deletableDepartmentId },
            }),
          assertSuccess: result => {
            assert.equal(result, null);
            departmentIds.splice(departmentIds.indexOf(deletableDepartmentId), 1);
          },
        },
        {
          name: 'GET /admin/department/:departmentId/memberships',
          invoke: async _caller =>
            await app.bean.executor.performAction(
              'get',
              '/admin/department/:departmentId/memberships',
              { innerAccess: false, params: { departmentId: rootId } },
            ),
          assertSuccess: result => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'POST /admin/department/:departmentId/memberships',
          invoke: async _caller =>
            await app.bean.executor.performAction(
              'post',
              '/admin/department/:departmentId/memberships',
              {
                innerAccess: false,
                params: { departmentId: rootId },
                body: { userId: membershipCreateUserId, position: 'Created authorization member' },
              },
            ),
          assertSuccess: result => {
            assert.ok(result);
            membershipIds.push(String(result));
          },
        },
        {
          name: 'PATCH /admin/department/:departmentId/memberships/:membershipId',
          invoke: async _caller =>
            await app.bean.executor.performAction(
              'patch',
              '/admin/department/:departmentId/memberships/:membershipId',
              {
                innerAccess: false,
                params: { departmentId: rootId, membershipId },
                body: { position: 'Updated authorization member' },
              },
            ),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'DELETE /admin/department/:departmentId/memberships/:membershipId',
          invoke: async _caller =>
            await app.bean.executor.performAction(
              'delete',
              '/admin/department/:departmentId/memberships/:membershipId',
              {
                innerAccess: false,
                params: { departmentId: childId, membershipId: deletableMembershipId },
              },
            ),
          assertSuccess: result => {
            assert.equal(result, null);
            membershipIds.splice(membershipIds.indexOf(deletableMembershipId), 1);
          },
        },
        {
          name: 'PUT /admin/department/:departmentId/memberships/:membershipId/primary',
          invoke: async _caller =>
            await app.bean.executor.performAction(
              'put',
              '/admin/department/:departmentId/memberships/:membershipId/primary',
              {
                innerAccess: false,
                params: { departmentId: rootId, membershipId },
                body: { primary: true },
              },
            ),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/department/:id/manager',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/department/:id/manager', {
              innerAccess: false,
              params: { id: rootId },
              body: { membershipId },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/department/:id/move',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/department/:id/move', {
              innerAccess: false,
              params: { id: childId },
              body: { parentId: rootId },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/department/:id/reorder',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/department/:id/reorder', {
              innerAccess: false,
              params: { id: childId },
              body: { beforeId: null },
            }),
          assertSuccess: result => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/department/:id/activation',
          invoke: async _caller =>
            await app.bean.executor.performAction('put', '/admin/department/:id/activation', {
              innerAccess: false,
              params: { id: childId },
              body: { enabled: true },
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
      await app.bean.executor.mockCtx(async () => {
        const department = app.scope('admin-department');
        const homeUser = app.scope('home-user');
        if (rootId)
          await department.service.department.updateManager(rootId, { membershipId: null });
        if (membershipIds.length)
          await department.model.departmentMembership.deleteBulk(membershipIds);
        for (const departmentId of departmentIds.toReversed()) {
          const item = await department.service.department.view(departmentId);
          if (item) await department.service.department.delete(departmentId);
        }
        if (userIds.length) {
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.toReversed()) {
            await app.bean.user.removeById(userId);
          }
        }
      });
    }
  });
});
