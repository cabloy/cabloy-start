import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function departmentService() {
  return app.scope('admin-department').service.department;
}

function createBarrier(parties: number) {
  let arrived = 0;
  let release!: () => void;
  const open = new Promise<void>(resolve => {
    release = resolve;
  });
  return async () => {
    arrived += 1;
    if (arrived === parties) release();
    await open;
  };
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
  it('action:department:serializesMovesUnderPostgreSQLContention', async t => {
    const isPostgres = await app.bean.executor.mockCtx(async () => app.ctx.db.dialectName === 'pg');
    if (!isPostgres) {
      t.skip('PostgreSQL locking proof');
      return;
    }

    const ids: string[] = [];
    try {
      let sourceId: string | undefined;
      let destinationAId: string | undefined;
      let destinationBId: string | undefined;
      let childId: string | undefined;
      await app.bean.executor.mockCtx(async () => {
        const source = await departmentService().create({
          name: `Department-Race-Source-${crypto.randomUUID()}`,
          parentId: null,
        });
        const destinationA = await departmentService().create({
          name: `Department-Race-A-${crypto.randomUUID()}`,
          parentId: null,
        });
        const destinationB = await departmentService().create({
          name: `Department-Race-B-${crypto.randomUUID()}`,
          parentId: null,
        });
        const child = await departmentService().create({
          name: `Department-Race-Child-${crypto.randomUUID()}`,
          parentId: source.id,
        });
        sourceId = String(source.id);
        destinationAId = String(destinationA.id);
        destinationBId = String(destinationB.id);
        childId = String(child.id);
        ids.push(sourceId, destinationAId, destinationBId, childId);
      });

      assert.ok(sourceId);
      assert.ok(destinationAId);
      assert.ok(destinationBId);
      assert.ok(childId);
      const start = createBarrier(2);
      const results = await Promise.all([
        app.bean.executor.mockCtx(async () => {
          await start();
          return await catchError(() =>
            departmentService().move(childId!, { parentId: destinationAId! }),
          );
        }),
        app.bean.executor.mockCtx(async () => {
          await start();
          return await catchError(() =>
            departmentService().move(childId!, { parentId: destinationBId! }),
          );
        }),
      ]);
      assert.equal(
        results.filter(([_, error]) => error === undefined).length +
          results.filter(([_, error]) => error?.status === 409).length,
        2,
      );

      await app.bean.executor.mockCtx(async () => {
        const child = await departmentService().view(childId!);
        assert.ok(child);
        assert.ok([destinationAId, destinationBId].includes(String(child!.parentId)));
        const tree = await departmentService().tree();
        const parents = [destinationAId!, destinationBId!].flatMap(parentId => {
          const parent = tree.list.find(item => String(item.id) === parentId);
          return parent?.children.filter(item => String(item.id) === childId) ?? [];
        });
        assert.equal(parents.length, 1);
      });
    } finally {
      await deleteDepartments(ids);
    }
  });

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
          testRoots.every(
            (item, index) => index === 0 || item.sortOrder > testRoots[index - 1].sortOrder,
          ),
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
