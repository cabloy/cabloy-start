import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { appMetadata } from 'vona';
import { app } from 'vona-mock';
import { SymbolOpenApiOptions } from 'vona-module-a-openapiutils';
import { $locale as $localeRecord } from 'vona-module-training-record';

import {
  DtoRbacPolicyCatalogRes,
  DtoRbacPolicyCatalogResItem,
  DtoRbacPolicyRoleConfigurationAction,
  DtoRbacPolicyRoleConfigurationRes,
  DtoRbacPolicyRoleConfigurationScope,
} from '../src/index.ts';

const ActionKeyAll = 'test:policy#all';
const ActionKeyScoped = 'test:policy#scoped';
const ActionKeyAlias = 'test:policy#alias';
const ActionKeyIncompatible = 'test:policy#incompatible';
const ActionKeyInvalidField = 'test:policy#invalidField';

class TestPolicyController {}
class TestPolicyFallbackController {}

function defineOpenApiMetadata(
  controller: any,
  actionSummaries: Record<string, unknown>,
  controllerSummary?: unknown,
) {
  const controllerOptions = appMetadata.getOwnMetadataMap(
    false,
    SymbolOpenApiOptions,
    controller,
  ) as Record<string, unknown>;
  if (controllerSummary !== undefined) controllerOptions.summary = controllerSummary;
  for (const [action, summary] of Object.entries(actionSummaries)) {
    const actionOptions = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      controller.prototype,
      action,
    ) as Record<string, unknown>;
    actionOptions.summary = summary;
  }
}

defineOpenApiMetadata(
  TestPolicyController,
  {
    all: $localeRecord('RecordCreate'),
    scoped: $localeRecord('RecordView'),
  },
  $localeRecord('RecordController'),
);

