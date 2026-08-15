import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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

describe('departmentTree.test.ts', { concurrency: false }, () => {
  it('action:department:moveAndReorder', async () => {
    const ids: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        const first = await departmentService().create({
          name: `First-${crypto.randomUUID()}`,
          parentId: null,
        });
        const second = await departmentService().create({
          name: `Second-${crypto.randomUUID()}`,
          parentId: null,
        });
        const third = await departmentService().create({
          name: `Third-${crypto.randomUUID()}`,
          parentId: null,
        });
        const child = await departmentService().create({
          name: `Child-${crypto.randomUUID()}`,
          parentId: first.id,
        });
        const grandchild = await departmentService().create({
          name: `Grandchild-${crypto.randomUUID()}`,
          parentId: child.id,
        });
        ids.push(
          String(first.id),
          String(second.id),
          String(third.id),
          String(child.id),
          String(grandchild.id),
        );

        await departmentService().move(child.id, { parentId: second.id });
        const moved = await departmentService().view(child.id);
        assert.equal(String(moved?.parentId), String(second.id));

        await departmentService().reorder(third.id, { beforeId: first.id });
        const roots = await app.scope('admin-department').model.department.select({
          where: { parentId: null },
          orders: [
            ['sortOrder', 'asc'],
            ['id', 'asc'],
          ],
        });
        const testRoots = roots.filter(item => ids.includes(String(item.id)));
        assert.deepEqual(
          testRoots.map(item => String(item.id)),
          [String(third.id), String(first.id), String(second.id)],
        );
        assert.ok(
          testRoots.every((item, index) => index === 0 || item.sortOrder > testRoots[index - 1].sortOrder),
        );

        const [selfResult, selfError] = await catchError(() => {
          return departmentService().move(child.id, { parentId: child.id });
        });
        assert.equal(selfResult, undefined);
        assert.equal(selfError?.code, 'admin-department:1003');
        assert.equal(selfError?.status, 409);

        const [cycleResult, cycleError] = await catchError(() => {
          return departmentService().move(second.id, { parentId: grandchild.id });
        });
        assert.equal(cycleResult, undefined);
        assert.equal(cycleError?.code, 'admin-department:1003');
        assert.equal(cycleError?.status, 409);

        const [selfReorderResult, selfReorderError] = await catchError(() => {
          return departmentService().reorder(first.id, { beforeId: first.id });
        });
        assert.equal(selfReorderResult, undefined);
        assert.equal(selfReorderError?.code, 'admin-department:1004');
        assert.equal(selfReorderError?.status, 409);

        const [crossParentReorderResult, crossParentReorderError] = await catchError(() => {
          return departmentService().reorder(first.id, { beforeId: child.id });
        });
        assert.equal(crossParentReorderResult, undefined);
        assert.equal(crossParentReorderError?.code, 'admin-department:1004');
        assert.equal(crossParentReorderError?.status, 409);
      });
    } finally {
      await deleteDepartments(ids);
    }
  });
});
