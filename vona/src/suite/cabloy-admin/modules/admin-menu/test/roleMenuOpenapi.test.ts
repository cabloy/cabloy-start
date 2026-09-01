import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('roleMenuOpenapi.test.ts', () => {
  it('emits only the protected role-menu configuration contract', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'admin-menu.controller.roleMenu')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('admin-menu.controller.roleMenu not found');

      const expectations = [
        {
          action: 'catalog',
          method: 'get',
          path: '/api/admin/menu/roleMenu/catalog',
          response: 'admin-menu.dto.roleMenuCatalogRes',
        },
        {
          action: 'roleConfiguration',
          method: 'get',
          path: '/api/admin/menu/roleMenu/roles/{roleId}/configuration',
          response: 'admin-menu.dto.roleMenuRoleConfigurationRes',
        },
        {
          action: 'create',
          method: 'post',
          path: '/api/admin/menu/roleMenu',
          request: 'admin-menu.dto.roleMenuCreate',
        },
        {
          action: 'batch',
          method: 'put',
          path: '/api/admin/menu/roleMenu/batch',
          request: 'admin-menu.dto.roleMenuBatch',
        },
        {
          action: 'delete',
          method: 'delete',
          path: '/api/admin/menu/roleMenu',
          request: 'admin-menu.dto.roleMenuDelete',
        },
      ] as const;

      const contractDocs = new Map<string, any>();
      for (const expectation of expectations) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          controller,
          expectation.action,
          'V31',
        );
        contractDocs.set(expectation.action, doc);
        const operation = doc.paths?.[expectation.path]?.[expectation.method];
        assert.ok(operation);
        assert.equal(operation.operationId, `AdminMenuRoleMenu_${expectation.action}`);
        assert.deepEqual(operation.tags, ['AdminMenuRoleMenu']);
        assert.ok(operation.security);

        if (expectation.request) {
          const schema = (
            operation.requestBody as { content?: { 'application/json'?: { schema?: any } } }
          ).content?.['application/json']?.schema;
          assert.equal(schema?.$ref, `#/components/schemas/${expectation.request}`);
        }
        if (expectation.response) {
          const schema = operation.responses?.['200']?.content?.['application/json']?.schema;
          assert.equal(
            schema?.properties?.data?.$ref,
            `#/components/schemas/${expectation.response}`,
          );
        }
      }

      const catalogDoc = contractDocs.get('catalog');
      const roleConfigurationDoc = contractDocs.get('roleConfiguration');
      const batchDoc = contractDocs.get('batch');
      const batch = docSchema(batchDoc, 'admin-menu.dto.roleMenuBatch');
      assert.deepEqual(Object.keys(batch.properties ?? {}), ['roleId', 'creates', 'deletes']);
      const batchItem = docSchema(batchDoc, 'admin-menu.dto.roleMenuBatchItem');
      assert.deepEqual(Object.keys(batchItem.properties ?? {}), ['ssrSiteName', 'ssrMenuName']);
      const catalogMenu = docSchema(catalogDoc, 'admin-menu.dto.roleMenuCatalogMenu');
      assert.deepEqual(Object.keys(catalogMenu.properties ?? {}), [
        'ssrMenuName',
        'onionName',
        'configurable',
        'title',
        'description',
        'icon',
        'order',
        'group',
        'separator',
      ]);
      const roleConfigurationMenu = docSchema(
        roleConfigurationDoc,
        'admin-menu.dto.roleMenuRoleConfigurationMenu',
      );
      assert.deepEqual(Object.keys(roleConfigurationMenu.properties ?? {}), [
        'ssrMenuName',
        'onionName',
        'configurable',
        'enabled',
        'title',
        'description',
        'icon',
        'order',
        'group',
        'separator',
      ]);

      for (const schema of [catalogMenu, roleConfigurationMenu]) {
        for (const forbidden of ['roles', 'link', 'meta', 'passport', 'actionKey']) {
          assert.equal(Object.hasOwn(schema.properties ?? {}, forbidden), false, forbidden);
        }
      }
    });
  });
});

function docSchema(doc: any, name: string) {
  const schema = doc.components?.schemas?.[name];
  assert.ok(schema, name);
  return schema;
}
