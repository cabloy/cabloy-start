import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { resolveVisibleSsrMenuGroups } from 'vona-module-a-ssr';

const ssrSiteName = 'start-siteadmin:admin';
const staticMenuName = 'training-student:student#student';
const otherStaticMenuName = 'training-record:record#record';
const publicMenuName = 'start-siteweb:home';
const groupMenuName = 'start-siteadmin:management';
const omittedSiteMenuName = 'admin-role:role';
const webSsrSiteName = 'start-siteweb:web';

async function removeRole(roleId: string | undefined): Promise<void> {
  if (!roleId) return;
  const adminMenu = app.scope('admin-menu');
  const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
  if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
  const role = await app.scope('home-user').model.role.getById(roleId);
  if (role) await app.scope('admin-role').service.role.delete(role.id);
}

describe('roleMenu.test.ts', { concurrency: false }, () => {
  it('ATP-ADM-MNU-04: validates exact eligible leaves and rejects stale identities', async () => {
    const roleName = `admin-menu-role-menu-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu lifecycle fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const service = app.scope('admin-menu').service.roleMenu;
        const identity = { roleId: roleId!, ssrSiteName, ssrMenuName: staticMenuName };
        const created = await service.create(identity);
        assert.equal(String(created.roleId), roleId);

        const [duplicate, duplicateError] = await catchError(() => service.create(identity));
        assert.equal(duplicate, undefined);
        assert.equal(duplicateError?.code, 409);

        for (const unavailable of [
          { roleId: roleId!, ssrSiteName, ssrMenuName: publicMenuName },
          { roleId: roleId!, ssrSiteName, ssrMenuName: groupMenuName },
          { roleId: roleId!, ssrSiteName: 'start-siteweb:web', ssrMenuName: staticMenuName },
          { roleId: roleId!, ssrSiteName, ssrMenuName: 'training-student:student' },
          { roleId: roleId!, ssrSiteName, ssrMenuName: 'admin-menu:missing' },
          { roleId: roleId!, ssrSiteName, ssrMenuName: ` ${staticMenuName}` },
        ]) {
          const [result, error] = await catchError(() => service.create(unavailable));
          assert.equal(result, undefined);
          assert.equal(error?.code, 422);
        }

        await service.delete(identity);
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: identity });
        assert.equal(rows.length, 0);

        const [missing, missingError] = await catchError(() => service.delete(identity));
        assert.equal(missing, undefined);
        assert.equal(missingError?.code, 404);

        const recreated = await service.create(identity);
        assert.equal(String(recreated.roleId), roleId);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('ATP-ADM-MNU-04: keeps omitted-site menu identities separately addressable per site', async () => {
    const roleName = `admin-menu-role-menu-omitted-site-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu omitted-site fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        const service = app.scope('admin-menu').service.roleMenu;
        const identities = [
          { roleId, ssrSiteName, ssrMenuName: omittedSiteMenuName },
          { roleId, ssrSiteName: webSsrSiteName, ssrMenuName: omittedSiteMenuName },
        ];

        for (const identity of identities) await service.create(identity);
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: { roleId } });
        assert.deepEqual(
          rows
            .map(row => [row.ssrSiteName, row.ssrMenuName])
            .toSorted(([leftSite], [rightSite]) => leftSite.localeCompare(rightSite)),
          [
            [ssrSiteName, omittedSiteMenuName],
            [webSsrSiteName, omittedSiteMenuName],
          ],
        );

        await service.delete(identities[0]);
        assert.equal(await app.scope('admin-menu').model.roleMenu.get(identities[0]), undefined);
        assert.ok(await app.scope('admin-menu').model.roleMenu.get(identities[1]));
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('ATP-ADM-MNU-04: ignores retired persisted menu identities during visibility resolution', async () => {
    const roleName = `admin-menu-role-menu-retired-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu retired identity fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        const menus = [{ name: staticMenuName, roles: [] }] as any;
        const resolve = async () =>
          await app
            .scope('a-ssr')
            .event.resolveMenuVisibility.emit(
              { ssrSiteName, menus, currentRoleIds: [role.id] },
              async data => data.menus.filter(menu => menu.roles === undefined),
            );

        await app.scope('admin-menu').model.roleMenu.insert({
          roleId,
          ssrSiteName,
          ssrMenuName: 'training-student:student#retired',
        });
        assert.deepEqual(await resolve(), []);

        await app.scope('admin-menu').service.roleMenu.create({
          roleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        assert.deepEqual(
          (await resolve()).map(menu => menu.name),
          [staticMenuName],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('service:roleMenu applies batch deltas atomically and idempotently', async () => {
    const roleName = `admin-menu-role-menu-batch-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu batch fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);

        const service = app.scope('admin-menu').service.roleMenu;
        const model = app.scope('admin-menu').model.roleMenu;
        const first = { ssrSiteName, ssrMenuName: staticMenuName };
        const second = { ssrSiteName, ssrMenuName: otherStaticMenuName };

        await service.create({ roleId, ...first });
        await service.batch({
          roleId,
          creates: [second, second],
          deletes: [first, first],
        });
        let rows = await model.select({ where: { roleId } });
        assert.deepEqual(rows.map(row => row.ssrMenuName).toSorted(), [otherStaticMenuName]);

        await service.batch({ roleId, creates: [second], deletes: [first] });
        rows = await model.select({ where: { roleId } });
        assert.deepEqual(
          rows.map(row => row.ssrMenuName),
          [otherStaticMenuName],
        );

        const [conflicting, conflictingError] = await catchError(() =>
          service.batch({ roleId, creates: [first], deletes: [first] }),
        );
        assert.equal(conflicting, undefined);
        assert.equal(conflictingError?.code, 422);

        const [invalid, invalidError] = await catchError(() =>
          service.batch({
            roleId,
            creates: [first, { ssrSiteName, ssrMenuName: publicMenuName }],
            deletes: [second],
          }),
        );
        assert.equal(invalid, undefined);
        assert.equal(invalidError?.code, 422);
        rows = await model.select({ where: { roleId } });
        assert.deepEqual(
          rows.map(row => row.ssrMenuName),
          [otherStaticMenuName],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('service:roleMenu serializes duplicate creation', async () => {
    const roleName = `admin-menu-role-menu-race-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu duplicate race',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      const identity = { roleId: roleId!, ssrSiteName, ssrMenuName: staticMenuName };
      const create = () =>
        app.bean.executor.mockCtx(async () =>
          catchError(() => app.scope('admin-menu').service.roleMenu.create(identity)),
        );
      const results = await Promise.all([create(), create()]);
      const created = results.flatMap(([row]) => (row ? [row] : []));
      assert.equal(created.length, 1);
      assert.equal(results.filter(([, error]) => error?.code === 409).length, 1);

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: identity });
        assert.equal(rows.length, 1);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('service:roleMenu serializes competing batch changes for one role', async () => {
    const roleName = `admin-menu-role-menu-batch-race-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu batch race fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      const batch = (ssrMenuName: string) =>
        app.bean.executor.mockCtx(async () =>
          catchError(() =>
            app.scope('admin-menu').service.roleMenu.batch({
              roleId: roleId!,
              creates: [{ ssrSiteName, ssrMenuName }],
              deletes: [],
            }),
          ),
        );
      const results = await Promise.all([batch(staticMenuName), batch(otherStaticMenuName)]);
      assert.equal(results.filter(([, error]) => error).length, 0);

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({
          where: { roleId: roleId! },
        });
        assert.deepEqual(rows.map(row => row.ssrMenuName).toSorted(), [
          otherStaticMenuName,
          staticMenuName,
        ]);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('service:roleMenu remains scoped to the active instance', async () => {
    const instanceName = 'isolateTest' as any;
    const defaultRoleName = `admin-menu-role-menu-default-${crypto.randomUUID()}`;
    const isolatedRoleName = `admin-menu-role-menu-isolated-${crypto.randomUUID()}`;
    let defaultRoleId: string | undefined;
    let isolatedRoleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: defaultRoleName,
          title: 'Role menu default-instance fixture',
          siteIds: ['admin'],
        });
        defaultRoleId = String(role.id);
        await app.scope('admin-menu').service.roleMenu.create({
          roleId: defaultRoleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
      });

      await app.bean.executor.mockCtx(
        async () => {
          const adminMenu = app.scope('admin-menu');
          const foreignRow = await adminMenu.model.roleMenu.get({
            roleId: defaultRoleId!,
            ssrSiteName,
            ssrMenuName: staticMenuName,
          });
          assert.equal(foreignRow, undefined);

          const role = await app.scope('admin-role').service.role.create({
            name: isolatedRoleName,
            title: 'Role menu isolated-instance fixture',
            siteIds: ['admin'],
          });
          isolatedRoleId = String(role.id);
          await adminMenu.service.roleMenu.create({
            roleId: isolatedRoleId,
            ssrSiteName,
            ssrMenuName: staticMenuName,
          });
        },
        { instanceName },
      );

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({
          where: { roleId: defaultRoleId!, ssrSiteName, ssrMenuName: staticMenuName },
        });
        assert.equal(rows.length, 1);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(isolatedRoleId), {
        instanceName,
      });
      await app.bean.executor.mockCtx(async () => await removeRole(defaultRoleId));
    }
  });

  it('service:menuVisibilityRevision maintains state independently by instance', async () => {
    const instanceName = 'isolateTest' as any;
    let isolatedRevisionId: string | undefined;
    let isolatedRevision: number | undefined;
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const adminMenu = app.scope('admin-menu');
          const existing = await adminMenu.model.menuVisibilityRevision.get({});
          isolatedRevision = existing?.revision;
          const revision = adminMenu.service.menuVisibilityRevision;
          const before = Number(await revision.current());
          isolatedRevisionId = String((await adminMenu.model.menuVisibilityRevision.get({}))?.id);
          assert.equal(await revision.invalidate(), String(before + 1));
        },
        { instanceName },
      );
    } finally {
      if (isolatedRevisionId) {
        await app.bean.executor.mockCtx(
          async () => {
            const revision = app.scope('admin-menu').model.menuVisibilityRevision;
            if (isolatedRevision === undefined) {
              await revision.deleteById(isolatedRevisionId!);
            } else {
              await revision.updateById(isolatedRevisionId!, { revision: isolatedRevision });
            }
          },
          { instanceName },
        );
      }
    }
  });

  it('service:roleMenu uses available datasource isolation around caller rollback', async () => {
    const roleName = `admin-menu-role-menu-rollback-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu rollback fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);

        const identity = { roleId, ssrSiteName, ssrMenuName: staticMenuName };
        const supportsDatasourceLevels = app.bean.database.current.dialect.capabilities.level;
        const [result, error] = await catchError(() =>
          app.bean.database.current.transaction.begin(async () => {
            await app.scope('admin-menu').service.roleMenu.create(identity);
            throw new Error('rollback role menu association');
          }),
        );
        assert.equal(result, undefined);
        assert.equal(error?.message, 'rollback role menu association');
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: identity });
        assert.equal(rows.length, supportsDatasourceLevels ? 1 : 0);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });

  it('ATP-ADM-MNU-02: resolves public, dynamic, and static leaves across current roles', async () => {
    const dynamicRoleName = `admin-menu-role-menu-dynamic-${crypto.randomUUID()}`;
    const staticRoleName = `admin-menu-role-menu-static-${crypto.randomUUID()}`;
    let dynamicRoleId: string | undefined;
    let staticRoleId: string | undefined;
    const menus = [
      { name: publicMenuName },
      { name: staticMenuName, roles: [] },
      { name: otherStaticMenuName, roles: [staticRoleName] },
    ] as any;
    try {
      await app.bean.executor.mockCtx(async () => {
        const [dynamicRole, staticRole] = await Promise.all([
          app.scope('admin-role').service.role.create({
            name: dynamicRoleName,
            title: 'Role menu dynamic visibility fixture',
            siteIds: ['admin'],
          }),
          app.scope('admin-role').service.role.create({
            name: staticRoleName,
            title: 'Role menu static visibility fixture',
            siteIds: ['admin'],
          }),
        ]);
        dynamicRoleId = String(dynamicRole.id);
        staticRoleId = String(staticRole.id);
        const resolve = async (currentRoleIds: Array<number | string>) =>
          await app
            .scope('a-ssr')
            .event.resolveMenuVisibility.emit({ ssrSiteName, menus, currentRoleIds }, async data =>
              data.menus.filter(menu => {
                if (menu.roles === undefined) return true;
                if (!menu.roles.length) return false;
                return currentRoleIds.some(roleId => String(roleId) === String(staticRole.id));
              }),
            );

        assert.deepEqual(
          (await resolve([])).map(menu => menu.name),
          [publicMenuName],
        );
        assert.deepEqual(
          (await resolve([staticRole.id])).map(menu => menu.name),
          [publicMenuName, otherStaticMenuName],
        );
        const systemAdmin = await app.scope('home-user').model.role.get({
          name: 'systemAdmin',
        });
        assert.ok(systemAdmin);
        assert.deepEqual(
          (await resolve([systemAdmin.id])).map(menu => menu.name),
          [publicMenuName],
        );

        await app.scope('admin-menu').service.roleMenu.create({
          roleId: dynamicRoleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        assert.deepEqual(
          (await resolve([dynamicRole.id])).map(menu => menu.name),
          [publicMenuName, staticMenuName],
        );
        assert.deepEqual(
          (await resolve([dynamicRole.id, staticRole.id])).map(menu => menu.name),
          [publicMenuName, staticMenuName, otherStaticMenuName],
        );

        await app.scope('admin-menu').service.roleMenu.create({
          roleId: dynamicRoleId,
          ssrSiteName,
          ssrMenuName: otherStaticMenuName,
        });
        assert.deepEqual(
          (await resolve([dynamicRole.id])).map(menu => menu.name),
          [publicMenuName, staticMenuName, otherStaticMenuName],
        );

        await app.scope('admin-menu').service.roleMenu.delete({
          roleId: dynamicRoleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        await app.scope('admin-menu').service.roleMenu.delete({
          roleId: dynamicRoleId,
          ssrSiteName,
          ssrMenuName: otherStaticMenuName,
        });
        assert.deepEqual(
          (await resolve([dynamicRole.id])).map(menu => menu.name),
          [publicMenuName],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await removeRole(staticRoleId);
        await removeRole(dynamicRoleId);
      });
    }
  });

  it('ATP-ADM-MNU-03: removes empty menu groups after their visible leaves are filtered', async () => {
    await app.bean.executor.mockCtx(async () => {
      const groups = [
        { name: 'visible-group', title: 'Visible' },
        { name: 'hidden-group', title: 'Hidden' },
      ];
      const menus = [
        { name: 'visible-leaf', group: 'visible-group' },
        { name: 'hidden-leaf', group: 'hidden-group', roles: [] },
      ] as any;
      const visibleMenus = await app
        .scope('a-ssr')
        .event.resolveMenuVisibility.emit({ ssrSiteName, menus, currentRoleIds: [] }, async data =>
          data.menus.filter(menu => menu.roles === undefined),
        );
      assert.deepEqual(
        resolveVisibleSsrMenuGroups(visibleMenus, groups).map(group => group.name),
        ['visible-group'],
      );
    });
  });

  it('event:policyInvalidated removes associations for deleted roles', async () => {
    const roleName = `admin-menu-role-menu-cleanup-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu cleanup fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        await app.scope('admin-menu').service.roleMenu.create({
          roleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        await app.scope('admin-role').service.role.delete(role.id);
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: { roleId } });
        assert.equal(rows.length, 0);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => await removeRole(roleId));
    }
  });
});
