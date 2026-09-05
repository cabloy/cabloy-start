import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

type Caller = 'anonymous' | 'inactive' | 'ordinary' | 'systemAdmin';

const ssrSiteName = 'start-siteadmin:admin';
const ssrMenuName = 'training-student:student#student';

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

async function removeRole(roleId: string | undefined): Promise<void> {
  if (!roleId) return;
  const adminMenu = app.scope('admin-menu');
  const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
  if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
  const memberships = await app.scope('home-user').model.roleUser.select({ where: { roleId } });
  if (memberships.length) {
    await app.scope('home-user').model.roleUser.deleteBulk(memberships.map(item => item.id));
  }
  const role = await app.scope('home-user').model.role.getById(roleId);
  if (role) await app.scope('admin-role').service.role.delete(role.id);
}

describe('roleMenuAuthorization.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-MNU-01: role-menu controller admits only system administrators', async () => {
    const userIds: string[] = [];
    const roleIds: string[] = [];
    let inactiveName!: string;
    let ordinaryName!: string;
    let roleId!: string;
    try {
      await app.bean.executor.mockCtx(async () => {
        const inactive = await app.bean.user.register({
          name: `admin-menu-auth-inactive-${crypto.randomUUID()}`,
        });
        const ordinary = await app.bean.user.register({
          name: `admin-menu-auth-ordinary-${crypto.randomUUID()}`,
        });
        userIds.push(String(inactive.id), String(ordinary.id));
        inactiveName = inactive.name;
        ordinaryName = ordinary.name;
        await app.bean.user.activate(ordinary);
        const role = await app.scope('admin-role').service.role.create({
          name: `admin-menu-auth-role-${crypto.randomUUID()}`,
          title: 'Role menu authorization fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        roleIds.push(roleId);
      });

      const userNames = { inactive: inactiveName, ordinary: ordinaryName };
      const cases = [
        {
          name: 'GET /admin/menu/roleMenu/catalog',
          invoke: async () =>
            await app.bean.executor.performAction('get', '/admin/menu/roleMenu/catalog', {
              innerAccess: false,
            }),
          assertSuccess: (result: any) => assert.ok(Array.isArray(result.list)),
        },
        {
          name: 'GET /admin/menu/roleMenu/roles/:roleId/configuration',
          invoke: async () =>
            await app.bean.executor.performAction(
              'get',
              '/admin/menu/roleMenu/roles/:roleId/configuration',
              { innerAccess: false, params: { roleId } },
            ),
          assertSuccess: (result: any) => assert.equal(String(result.roleId), roleId),
        },
        {
          name: 'POST /admin/menu/roleMenu',
          invoke: async () =>
            await app.bean.executor.performAction('post', '/admin/menu/roleMenu', {
              innerAccess: false,
              body: { roleId, ssrSiteName, ssrMenuName },
            }),
          assertSuccess: (result: any) => assert.equal(result, null),
        },
        {
          name: 'DELETE /admin/menu/roleMenu',
          invoke: async () =>
            await app.bean.executor.performAction('delete', '/admin/menu/roleMenu', {
              innerAccess: false,
              body: { roleId, ssrSiteName, ssrMenuName },
            }),
          assertSuccess: (result: any) => assert.equal(result, null),
        },
        {
          name: 'PUT /admin/menu/roleMenu/batch',
          invoke: async () =>
            await app.bean.executor.performAction('put', '/admin/menu/roleMenu/batch', {
              innerAccess: false,
              body: { roleId, creates: [], deletes: [{ ssrSiteName, ssrMenuName }] },
            }),
          assertSuccess: (result: any) => assert.equal(result, null),
        },
      ];

      for (const testCase of cases) {
        for (const [caller, code] of [
          ['anonymous', 401],
          ['inactive', 403],
          ['ordinary', 403],
        ] as const) {
          await withCaller(caller, userNames, async () => {
            const [result, error] = await catchError(testCase.invoke);
            assert.equal(result, undefined, `${caller}: ${testCase.name}`);
            assert.equal(error?.code, code, `${caller}: ${testCase.name}`);
          });
        }
        await withCaller('systemAdmin', userNames, async () => {
          testCase.assertSuccess(await testCase.invoke());
        });
      }
    } finally {
      await app.bean.executor.mockCtx(async () => {
        for (const roleId of roleIds.toReversed()) await removeRole(roleId);
        for (const userId of userIds.toReversed()) await app.bean.user.removeById(userId);
      });
    }
  });

  it('ATP-ADM-MNU-06: menu visibility never grants disclosed or guessed Student API actions', async () => {
    const userIds: string[] = [];
    let userName!: string;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `admin-menu-disclosure-${crypto.randomUUID()}`,
        });
        userIds.push(String(user.id));
        userName = user.name;
        await app.bean.user.activate(user);
        await app.bean.passport.signinMock();
        try {
          const role = await app.scope('admin-role').service.role.create({
            name: `admin-menu-disclosure-role-${crypto.randomUUID()}`,
            title: 'Menu disclosure authorization fixture',
            siteIds: ['admin'],
          });
          roleId = String(role.id);
          await app.scope('home-user').model.roleUser.insert({ userId: user.id, roleId: role.id });
          await app.scope('admin-menu').service.roleMenu.create({
            roleId,
            ssrSiteName,
            ssrMenuName,
          });
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinSystem('mock', userIds[0] as any, userName);
        try {
          for (const associated of [true, false]) {
            if (!associated) {
              await app.scope('admin-menu').service.roleMenu.delete({
                roleId: roleId!,
                ssrSiteName,
                ssrMenuName,
              });
            }
            for (const actionPath of ['/training/student', '/training/record']) {
              const [result, error] = await catchError(() =>
                app.bean.executor.performAction('get', actionPath, { innerAccess: false }),
              );
              assert.equal(result, undefined, actionPath);
              assert.equal(error?.code, 403, actionPath);
            }
          }
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await removeRole(roleId);
        for (const userId of userIds.toReversed()) await app.bean.user.removeById(userId);
      });
    }
  });
});
