import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

const ssrSiteName = 'start-siteadmin:admin';
const dynamicMenuName = 'test:roleMenu#dynamic';
const staticMenuName = 'test:roleMenu#static';
const publicMenuName = 'test:roleMenu#public';

function createSsrMenuOnions() {
  return [
    {
      name: 'test:roleMenu',
      beanOptions: {
        options: {
          enable: true,
          site: ssrSiteName,
          items: {
            dynamic: { roles: [] },
            static: { roles: ['systemAdmin'] },
            public: {},
          },
        },
      },
    },
  ] as any;
}

describe('roleMenu.test.ts', { concurrency: false }, () => {
  it('service:roleMenu validates eligible leaves and deletes associations', async () => {
    const roleName = `admin-menu-role-menu-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
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
        const dynamic = { roleId: roleId!, ssrSiteName, ssrMenuName: dynamicMenuName };
        const menuRevision = app.scope('admin-menu').service.menuVisibilityRevision;
        const policyRevision = app.scope('admin-rbac').service.rbacPolicyRevision;
        const menuRevisionBefore = Number(await menuRevision.current());
        const policyRevisionBefore = await policyRevision.current();
        const created = await service.create(dynamic);
        assert.equal(String(created.roleId), roleId);
        assert.equal(Number(await menuRevision.current()), menuRevisionBefore + 1);
        assert.equal(await policyRevision.current(), policyRevisionBefore);

        const [duplicate, duplicateError] = await catchError(() => service.create(dynamic));
        assert.equal(duplicate, undefined);
        assert.equal(duplicateError?.code, 409);

        for (const identity of [
          { roleId: roleId!, ssrSiteName, ssrMenuName: publicMenuName },
          { roleId: roleId!, ssrSiteName: 'start-siteweb:web', ssrMenuName: dynamicMenuName },
          { roleId: roleId!, ssrSiteName, ssrMenuName: 'test:roleMenu#missing' },
          { roleId: roleId!, ssrSiteName, ssrMenuName: ` ${dynamicMenuName}` },
        ]) {
          const [result, error] = await catchError(() => service.create(identity));
          assert.equal(result, undefined);
          assert.equal(error?.code, 422);
        }

        await service.delete(dynamic);
        assert.equal(Number(await menuRevision.current()), menuRevisionBefore + 2);
        assert.equal(await policyRevision.current(), policyRevisionBefore);
        const rows = await app.scope('admin-menu').model.roleMenu.select({
          where: dynamic,
        });
        assert.equal(rows.length, 0);

        const [missing, missingError] = await catchError(() => service.delete(dynamic));
        assert.equal(missing, undefined);
        assert.equal(missingError?.code, 404);

        const recreated = await service.create(dynamic);
        assert.equal(String(recreated.roleId), roleId);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('service:roleMenu applies batch deltas atomically and idempotently', async () => {
    const roleName = `admin-menu-role-menu-batch-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu batch fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const service = app.scope('admin-menu').service.roleMenu;
        const model = app.scope('admin-menu').model.roleMenu;
        const revision = app.scope('admin-menu').service.menuVisibilityRevision;
        const dynamic = { ssrSiteName, ssrMenuName: dynamicMenuName };
        const staticMenu = { ssrSiteName, ssrMenuName: staticMenuName };
        const revisionBefore = Number(await revision.current());

        await service.create({ roleId: roleId!, ...dynamic });
        assert.equal(Number(await revision.current()), revisionBefore + 1);

        await service.batch({
          roleId: roleId!,
          creates: [staticMenu, staticMenu],
          deletes: [dynamic, dynamic],
        });
        assert.equal(Number(await revision.current()), revisionBefore + 2);
        const rows = await model.select({ where: { roleId: roleId! } });
        assert.deepEqual(rows.map(row => row.ssrMenuName).toSorted(), [staticMenuName]);

        await service.batch({
          roleId: roleId!,
          creates: [staticMenu],
          deletes: [dynamic],
        });
        assert.equal(Number(await revision.current()), revisionBefore + 2);

        const [conflicting, conflictingError] = await catchError(() =>
          service.batch({
            roleId: roleId!,
            creates: [dynamic],
            deletes: [dynamic],
          }),
        );
        assert.equal(conflicting, undefined);
        assert.equal(conflictingError?.code, 422);

        const [invalid, invalidError] = await catchError(() =>
          service.batch({
            roleId: roleId!,
            creates: [dynamic, { ssrSiteName, ssrMenuName: publicMenuName }],
            deletes: [staticMenu],
          }),
        );
        assert.equal(invalid, undefined);
        assert.equal(invalidError?.code, 422);
        const rowsAfterInvalid = await model.select({ where: { roleId: roleId! } });
        assert.deepEqual(
          rowsAfterInvalid.map(row => row.ssrMenuName),
          [staticMenuName],
        );
        assert.equal(Number(await revision.current()), revisionBefore + 2);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('service:roleMenu serializes duplicate creation', async () => {
    const roleName = `admin-menu-role-menu-race-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
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
        app.bean.executor.mockCtx(async () => {
          return await catchError(() => app.scope('admin-menu').service.roleMenu.create(identity));
        });
      const results = await Promise.all([create(), create()]);
      const created = results.flatMap(([row]) => (row ? [row] : []));
      assert.equal(created.length, 1);
      assert.equal(results.filter(([, error]) => error?.code === 409).length, 1);

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: identity });
        assert.equal(rows.length, 1);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('service:roleMenu serializes competing batch changes for one role', async () => {
    const roleName = `admin-menu-role-menu-batch-race-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
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
        app.bean.executor.mockCtx(async () => {
          return await catchError(() =>
            app.scope('admin-menu').service.roleMenu.batch({
              roleId: roleId!,
              creates: [{ ssrSiteName, ssrMenuName }],
              deletes: [],
            }),
          );
        });
      const results = await Promise.all([batch(dynamicMenuName), batch(staticMenuName)]);
      assert.equal(results.filter(([, error]) => error).length, 0);

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({
          where: { roleId: roleId! },
        });
        assert.deepEqual(rows.map(row => row.ssrMenuName).toSorted(), [
          dynamicMenuName,
          staticMenuName,
        ]);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('service:roleMenu remains scoped to the active instance', async () => {
    const instanceName = 'isolateTest' as any;
    const defaultRoleName = `admin-menu-role-menu-default-${crypto.randomUUID()}`;
    const isolatedRoleName = `admin-menu-role-menu-isolated-${crypto.randomUUID()}`;
    let defaultRoleId: string | undefined;
    let isolatedRoleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
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
          ssrMenuName: dynamicMenuName,
        });
      });

      await app.bean.executor.mockCtx(
        async () => {
          const adminMenu = app.scope('admin-menu');
          const foreignRow = await adminMenu.model.roleMenu.get({
            roleId: defaultRoleId!,
            ssrSiteName,
            ssrMenuName: dynamicMenuName,
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
            ssrMenuName: dynamicMenuName,
          });
        },
        { instanceName },
      );

      await app.bean.executor.mockCtx(async () => {
        const rows = await app.scope('admin-menu').model.roleMenu.select({
          where: { roleId: defaultRoleId!, ssrSiteName, ssrMenuName: dynamicMenuName },
        });
        assert.equal(rows.length, 1);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(
          async () => {
            const adminMenu = app.scope('admin-menu');
            if (isolatedRoleId) {
              const rows = await adminMenu.model.roleMenu.select({
                where: { roleId: isolatedRoleId },
              });
              if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
              const role = await app.scope('home-user').model.role.getById(isolatedRoleId);
              if (role) await app.scope('admin-role').service.role.delete(role.id);
            }
          },
          { instanceName },
        );
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (defaultRoleId) {
            const rows = await adminMenu.model.roleMenu.select({
              where: { roleId: defaultRoleId },
            });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(defaultRoleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('service:menuVisibilityRevision maintains state independently by instance', async () => {
    const instanceName = 'isolateTest' as any;
    let isolatedRevisionId: string | undefined;
    let isolatedRevision: number | undefined;
    let defaultRevision: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        defaultRevision = await app.scope('admin-menu').service.menuVisibilityRevision.current();
      });
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
      await app.bean.executor.mockCtx(async () => {
        assert.equal(
          await app.scope('admin-menu').service.menuVisibilityRevision.current(),
          defaultRevision,
        );
      });
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

  it('service:roleMenu rolls back a failed caller transaction', async () => {
    const roleName = `admin-menu-role-menu-rollback-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu rollback fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const identity = { roleId: roleId!, ssrSiteName, ssrMenuName: dynamicMenuName };
        const menuRevision = app.scope('admin-menu').service.menuVisibilityRevision;
        const revisionBefore = await menuRevision.current();
        const [result, error] = await catchError(() =>
          app.bean.database.current.transaction.begin(async () => {
            await app.scope('admin-menu').service.roleMenu.create(identity);
            throw new Error('rollback role menu association');
          }),
        );
        assert.equal(result, undefined);
        assert.equal(error?.message, 'rollback role menu association');
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: identity });
        assert.equal(rows.length, 0);
        assert.equal(await menuRevision.current(), revisionBefore);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('event:resolveMenuVisibility adds exact dynamic associations without a role bypass', async () => {
    const roleName = `admin-menu-role-menu-visibility-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
    const menus = [
      { name: publicMenuName },
      { name: dynamicMenuName, roles: [] },
      { name: staticMenuName, roles: ['someOtherRole'] },
    ] as any;
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu visibility fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        await app.scope('admin-menu').service.roleMenu.create({
          roleId,
          ssrSiteName,
          ssrMenuName: dynamicMenuName,
        });
        const visible = await app
          .scope('a-ssr')
          .event.resolveMenuVisibility.emit(
            { ssrSiteName, menus, currentRoleIds: [role.id] },
            async data => data.menus.filter(menu => menu.roles === undefined),
          );
        assert.deepEqual(
          visible.map(menu => menu.name),
          [publicMenuName, dynamicMenuName],
        );

        await app.scope('admin-menu').service.roleMenu.create({
          roleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        const visibleStaticOrDynamic = await app
          .scope('a-ssr')
          .event.resolveMenuVisibility.emit(
            { ssrSiteName, menus, currentRoleIds: [role.id] },
            async data => data.menus.filter(menu => menu.roles === undefined),
          );
        assert.deepEqual(
          visibleStaticOrDynamic.map(menu => menu.name),
          [publicMenuName, dynamicMenuName, staticMenuName],
        );

        await app.scope('admin-menu').service.roleMenu.delete({
          roleId,
          ssrSiteName,
          ssrMenuName: dynamicMenuName,
        });
        await app.scope('admin-menu').service.roleMenu.delete({
          roleId,
          ssrSiteName,
          ssrMenuName: staticMenuName,
        });
        const visibleAfterDelete = await app
          .scope('a-ssr')
          .event.resolveMenuVisibility.emit(
            { ssrSiteName, menus, currentRoleIds: [role.id] },
            async data => data.menus.filter(menu => menu.roles === undefined),
          );
        assert.deepEqual(
          visibleAfterDelete.map(menu => menu.name),
          [publicMenuName],
        );
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          const adminMenu = app.scope('admin-menu');
          if (roleId) {
            const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
            if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });

  it('event:policyInvalidated removes associations for deleted roles', async () => {
    const roleName = `admin-menu-role-menu-cleanup-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getOnionsEnabled = mock.method(
      app.bean.onion.ssrMenu,
      'getOnionsEnabled',
      createSsrMenuOnions,
    );
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'Role menu cleanup fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        const menuRevision = app.scope('admin-menu').service.menuVisibilityRevision;
        const revisionBefore = Number(await menuRevision.current());
        await app.scope('admin-menu').service.roleMenu.create({
          roleId,
          ssrSiteName,
          ssrMenuName: dynamicMenuName,
        });
        await app.scope('admin-role').service.role.delete(role.id);
        const rows = await app.scope('admin-menu').model.roleMenu.select({ where: { roleId } });
        assert.equal(rows.length, 0);
        assert.equal(Number(await menuRevision.current()), revisionBefore + 2);
      });
    } finally {
      try {
        await app.bean.executor.mockCtx(async () => {
          if (!roleId) return;
          const adminMenu = app.scope('admin-menu');
          const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
          if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
          const role = await app.scope('home-user').model.role.getById(roleId);
          if (role) await app.scope('admin-role').service.role.delete(role.id);
        });
      } finally {
        getOnionsEnabled.mock.restore();
      }
    }
  });
});
