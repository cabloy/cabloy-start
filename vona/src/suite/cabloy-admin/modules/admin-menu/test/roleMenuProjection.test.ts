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
});
