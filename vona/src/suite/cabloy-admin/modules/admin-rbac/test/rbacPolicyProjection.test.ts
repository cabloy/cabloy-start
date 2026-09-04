import type { IRbacActionDescriptor } from 'vona-module-a-rbac';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import {
  DtoRbacPolicyCatalogRes,
  DtoRbacPolicyCatalogResItem,
  DtoRbacPolicyRoleConfigurationAction,
  DtoRbacPolicyRoleConfigurationRes,
  DtoRbacPolicyRoleConfigurationScope,
} from '../src/index.ts';
import { getRbacGrantablePolicyAction } from '../src/lib/rbacPolicy.ts';

const actionKey = 'training-record.controller.record#create';

function createAction(
  actionKey: string,
  options: Record<string, unknown>,
  actionInheritKey?: string,
): IRbacActionDescriptor {
  return {
    actionKey,
    ...(actionInheritKey ? { actionInheritKey } : {}),
    controllerBeanFullName: 'test:policy',
    action: actionKey.split('#')[1],
    options,
  } as IRbacActionDescriptor;
}

describe('rbacPolicyProjection.test.ts', { concurrency: false }, () => {
  it('dto:rbacPolicyProjection emits narrow metadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const DTOs = [
        DtoRbacPolicyCatalogRes,
        DtoRbacPolicyCatalogResItem,
        DtoRbacPolicyRoleConfigurationRes,
        DtoRbacPolicyRoleConfigurationAction,
        DtoRbacPolicyRoleConfigurationScope,
      ];
      for (const DtoClass of DTOs) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        assert.ok(apiJson.components?.schemas);
      }

      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoRbacPolicyCatalogResItem);
      const component = Object.values(apiJson.components!.schemas as any).find(item => {
        return (item as any).properties?.actionKey && (item as any).properties?.dataScopes;
      }) as any;
      assert.ok(component);
      assert.deepEqual(Object.keys(component.properties).sort(), [
        'action',
        'actionKey',
        'actionSummary',
        'controllerBeanFullName',
        'controllerSummary',
        'dataScopes',
      ]);
    });
  });

  it('lib:rbacPolicy accepts compatible action metadata only', () => {
    const scopedKey = 'test:policy#scoped';
    const compatibleAliasKey = 'test:policy#compatibleAlias';
    const incompatibleAliasKey = 'test:policy#incompatibleAlias';
    const invalidFieldKey = 'test:policy#invalidField';
    const catalog = new Map<string, IRbacActionDescriptor>([
      [
        scopedKey,
        createAction(scopedKey, {
          dataScope: true,
          dataScopeField: 'departmentId',
          dataScopeMineField: 'userIdOwner',
        }),
      ],
      [
        compatibleAliasKey,
        createAction(
          compatibleAliasKey,
          {
            dataScope: true,
            dataScopeField: 'departmentId',
            dataScopeMineField: 'userIdOwner',
          },
          scopedKey,
        ),
      ],
      [
        incompatibleAliasKey,
        createAction(
          incompatibleAliasKey,
          { dataScope: true, dataScopeField: 'organizationId' },
          scopedKey,
        ),
      ],
      [
        invalidFieldKey,
        createAction(invalidFieldKey, {
          dataScope: true,
          dataScopeField: 'department-id',
          dataScopeMineField: '',
        }),
      ],
    ]);

    assert.equal(getRbacGrantablePolicyAction(catalog, scopedKey), undefined);
    assert.deepEqual(getRbacGrantablePolicyAction(catalog, invalidFieldKey)?.dataScopes, ['all']);

    catalog.delete(incompatibleAliasKey);
    assert.deepEqual(getRbacGrantablePolicyAction(catalog, scopedKey)?.dataScopes, [
      'all',
      'customDepartments',
      'ownDepartment',
      'ownDepartmentAndDescendants',
      'mine',
    ]);
  });

  it('action:rbacPolicy protects and safely projects the registered grantable catalog', async () => {
    await app.bean.executor.mockCtx(async () => {
      const [result, error] = await catchError(() =>
        app.bean.executor.performAction('get', '/admin/rbac/rbacPolicy/catalog', {
          innerAccess: false,
        }),
      );
      assert.equal(result, undefined);
      assert.equal(error?.code, 401);
    });

    await app.bean.executor.mockCtx(
      async () => {
        await app.bean.passport.signinMock();
        try {
          const result = await app.bean.executor.performAction(
            'get',
            '/admin/rbac/rbacPolicy/catalog',
            { innerAccess: false },
          );
          assert.match(result.revision, /^\d+$/);
          const action = result.list.find(item => item.actionKey === actionKey);
          assert.deepEqual(action, {
            controllerBeanFullName: 'training-record.controller.record',
            controllerSummary: 'Student Training Record Management',
            action: 'create',
            actionSummary: 'Create Student Training Record',
            actionKey,
            dataScopes: [
              'all',
              'customDepartments',
              'ownDepartment',
              'ownDepartmentAndDescendants',
              'mine',
            ],
          });
          const serialized = JSON.stringify(result);
          for (const forbidden of [
            'route',
            'options',
            'dataScopeField',
            'dataScopeMineField',
            'actionInherit',
          ]) {
            assert.equal(serialized.includes(forbidden), false, forbidden);
          }
        } finally {
          await app.bean.passport.signout();
        }
      },
      { locale: 'en-us' },
    );
  });

  it('service:rbacPolicyProjection resolves registered metadata per request locale', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        await app.bean.passport.signinMock();
        try {
          const result = await app.bean.executor.performAction(
            'get',
            '/admin/rbac/rbacPolicy/catalog',
            { innerAccess: false },
          );
          const action = result.list.find(item => item.actionKey === actionKey);
          assert.equal(action?.controllerSummary, '学生培训记录管理');
          assert.equal(action?.actionSummary, '创建学生培训记录');
        } finally {
          await app.bean.passport.signout();
        }
      },
      { locale: 'zh-cn' },
    );
  });

  it('service:rbacPolicyProjection returns only role grant configuration', async () => {
    const roleName = `admin-rbac-policy-projection-${crypto.randomUUID()}`;
    const departmentName = `Admin RBAC projection department ${crypto.randomUUID()}`;
    let roleId: string | undefined;
    let departmentId: string | undefined;
    const grantIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const role = await app.scope('admin-role').service.role.create({
          name: roleName,
          title: 'RBAC policy projection fixture',
          siteIds: ['admin'],
        });
        roleId = String(role.id);
        const department = await app.scope('admin-department').service.department.create({
          name: departmentName,
          parentId: null,
        });
        departmentId = String(department.id);

        const adminRbac = app.scope('admin-rbac');
        const grantAll = await adminRbac.service.rbacGrant.create({
          roleId,
          actionKey,
          dataScope: 'all',
          enabled: true,
          description: 'must not be exposed',
        });
        const grantScoped = await adminRbac.service.rbacGrant.create({
          roleId,
          actionKey,
          dataScope: 'customDepartments',
          enabled: true,
          description: 'must not be exposed',
        });
        const grantDisabled = await adminRbac.service.rbacGrant.create({
          roleId,
          actionKey,
          dataScope: 'mine',
          enabled: false,
          description: 'must not be exposed',
        });
        grantIds.push(String(grantAll.id), String(grantScoped.id), String(grantDisabled.id));
        await adminRbac.service.rbacGrantDepartment.create({
          rbacGrantId: grantScoped.id,
          departmentId: department.id,
        });

        const result = await adminRbac.service.rbacPolicyProjection.roleConfiguration(role.id);
        assert.equal(String(result.roleId), roleId);
        assert.match(result.revision, /^\d+$/);
        assert.deepEqual(result.list, [
          {
            actionKey,
            dataScopes: [
              { dataScope: 'all', enabled: true },
              { dataScope: 'customDepartments', enabled: true, customDepartmentsConfigured: true },
              { dataScope: 'mine', enabled: false },
            ],
          },
        ]);
        await app.bean.passport.signinMock();
        try {
          const externalResult = await app.bean.executor.performAction(
            'get',
            '/admin/rbac/rbacPolicy/roles/:roleId/configuration',
            {
              innerAccess: false,
              params: { roleId: role.id },
            },
          );
          assert.equal(String(externalResult.roleId), roleId);
          assert.match(externalResult.revision, /^\d+$/);
          assert.deepEqual(externalResult.list, result.list);
        } finally {
          await app.bean.passport.signout();
        }

        const serialized = JSON.stringify(result);
        for (const forbidden of [
          'description',
          'departmentId',
          departmentId,
          'ownerId',
          'terms',
          'allowed',
          'predicate',
        ]) {
          assert.equal(serialized.includes(forbidden), false, forbidden);
        }

        const systemAdmin = await app.scope('home-user').model.role.get({
          where: { name: 'systemAdmin' },
        });
        assert.ok(systemAdmin);
        const [systemAdminResult, systemAdminError] = await catchError(() =>
          adminRbac.service.rbacPolicyProjection.roleConfiguration(systemAdmin.id),
        );
        assert.equal(systemAdminResult, undefined);
        assert.equal(systemAdminError?.code, 422);
        const [missingResult, missingError] = await catchError(() =>
          adminRbac.service.rbacPolicyProjection.roleConfiguration('999999'),
        );
        assert.equal(missingResult, undefined);
        assert.equal(missingError?.code, 422);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRbac = app.scope('admin-rbac');
        for (const grantId of grantIds.toReversed()) {
          const grant = await adminRbac.model.rbacGrant.getById(grantId);
          if (grant) await adminRbac.service.rbacGrant.delete(grant.id);
        }
        if (departmentId) {
          const department = await app
            .scope('admin-department')
            .model.department.getById(departmentId);
          if (department)
            await app.scope('admin-department').service.department.delete(department.id);
        }
        if (roleId) {
          const role = await app.scope('home-user').model.role.getById(roleId);
          if (role) await app.scope('admin-role').service.role.delete(role.id);
        }
      });
    }
  });
});