function createCatalog() {
  return new Map([
    [
      ActionKeyAll,
      {
        actionKey: ActionKeyAll,
        controllerBeanFullName: 'test:policy',
        action: 'all',
        route: {
          controller: TestPolicyController,
          secretRouteValue: 'must not be exposed',
        },
        options: { secretOptionValue: 'must not be exposed' },
      },
    ],
    [
      ActionKeyScoped,
      {
        actionKey: ActionKeyScoped,
        controllerBeanFullName: 'test:policy',
        action: 'scoped',
        route: {
          controller: TestPolicyController,
          secretRouteValue: 'must not be exposed',
        },
        options: {
          dataScope: true,
          dataScopeField: 'departmentId',
          dataScopeMineField: 'userIdOwner',
        },
      },
    ],
    [
      ActionKeyAlias,
      {
        actionKey: ActionKeyAlias,
        actionInheritKey: ActionKeyScoped,
        controllerBeanFullName: 'test:policy',
        action: 'alias',
        route: {
          controller: TestPolicyController,
          secretRouteValue: 'must not be exposed',
        },
        options: {
          dataScope: true,
          dataScopeField: 'departmentId',
          dataScopeMineField: 'userIdOwner',
        },
      },
    ],
    [
      ActionKeyIncompatible,
      {
        actionKey: ActionKeyIncompatible,
        controllerBeanFullName: 'test:policy',
        action: 'incompatible',
        route: {
          controller: TestPolicyFallbackController,
          secretRouteValue: 'must not be exposed',
        },
        options: { dataScope: true, dataScopeField: 'departmentId' },
      },
    ],
    [
      'test:policy#incompatibleAlias',
      {
        actionKey: 'test:policy#incompatibleAlias',
        actionInheritKey: ActionKeyIncompatible,
        controllerBeanFullName: 'test:policy',
        action: 'incompatibleAlias',
        route: { secretRouteValue: 'must not be exposed' },
        options: { dataScope: true, dataScopeField: 'organizationId' },
      },
    ],
    [
      ActionKeyInvalidField,
      {
        actionKey: ActionKeyInvalidField,
        controllerBeanFullName: 'test:policy',
        action: 'invalidField',
        route: {
          controller: TestPolicyFallbackController,
          secretRouteValue: 'must not be exposed',
        },
        options: { dataScope: true, dataScopeField: 'department-id', dataScopeMineField: '' },
      },
    ],
  ]);
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

  it('action:rbacPolicy protects and safely projects the grantable catalog', async () => {
    const getCatalog = mock.method(app.bean.rbacCatalog, 'getCatalog', createCatalog);
    try {
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
            assert.equal(typeof result.revision, 'string');
            assert.deepEqual(result.list, [
              {
                controllerBeanFullName: 'test:policy',
                controllerSummary: 'Student Training Record Management',
                action: 'all',
                actionSummary: 'Create Student Training Record',
                actionKey: ActionKeyAll,
                dataScopes: ['all'],
              },
              {
                controllerBeanFullName: 'test:policy',
                action: 'invalidField',
                actionKey: ActionKeyInvalidField,
                dataScopes: ['all'],
              },
              {
                controllerBeanFullName: 'test:policy',
                controllerSummary: 'Student Training Record Management',
                action: 'scoped',
                actionSummary: 'View Student Training Record',
                actionKey: ActionKeyScoped,
                dataScopes: [
                  'all',
                  'customDepartments',
                  'ownDepartment',
                  'ownDepartmentAndDescendants',
                  'mine',
                ],
              },
            ]);
            const serialized = JSON.stringify(result);
            for (const forbidden of [
              'route',
              'options',
              'secretRouteValue',
              'secretOptionValue',
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
    } finally {
      getCatalog.mock.restore();
    }
  });

  it('service:rbacPolicyProjection resolves localized metadata per request locale', async () => {
    const getCatalog = mock.method(app.bean.rbacCatalog, 'getCatalog', createCatalog);
    try {
      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            const result = await app.bean.executor.performAction(
              'get',
              '/admin/rbac/rbacPolicy/catalog',
              { innerAccess: false },
            );
            assert.equal(result.list[0].controllerSummary, '学生培训记录管理');
            assert.equal(result.list[0].actionSummary, '创建学生培训记录');
            assert.equal(result.list[2].actionSummary, '查看学生培训记录');
          } finally {
            await app.bean.passport.signout();
          }
        },
        { locale: 'zh-cn' },
      );
    } finally {
      getCatalog.mock.restore();
    }
  });

  it('service:rbacPolicyProjection returns only role grant configuration', async () => {
    const roleName = `admin-rbac-policy-projection-${crypto.randomUUID()}`;
    const departmentName = `Admin RBAC projection department ${crypto.randomUUID()}`;
    const getCatalog = mock.method(app.bean.rbacCatalog, 'getCatalog', createCatalog);
    let roleId: string | undefined;
    let departmentId: string | undefined;
    let grantIds: string[] = [];
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
          actionKey: ActionKeyAll,
          dataScope: 'all',
          enabled: true,
          description: 'must not be exposed',
        });
        const grantScoped = await adminRbac.service.rbacGrant.create({
          roleId,
          actionKey: ActionKeyScoped,
          dataScope: 'customDepartments',
          enabled: true,
          description: 'must not be exposed',
        });
        const grantDisabled = await adminRbac.service.rbacGrant.create({
          roleId,
          actionKey: ActionKeyScoped,
          dataScope: 'mine',
          enabled: false,
          description: 'must not be exposed',
        });
        grantIds = [String(grantAll.id), String(grantScoped.id), String(grantDisabled.id)];
        await adminRbac.service.rbacGrantDepartment.create({
          rbacGrantId: grantScoped.id,
          departmentId: department.id,
        });

        const result = await adminRbac.service.rbacPolicyProjection.roleConfiguration(role.id);
        assert.equal(String(result.roleId), roleId);
        assert.equal(typeof result.revision, 'string');
        assert.deepEqual(result.list, [
          {
            actionKey: ActionKeyAll,
            dataScopes: [{ dataScope: 'all', enabled: true }],
          },
          {
            actionKey: ActionKeyScoped,
            dataScopes: [
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
          assert.deepEqual(externalResult, result);
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
      try {
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
            if (department) {
              await app.scope('admin-department').service.department.delete(department.id);
            }
          }
          if (roleId) {
            const role = await app.scope('home-user').model.role.getById(roleId);
            if (role) await app.scope('admin-role').service.role.delete(role.id);
          }
        });
      } finally {
        getCatalog.mock.restore();
      }
    }
  });
});
