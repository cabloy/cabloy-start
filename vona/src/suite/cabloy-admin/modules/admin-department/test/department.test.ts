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
