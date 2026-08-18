import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import { DtoRoleUpdate } from '../src/dto/roleUpdate.tsx';
import { DtoUserRoleReplace } from '../src/dto/userRoleReplace.ts';

const rolePath = '/admin/role';

function assertRoleProjection(role: Record<string, unknown>) {
  assert.deepEqual(Object.keys(role).sort(), [
    'id',
    'name',
    'siteIds',
    'sites',
    'title',
    'titleLocales',
  ]);
}

describe('role.test.ts', { concurrency: false }, () => {
  it('dto:role:update emits name readonly metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoRoleUpdate);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.name;
      }) as any;
      assert.ok(component, JSON.stringify(apiJson.components?.schemas));
      assert.equal(component.properties.name.rest?.readonly, true);
      assert.equal(component.required?.includes('name'), true);
      const rootMetadata = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).rest?.schemaScene === 'form';
      });
      assert.ok(rootMetadata);
    });
  });

  it('dto:role:userRoleReplace emits a non-system-administrator multi-select picker', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoUserRoleReplace);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.roleIds;
      }) as any;
      assert.ok(component, JSON.stringify(apiJson.components?.schemas));
      assert.deepEqual(component.properties.roleIds.rest?.form, {
        render: 'start-resource:formFieldResourcePicker',
        options: {
          resource: 'admin-role:role',
          actionPath: 'membership-select',
          selectOptions: {
            multiple: true,
            itemValue: 'id',
            itemTitle: 'title',
          },
        },
      });
    });
  });

  it('action:role:ordinaryLifecycleAndMembershipReplacement', async () => {
    let roleId: string | undefined;
    const userIds: string[] = [];
    const shareTestUserIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const roleName = `admin-role-test-${crypto.randomUUID()}`;
        const ordinaryUser = await app.bean.user.register({
          name: `admin-role-user-${crypto.randomUUID()}`,
        });
        userIds.push(ordinaryUser.id as string);
        const [_, unauthenticatedError] = await catchError(() => {
          return app.bean.executor.performAction('post', rolePath, {
            innerAccess: false,
            body: {
              name: roleName,
              title: 'Admin role test',
              titleLocales: { 'zh-cn': '管理员角色', 'retired-locale': 'Retired title' },
              siteIds: ['web'],
            },
          });
        });
        assert.equal(unauthenticatedError?.code, 401);

        await app.bean.passport.signinMock();
        try {
          const role = await app.bean.executor.performAction('post', rolePath, {
            body: {
              name: roleName,
              title: 'Admin role test',
              titleLocales: { 'zh-cn': '管理员角色', 'retired-locale': 'Retired title' },
              siteIds: ['web'],
            },
          });
          roleId = role.id;
          assertRoleProjection(role);
          assert.equal(role.name, roleName);
          assert.deepEqual(role.titleLocales, {
            'zh-cn': '管理员角色',
            'retired-locale': 'Retired title',
          });
          assert.deepEqual(role.sites, [{ siteId: 'web', title: 'Web' }]);

          const [duplicateResult, duplicateError] = await catchError(() => {
            return app.bean.executor.performAction('post', rolePath, {
              body: { name: roleName.toUpperCase(), title: 'Duplicate role', siteIds: ['web'] },
            });
          });
          assert.equal(duplicateResult, undefined);
          assert.equal(duplicateError?.code, 'admin-role:1001');
          assert.equal(duplicateError?.status, 409);

          for (const name of ['registeredUser', 'systemAdmin']) {
            const [builtinResult, builtinError] = await catchError(() => {
              return app.bean.executor.performAction('post', rolePath, {
                body: { name, title: 'Protected role', siteIds: ['admin'] },
              });
            });
            assert.equal(builtinResult, undefined);
            assert.equal(builtinError?.code, 'admin-role:1002');
            assert.equal(builtinError?.status, 409);
          }

          const [invalidSiteResult, invalidSiteError] = await catchError(() => {
            return app.bean.executor.performAction('post', rolePath, {
              body: {
                name: `${roleName}-invalid-site`,
                title: 'Invalid site',
                siteIds: ['invalid-a', 'invalid-b'],
              },
            });
          });
          assert.equal(invalidSiteResult, undefined);
          assert.equal(invalidSiteError?.code, 422);
          assert.equal(invalidSiteError?.message?.[0]?.code, 'custom');
          assert.equal(
            invalidSiteError?.message?.[0]?.message,
            'Sites "invalid-a", "invalid-b" are unavailable',
          );

          const [singleInvalidSiteResult, singleInvalidSiteError] = await catchError(() => {
            return app.bean.executor.performAction('post', rolePath, {
              body: {
                name: `${roleName}-single-invalid-site`,
                title: 'Single invalid site',
                siteIds: ['invalid-single'],
              },
            });
          });
          assert.equal(singleInvalidSiteResult, undefined);
          assert.equal(singleInvalidSiteError?.code, 422);
          const singleInvalidSiteIssue = (singleInvalidSiteError?.message as any)?.[0];
          assert.equal(singleInvalidSiteIssue?.message, 'Site "invalid-single" is unavailable');
          assert.deepEqual(singleInvalidSiteIssue?.path, ['siteIds']);
          assert.deepEqual(invalidSiteError?.message?.[0]?.path, ['siteIds']);

          const view = await app.bean.executor.performAction('get', '/admin/role/:id', {
            params: { id: roleId },
          });
          assertRoleProjection(view);
          assert.equal(view.name, roleName);

          const updateResult = await app.bean.executor.performAction('patch', '/admin/role/:id', {
            params: { id: roleId },
            body: {
              id: 'must-not-be-updated',
              iid: -1,
              deleted: true,
              createdAt: '2026-01-01T00:00:00.000Z',
              name: 'must-not-be-updated',
              title: 'Updated admin role test',
              titleLocales: { 'zh-cn': '更新后的管理员角色', 'retired-locale': 'Retired title' },
              siteIds: ['web', 'admin'],
              sites: [{ siteId: 'invalid', title: 'Untrusted' }],
            },
          });
          assert.equal(updateResult, null);

          const updatedRole = await app.bean.executor.performAction('get', '/admin/role/:id', {
            params: { id: roleId },
          });
          assertRoleProjection(updatedRole);
          assert.equal(updatedRole.name, roleName);
          assert.equal(updatedRole.title, 'Updated admin role test');
          assert.deepEqual(updatedRole.titleLocales, {
            'zh-cn': '更新后的管理员角色',
            'retired-locale': 'Retired title',
          });
          assert.deepEqual(updatedRole.sites, [
            { siteId: 'web', title: 'Web' },
            { siteId: 'admin', title: 'Admin' },
          ]);

          const admin = await app.bean.user.findOneByName('admin');
          assert.ok(admin);
          const homeUser = app.scope('home-user');
          const registeredUser = await homeUser.model.role.getByName('registeredUser');
          assert.ok(registeredUser);
          const systemAdmin = await homeUser.model.role.getByName('systemAdmin');
          assert.ok(systemAdmin);

          const membershipCandidates = await app.bean.executor.performAction(
            'get',
            '/admin/role/membership-select',
          );
          assert.equal(
            membershipCandidates.list.some(item => String(item.id) === String(registeredUser.id)),
            true,
          );
          assert.equal(
            membershipCandidates.list.some(item => String(item.id) === String(systemAdmin.id)),
            false,
          );
          const filteredMembershipCandidates = await app.bean.executor.performAction(
            'get',
            '/admin/role/membership-select',
            { query: { where: { name: { _eq_: 'systemAdmin' } } } },
          );
          assert.deepEqual(filteredMembershipCandidates.list, []);

          const replacementResult = await app.bean.executor.performAction(
            'put',
            '/admin/role/user/:userId/roles',
            {
              params: { userId: admin.id },
              body: { roleIds: [registeredUser.id, roleId] },
            },
          );
          assert.equal(replacementResult, null);
          assert.ok(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: registeredUser.id,
            }),
          );
          assert.ok(await homeUser.model.roleUser.get({ userId: admin.id, roleId }));
          assert.ok(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: systemAdmin.id,
            }),
          );

          assert.equal(
            await app.bean.executor.performAction('put', '/admin/role/user/:userId/roles', {
              params: { userId: admin.id },
              body: { roleIds: [roleId] },
            }),
            null,
          );
          assert.equal(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: registeredUser.id,
            }),
            undefined,
          );
          assert.ok(await homeUser.model.roleUser.get({ userId: admin.id, roleId }));
          assert.ok(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: systemAdmin.id,
            }),
          );

          const [__, protectedRoleError] = await catchError(() => {
            return app.bean.executor.performAction('put', '/admin/role/user/:userId/roles', {
              params: { userId: admin.id },
              body: { roleIds: [roleId, systemAdmin.id] },
            });
          });
          assert.equal(protectedRoleError?.code, 'admin-role:1002');
          assert.equal(protectedRoleError?.status, 409);
          assert.ok(await homeUser.model.roleUser.get({ userId: admin.id, roleId }));
          assert.equal(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: registeredUser.id,
            }),
            undefined,
          );
          assert.ok(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId: systemAdmin.id,
            }),
          );

          const [duplicateMembershipResult, duplicateMembershipError] = await catchError(() => {
            return app.bean.executor.performAction('put', '/admin/role/user/:userId/roles', {
              params: { userId: admin.id },
              body: { roleIds: [roleId, roleId] },
            });
          });
          assert.equal(duplicateMembershipResult, undefined);
          assert.equal(duplicateMembershipError?.code, 'admin-role:1003');
          assert.equal(duplicateMembershipError?.status, 409);
          assert.ok(
            await homeUser.model.roleUser.get({
              userId: admin.id,
              roleId,
            }),
          );

          for (const fixedRole of [registeredUser, systemAdmin]) {
            assert.equal(
              await app.bean.executor.performAction('get', '/admin/role/:id', {
                params: { id: fixedRole.id },
              }),
              undefined,
            );
            const [fixedUpdateResult, fixedUpdateError] = await catchError(() => {
              return app.bean.executor.performAction('patch', '/admin/role/:id', {
                params: { id: fixedRole.id },
                body: { name: fixedRole.name, title: 'Protected role update' },
              });
            });
            assert.equal(fixedUpdateResult, undefined);
            assert.equal(fixedUpdateError?.code, 'admin-role:1002');
            const [fixedDeleteResult, fixedDeleteError] = await catchError(() => {
              return app.bean.executor.performAction('delete', '/admin/role/:id', {
                params: { id: fixedRole.id },
              });
            });
            assert.equal(fixedDeleteResult, undefined);
            assert.equal(fixedDeleteError?.code, 'admin-role:1002');
          }

          const selected = await app.bean.executor.performAction('get', rolePath, {
            query: { where: { name: { _eq_: roleName } } },
          });
          assert.deepEqual(
            selected.list.map(item => item.id),
            [roleId],
          );
          assertRoleProjection(selected.list[0]);
          assert.deepEqual(selected.list[0].sites, [
            { siteId: 'web', title: 'Web' },
            { siteId: 'admin', title: 'Admin' },
          ]);
        } finally {
          await app.bean.passport.signout();
        }

        await app.bean.passport.signinSystem('mock', -10001 as any, ordinaryUser.name);
        try {
          const [forbiddenResult, forbiddenError] = await catchError(() => {
            return app.bean.executor.performAction('get', rolePath, { innerAccess: false });
          });
          assert.equal(forbiddenResult, undefined);
          assert.equal(forbiddenError?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            const localUser = await app.bean.user.register({
              name: `admin-role-scoped-${crypto.randomUUID()}`,
            });
            shareTestUserIds.push(String(localUser.id));
            const [viewResult, viewError] = await catchError(() => {
              return app.bean.executor.performAction('get', '/admin/role/:id', {
                params: { id: roleId },
              });
            });
            assert.equal(viewResult, undefined);
            assert.equal(viewError, undefined);

            const roles = await app.bean.executor.performAction('get', rolePath);
            assert.equal(
              roles.list.some(item => String(item.id) === String(roleId)),
              false,
            );
            for (const [method, path, body] of [
              ['patch', '/admin/role/:id', { name: 'foreign-role', title: 'Foreign update' }],
              ['delete', '/admin/role/:id', undefined],
            ] as const) {
              const [result, error] = await catchError(() => {
                return app.bean.executor.performAction(method, path, {
                  params: path.includes(':userId') ? { userId: localUser.id } : { id: roleId },
                  body,
                });
              });
              assert.equal(result, undefined);
              assert.equal(error?.code, 404);
            }
            const [replaceResult, replaceError] = await catchError(() => {
              return app.bean.executor.performAction('put', '/admin/role/user/:userId/roles', {
                params: { userId: localUser.id },
                body: { roleIds: [String(roleId)] },
              });
            });
            assert.equal(replaceResult, undefined);
            assert.equal(replaceError?.code, 'admin-role:1003');
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        const homeUser = app.scope('home-user');
        assert.equal(
          (await homeUser.model.role.getById(roleId!))?.title,
          'Updated admin role test',
        );
        assert.equal(
          await homeUser.model.roleUser.get({ userId: userIds[0], roleId: roleId! }),
          undefined,
        );
      });
    } finally {
      if (roleId) {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          const memberships = await homeUser.model.roleUser.select({ where: { roleId } });
          if (memberships.length) {
            await homeUser.model.roleUser.deleteBulk(memberships.map(item => item.id));
          }
          await homeUser.model.role.deleteById(roleId!);
        });
      }
      if (userIds.length) {
        await app.bean.executor.mockCtx(async () => {
          const homeUser = app.scope('home-user');
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) {
            await app.bean.user.removeById(userId);
          }
        });
      }
      if (shareTestUserIds.length) {
        await app.bean.executor.mockCtx(
          async () => {
            const homeUser = app.scope('home-user');
            await homeUser.model.roleUser.delete({ userId: { _in_: shareTestUserIds } });
            for (const userId of shareTestUserIds.reverse()) {
              await app.bean.user.removeById(userId);
            }
          },
          { instanceName: 'shareTest' as any },
        );
      }
    }
  });

  it('action:role:serializes competing role creation', async () => {
    const roleName = `admin-role-race-${crypto.randomUUID()}`;
    try {
      const results = await Promise.all([
        app.bean.executor.mockCtx(async () => {
          return await catchError(() => {
            return app.scope('admin-role').service.role.create({
              name: roleName,
              title: 'Competing role',
              siteIds: ['web'],
            });
          });
        }),
        app.bean.executor.mockCtx(async () => {
          return await catchError(() => {
            return app.scope('admin-role').service.role.create({
              name: roleName,
              title: 'Competing role',
              siteIds: ['web'],
            });
          });
        }),
      ]);
      assert.equal(results.filter(([role]) => role).length, 1);
      assert.equal(results.filter(([_, error]) => error?.code === 'admin-role:1001').length, 1);

      await app.bean.executor.mockCtx(async () => {
        const roles = await app.scope('home-user').model.role.select({
          where: { name: { _eqI_: roleName } },
        });
        assert.equal(roles.length, 1);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('home-user').model.role.get({ name: { _eqI_: roleName } });
        if (role) await app.scope('home-user').model.role.deleteById(role.id);
      });
    }
  });
});
