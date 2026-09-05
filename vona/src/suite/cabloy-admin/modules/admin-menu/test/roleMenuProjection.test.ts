import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const ssrSiteName = 'start-siteadmin:admin';
const otherSsrSiteName = 'start-siteweb:web';
const configurableMenuName = 'training-record:record#record';
const publicMenuName = 'start-siteweb:home';
const groupName = 'start-siteadmin:management';

describe('roleMenuProjection.test.ts', { concurrency: false }, () => {
  it('projects only safe catalog data and target-role associations', async () => {
    const roleName = `admin-menu-role-menu-projection-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const role = await app.scope('admin-role').service.role.create({
            name: roleName,
            title: 'Role menu projection fixture',
            siteIds: ['admin'],
          });
          roleId = String(role.id);
          await app.scope('admin-menu').service.roleMenu.create({
            roleId,
            ssrSiteName,
            ssrMenuName: configurableMenuName,
          });

          const projection = app.scope('admin-menu').service.roleMenuProjection;
          const catalog = await projection.catalog();
          assert.match(catalog.revision, /^\d+$/);
          const site = catalog.list.find(item => item.ssrSiteName === ssrSiteName);
          assert.ok(site);
          const group = site.groups.find(item => item.ssrMenuGroupName === groupName);
          assert.deepEqual(group, {
            ssrMenuGroupName: groupName,
            onionName: groupName,
            title: 'Management',
            order: 1001,
          });
          const menu = site.menus.find(item => item.ssrMenuName === configurableMenuName);
          assert.deepEqual(menu, {
            ssrMenuName: configurableMenuName,
            onionName: 'training-record:record',
            configurable: true,
            title: 'Student Training Record',
            order: 1002,
            group: groupName,
          });
          const publicSite = catalog.list.find(item => item.ssrSiteName === otherSsrSiteName);
          assert.ok(publicSite);
          assert.deepEqual(
            publicSite.menus.find(item => item.ssrMenuName === publicMenuName),
            {
              ssrMenuName: publicMenuName,
              onionName: 'start-siteweb:home',
              configurable: false,
              title: 'Home',
              icon: 'home',
              order: 101,
            },
          );
          assert.equal(JSON.stringify(catalog).includes('roles'), false);
          assert.equal(JSON.stringify(catalog).includes('link'), false);
          assert.equal(JSON.stringify(catalog).includes('meta'), false);

          const configuration = await projection.roleConfiguration(roleId!);
          assert.equal(String(configuration.roleId), roleId);
          const configurationSite = configuration.list.find(
            item => item.ssrSiteName === ssrSiteName,
          );
          assert.ok(configurationSite);
          assert.deepEqual(
            configurationSite.menus.find(item => item.ssrMenuName === configurableMenuName),
            {
              ssrMenuName: configurableMenuName,
              onionName: 'training-record:record',
              configurable: true,
              enabled: true,
              title: 'Student Training Record',
              order: 1002,
              group: groupName,
            },
          );
          const publicConfigurationSite = configuration.list.find(
            item => item.ssrSiteName === otherSsrSiteName,
          );
          assert.ok(publicConfigurationSite);
          assert.deepEqual(
            publicConfigurationSite.menus.find(item => item.ssrMenuName === publicMenuName),
            {
              ssrMenuName: publicMenuName,
              onionName: 'start-siteweb:home',
              configurable: false,
              enabled: false,
              title: 'Home',
              icon: 'home',
              order: 101,
            },
          );
        },
        { locale: 'en-us' },
      );
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (!roleId) return;
        const adminMenu = app.scope('admin-menu');
        const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
        if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
        const role = await app.scope('home-user').model.role.getById(roleId);
        if (role) await app.scope('admin-role').service.role.delete(role.id);
      });
    }
  });

  it('rejects unavailable target roles without disclosing another role configuration', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [result, error] = await catchError(() =>
        app.scope('admin-menu').service.roleMenuProjection.roleConfiguration('999999999'),
      );
      assert.equal(result, undefined);
      assert.equal(error?.code, 422);
    });
  });

  it('ATP-ADM-MNU-05: public menu projection omits policy state for dynamic-role callers', async () => {
    const userIds: string[] = [];
    let userName!: string;
    let roleId: string | undefined;
    const retrieveMenus = async () =>
      await app.bean.executor.performAction('get', '/home/base/menu/:publicPath', {
        innerAccess: false,
        params: { publicPath: 'admin' },
      });
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `admin-menu-projection-${crypto.randomUUID()}`,
        });
        userIds.push(String(user.id));
        userName = user.name;
        await app.bean.user.activate(user);
        await app.bean.passport.signinMock();
        try {
          const role = await app.scope('admin-role').service.role.create({
            name: `admin-menu-projection-role-${crypto.randomUUID()}`,
            title: 'Role menu public projection fixture',
            siteIds: ['admin'],
          });
          roleId = String(role.id);
          await app.scope('home-user').model.roleUser.insert({ userId: user.id, roleId: role.id });
          await app.scope('admin-menu').service.roleMenu.create({
            roleId,
            ssrSiteName,
            ssrMenuName: configurableMenuName,
          });
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const anonymous = await retrieveMenus();
        assert.equal(
          (anonymous.menus ?? []).some(
            (menu: { name: string }) => menu.name === configurableMenuName,
          ),
          false,
        );

        await app.bean.passport.signinSystem('mock', userIds[0] as any, userName);
        try {
          const associated = await retrieveMenus();
          assert.equal(
            (associated.menus ?? []).some(
              (menu: { name: string }) => menu.name === configurableMenuName,
            ),
            true,
          );
          const serialized = JSON.stringify(associated);
          for (const forbidden of ['roles', 'configurable', 'enabled', 'policyRevision']) {
            assert.equal(serialized.includes(forbidden), false, forbidden);
          }
        } finally {
          await app.bean.passport.signout();
        }

        await app.bean.passport.signinMock();
        try {
          const staticRole = await retrieveMenus();
          assert.equal(
            (staticRole.menus ?? []).some(
              (menu: { name: string }) => menu.name === configurableMenuName,
            ),
            true,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (roleId) {
          const adminMenu = app.scope('admin-menu');
          const rows = await adminMenu.model.roleMenu.select({ where: { roleId } });
          if (rows.length) await adminMenu.model.roleMenu.deleteBulk(rows.map(item => item.id));
          const memberships = await app
            .scope('home-user')
            .model.roleUser.select({ where: { roleId } });
          if (memberships.length) {
            await app
              .scope('home-user')
              .model.roleUser.deleteBulk(memberships.map(item => item.id));
          }
          const role = await app.scope('home-user').model.role.getById(roleId);
          if (role) await app.scope('admin-role').service.role.delete(role.id);
        }
        for (const userId of userIds.toReversed()) await app.bean.user.removeById(userId);
      });
    }
  });
});
