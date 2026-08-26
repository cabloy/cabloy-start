import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { app } from 'vona-mock';

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

describe('policyInvalidation.test.ts', { concurrency: false }, () => {
  it('event:policyInvalidated advances revision and clears projections only after commit', async () => {
    const instanceName = 'shareTest' as any;
    let revisionId: string | undefined;
    let existingRevision: number | undefined;
    let cacheClearCount = 0;
    const clearAllCaches = mock.method(app.bean.permission, 'clearAllCaches', async () => {
      cacheClearCount += 1;
    });
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const adminRbac = app.scope('admin-rbac');
          const existing = await adminRbac.model.policyRevision.get({});
          existingRevision = existing?.revision;
          const revision = adminRbac.service.rbacPolicyRevision;
          const before = Number(await revision.current());
          revisionId = String((await adminRbac.model.policyRevision.get({}))?.id);

          const [result, error] = await catchError(() =>
            app.bean.database.current.transaction.begin(async () => {
              await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
              throw new Error('rollback policy invalidation');
            }),
          );

          assert.equal(result, undefined);
          assert.equal(error?.message, 'rollback policy invalidation');
          assert.equal(Number(await revision.current()), before);
          assert.equal(cacheClearCount, 0);

          await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
          assert.equal(Number(await revision.current()), before + 1);
          assert.equal(cacheClearCount, 1);
        },
        { instanceName },
      );
    } finally {
      try {
        if (revisionId) {
          await app.bean.executor.mockCtx(
            async () => {
              const policyRevision = app.scope('admin-rbac').model.policyRevision;
              if (existingRevision === undefined) {
                await policyRevision.deleteById(revisionId!);
              } else {
                await policyRevision.updateById(revisionId!, {
                  revision: existingRevision,
                });
              }
            },
            { instanceName },
          );
        }
      } finally {
        clearAllCaches.mock.restore();
      }
    }
  });

  it('event:policyInvalidated advances revision for each PostgreSQL contender', async t => {
    const isPostgres = await app.bean.executor.mockCtx(async () => app.ctx.db.dialectName === 'pg');
    if (!isPostgres) {
      t.skip('PostgreSQL locking proof');
      return;
    }

    const instanceName = 'shareTest' as any;
    let revisionId: string | undefined;
    let existingRevision: number | undefined;
    let cacheClearCount = 0;
    const clearAllCaches = mock.method(app.bean.permission, 'clearAllCaches', async () => {
      cacheClearCount += 1;
    });
    try {
      await app.bean.executor.mockCtx(
        async () => {
          const adminRbac = app.scope('admin-rbac');
          const existing = await adminRbac.model.policyRevision.get({});
          existingRevision = existing?.revision;
          const revision = adminRbac.service.rbacPolicyRevision;
          await revision.current();
          revisionId = String((await adminRbac.model.policyRevision.get({}))?.id);
        },
        { instanceName },
      );
      assert.ok(revisionId);

      const start = createBarrier(2);
      const contender = () =>
        app.bean.executor.mockCtx(
          async () => {
            await start();
            await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
          },
          { instanceName },
        );
      await Promise.all([contender(), contender()]);

      await app.bean.executor.mockCtx(
        async () => {
          const revision = await app.scope('admin-rbac').model.policyRevision.getById(revisionId!);
          assert.equal(revision?.revision, (existingRevision ?? 0) + 2);
        },
        { instanceName },
      );
      assert.equal(cacheClearCount, 2);
    } finally {
      try {
        if (revisionId) {
          await app.bean.executor.mockCtx(
            async () => {
              const policyRevision = app.scope('admin-rbac').model.policyRevision;
              if (existingRevision === undefined) {
                await policyRevision.deleteById(revisionId!);
              } else {
                await policyRevision.updateById(revisionId!, {
                  revision: existingRevision,
                });
              }
            },
            { instanceName },
          );
        }
      } finally {
        clearAllCaches.mock.restore();
      }
    }
  });

  it('service:rbacPolicyRevision maintains state independently by instance', async () => {
    const instanceName = 'isolateTest' as any;
    let revisionId: string | undefined;
    let defaultRevisionId: string | undefined;
    let defaultRevisionExisted = false;
    let defaultRevision: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const adminRbac = app.scope('admin-rbac');
        const existing = await adminRbac.model.policyRevision.get({});
        defaultRevisionExisted = !!existing;
        defaultRevision = await adminRbac.service.rbacPolicyRevision.current();
        defaultRevisionId = String((await adminRbac.model.policyRevision.get({}))?.id);
      });
      await app.bean.executor.mockCtx(
        async () => {
          const adminRbac = app.scope('admin-rbac');
          const existing = await adminRbac.model.policyRevision.get({});
          assert.equal(existing, undefined);
          const revision = adminRbac.service.rbacPolicyRevision;
          const before = Number(await revision.current());
          revisionId = String((await adminRbac.model.policyRevision.get({}))?.id);
          assert.equal(await revision.invalidate(), String(before + 1));
        },
        { instanceName },
      );
      await app.bean.executor.mockCtx(async () => {
        const revision = app.scope('admin-rbac').service.rbacPolicyRevision;
        assert.equal(await revision.current(), defaultRevision);
      });
    } finally {
      if (revisionId) {
        await app.bean.executor.mockCtx(
          async () => {
            await app.scope('admin-rbac').model.policyRevision.deleteById(revisionId!);
          },
          { instanceName },
        );
      }
      if (defaultRevisionId && !defaultRevisionExisted) {
        await app.bean.executor.mockCtx(async () => {
          await app.scope('admin-rbac').model.policyRevision.deleteById(defaultRevisionId!);
        });
      }
    }
  });
});
