import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import { DtoDepartmentCreate, DtoDepartmentUpdate } from '../src/index.ts';

const departmentPath = '/admin/department';

function departmentService() {
  return app.scope('admin-department').service.department;
}

async function deleteDepartments(ids: string[]) {
  await app.bean.executor.mockCtx(async () => {
    for (const id of ids.toReversed()) {
      const item = await departmentService().view(id);
      if (item) await departmentService().delete(id);
    }
  });
}

describe('department.test.ts', { concurrency: false }, () => {
  it('action:department:resourceMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const DtoClass of [DtoDepartmentCreate, DtoDepartmentUpdate]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        assert.ok(apiJson.components?.schemas);
      }
    });
  });

  it('action:department:resourceBoundaries', async () => {
    const ids: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const name = `Department-${crypto.randomUUID()}`;
        const [unauthenticatedResult, unauthenticatedError] = await catchError(() => {
          return app.bean.executor.performAction('post', departmentPath, {
            innerAccess: false,
            body: { name, parentId: null },
          });
        });
        assert.equal(unauthenticatedResult, undefined);
        assert.equal(unauthenticatedError?.code, 401);

        await app.bean.passport.signinMock();
        const root = await app.bean.executor.performAction('post', departmentPath, {
          body: { name, parentId: null },
        });
        ids.push(String(root));

        const child = await app.bean.executor.performAction('post', departmentPath, {
          body: { name: `Child-${crypto.randomUUID()}`, parentId: root },
        });
        ids.push(String(child));
        const view = await departmentService().view(child);
        assert.ok(view);
        assert.equal(String(view!.parentId), String(root));
        assert.notEqual(view!.parentId, 0);

        const [duplicateResult, duplicateError] = await catchError(() => {
          return app.bean.executor.performAction('post', departmentPath, {
            body: { name: name.toUpperCase(), parentId: null },
          });
        });
        assert.equal(duplicateResult, undefined);
        assert.equal(duplicateError?.code, 'admin-department:1001');
        assert.equal(duplicateError?.status, 409);

        const [invalidParentResult, invalidParentError] = await catchError(() => {
          return app.bean.executor.performAction('post', departmentPath, {
            body: { name: `Invalid-${crypto.randomUUID()}`, parentId: 0 },
          });
        });
        assert.equal(invalidParentResult, undefined);
        assert.equal(invalidParentError?.code, 'admin-department:1002');
        assert.equal(invalidParentError?.status, 409);

        const updateResult = await app.bean.executor.performAction(
          'patch',
          '/admin/department/:id',
          {
            params: { id: root },
            body: {
              id: 'must-not-be-updated',
              iid: -1,
              deleted: true,
              parentId: child,
              enabled: false,
              sortOrder: -1,
              managerMembershipId: 'must-not-be-updated',
              name: `Renamed-${crypto.randomUUID()}`,
            },
          },
        );
        assert.equal(updateResult, null);
        const updated = await departmentService().view(root);
        assert.ok(updated);
        assert.equal(updated!.parentId, null);
        assert.equal(updated!.enabled, true);
      });
    } finally {
      await deleteDepartments(ids);
    }
  });

  it('action:department:selectNestedWhere', async () => {
    const ids: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        const parentA = await departmentService().create({
          name: `Parent-A-${crypto.randomUUID()}`,
          parentId: null,
        });
        const parentB = await departmentService().create({
          name: `Parent-B-${crypto.randomUUID()}`,
          parentId: null,
        });
        const childA = await departmentService().create({
          name: `Child-A-${crypto.randomUUID()}`,
          parentId: parentA.id,
        });
        const childB = await departmentService().create({
          name: `Child-B-${crypto.randomUUID()}`,
          parentId: parentB.id,
        });
        ids.push(String(parentA.id), String(parentB.id), String(childA.id), String(childB.id));

        const responseA = await app.bean.executor.performAction('get', '/admin/department', {
          query: { where: { parentId: parentA.id }, pageNo: 1, pageSize: 20 },
        });
        assert.deepEqual(
          responseA.list.map(item => String(item.id)),
          [String(childA.id)],
        );

        const responseB = await app.bean.executor.performAction('get', '/admin/department', {
          query: { where: { parentId: parentB.id }, pageNo: 1, pageSize: 20 },
        });
        assert.deepEqual(
          responseB.list.map(item => String(item.id)),
          [String(childB.id)],
        );
      });
    } finally {
      await deleteDepartments(ids);
    }
  });

  it('action:department:tree', async () => {
    const ids: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const [unauthenticatedResult, unauthenticatedError] = await catchError(() => {
          return app.bean.executor.performAction('get', '/admin/department/tree', {
            innerAccess: false,
          });
        });
        assert.equal(unauthenticatedResult, undefined);
        assert.equal(unauthenticatedError?.code, 401);

        await app.bean.passport.signinMock();
        const rootA = await departmentService().create({
          name: `Root-A-${crypto.randomUUID()}`,
          parentId: null,
        });
        const rootB = await departmentService().create({
          name: `Root-B-${crypto.randomUUID()}`,
          parentId: null,
        });
        const child = await departmentService().create({
          name: `Child-${crypto.randomUUID()}`,
          parentId: rootA.id,
        });
        const leaf = await departmentService().create({
          name: `Leaf-${crypto.randomUUID()}`,
          parentId: child.id,
        });
        ids.push(String(rootA.id), String(rootB.id), String(child.id), String(leaf.id));

        const response = await app.bean.executor.performAction('get', '/admin/department/tree', {
          innerAccess: false,
        });
        assert.equal(response.list.length >= 2, true);
        const foundRoot = response.list.find(item => String(item.id) === String(rootA.id));
        assert.ok(foundRoot);
        assert.equal(foundRoot.children.length, 1);
        assert.equal(String(foundRoot.children[0].id), String(child.id));
        assert.equal(foundRoot.children[0].children.length, 1);
        assert.equal(String(foundRoot.children[0].children[0].id), String(leaf.id));
        assert.deepEqual(foundRoot.children[0].children[0].children, []);
      });
    } finally {
      await deleteDepartments(ids);
    }
  });

  it('action:department:guardsLifecycleChanges', async () => {
    const ids: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        const root = await departmentService().create({
          name: `Root-${crypto.randomUUID()}`,
          parentId: null,
        });
        const child = await departmentService().create({
          name: `Child-${crypto.randomUUID()}`,
          parentId: root.id,
        });
        ids.push(String(root.id), String(child.id));

        const [deactivateResult, deactivateError] = await catchError(() => {
          return app.bean.executor.performAction('put', '/admin/department/:id/activation', {
            params: { id: root.id },
            body: { enabled: false },
          });
        });
        assert.equal(deactivateResult, undefined);
        assert.equal(deactivateError?.code, 'admin-department:1005');
        assert.equal(deactivateError?.status, 409);

        const [deleteResult, deleteError] = await catchError(() => {
          return app.bean.executor.performAction('delete', '/admin/department/:id', {
            params: { id: root.id },
          });
        });
        assert.equal(deleteResult, undefined);
        assert.equal(deleteError?.code, 'admin-department:1005');
        assert.equal(deleteError?.status, 409);
      });
    } finally {
      await deleteDepartments(ids);
    }
  });
});
