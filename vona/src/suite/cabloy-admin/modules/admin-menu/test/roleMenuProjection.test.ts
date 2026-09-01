import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';
import { $locale as $localeRecord } from 'vona-module-training-record';

const ssrSiteName = 'start-siteadmin:admin';
const otherSsrSiteName = 'start-siteweb:web';
const dynamicMenuName = 'test:roleMenu#dynamic';
const publicMenuName = 'test:roleMenu#public';
const groupName = 'test:roleMenuGroup';
const siteTitle = 'Admin';

function createSsrMenuOnions() {
  return [
    {
      name: 'test:roleMenu',
      beanOptions: {
        options: {
          enable: true,
          site: ssrSiteName,
          items: {
            dynamic: {
              roles: [],
              title: $localeRecord('RecordCreate'),
              group: groupName,
              link: '/private',
              meta: { query: { api: 'private' } },
            },
            public: { title: 'Public title', roles: undefined },
          },
        },
      },
    },
  ] as any;
}

function createSsrMenuGroupOnions() {
  return [
    {
      name: groupName,
      beanOptions: {
        options: {
          enable: true,
          site: ssrSiteName,
          item: { title: 'Menu group' },
        },
      },
    },
  ] as any;
}

describe('roleMenuProjection.test.ts', { concurrency: false }, () => {
  it('projects only safe catalog data and target-role associations', async () => {
    const roleName = `admin-menu-role-menu-projection-${crypto.randomUUID()}`;
    let roleId: string | undefined;
    const getMenus = mock.method(app.bean.onion.ssrMenu, 'getOnionsEnabled', createSsrMenuOnions);
    const getGroups = mock.method(
      app.bean.onion.ssrMenuGroup,
      'getOnionsEnabled',
      createSsrMenuGroupOnions,
    );
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
            ssrMenuName: dynamicMenuName,
          });

          const projection = app.scope('admin-menu').service.roleMenuProjection;
          const catalog = await projection.catalog();
          assert.match(catalog.revision, /^\d+$/);
          assert.deepEqual(
            catalog.list.map(item => item.ssrSiteName),
            [ssrSiteName, otherSsrSiteName],
          );
          const site = catalog.list.find(item => item.ssrSiteName === ssrSiteName)!;
          assert.equal(site.title, siteTitle);
          assert.deepEqual(site.groups, [
            { ssrMenuGroupName: groupName, onionName: groupName, title: 'Menu group' },
          ]);
          assert.deepEqual(site.menus, [
            {
              ssrMenuName: dynamicMenuName,
              onionName: 'test:roleMenu',
              configurable: true,
              title: 'Create Student Training Record',
              group: groupName,
            },
            {
              ssrMenuName: publicMenuName,
              onionName: 'test:roleMenu',
              configurable: false,
              title: 'Public title',
            },
          ]);
          assert.equal(JSON.stringify(catalog).includes('roles'), false);
          assert.equal(JSON.stringify(catalog).includes('link'), false);
          assert.equal(JSON.stringify(catalog).includes('meta'), false);

          const configuration = await projection.roleConfiguration(roleId!);
          assert.equal(String(configuration.roleId), roleId);
          const configurationSite = configuration.list.find(
            item => item.ssrSiteName === ssrSiteName,
          )!;
          assert.equal(configurationSite.title, siteTitle);
          assert.deepEqual(configurationSite.groups, [
            { ssrMenuGroupName: groupName, onionName: groupName, title: 'Menu group' },
          ]);
          assert.deepEqual(configurationSite.menus, [
            {
              ssrMenuName: dynamicMenuName,
              onionName: 'test:roleMenu',
              configurable: true,
              enabled: true,
              title: 'Create Student Training Record',
              group: groupName,
            },
            {
              ssrMenuName: publicMenuName,
              onionName: 'test:roleMenu',
              configurable: false,
              enabled: false,
              title: 'Public title',
            },
          ]);
        },
        { locale: 'en-us' },
      );
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
        getGroups.mock.restore();
        getMenus.mock.restore();
      }
    }
  });

  it('rejects unavailable target roles without disclosing another role configuration', async () => {
    const getMenus = mock.method(app.bean.onion.ssrMenu, 'getOnionsEnabled', createSsrMenuOnions);
    const getGroups = mock.method(
      app.bean.onion.ssrMenuGroup,
      'getOnionsEnabled',
      createSsrMenuGroupOnions,
    );
    try {
      await app.bean.executor.mockCtx(async () => {
        const [result, error] = await catchError(() =>
          app.scope('admin-menu').service.roleMenuProjection.roleConfiguration('999999999'),
        );
        assert.equal(result, undefined);
        assert.equal(error?.code, 422);
      });
    } finally {
      getGroups.mock.restore();
      getMenus.mock.restore();
    }
  });
});
