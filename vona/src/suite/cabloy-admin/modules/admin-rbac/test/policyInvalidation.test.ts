import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { beanFullNameFromOnionName } from 'vona';
import { app } from 'vona-mock';

const primaryInstanceName = 'policyInvalidationTest' as const;
const peerInstanceName = 'policyInvalidationPeerTest' as const;
type PolicyInvalidationInstanceName = typeof primaryInstanceName | typeof peerInstanceName;

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

async function inRevisionInstance<T>(
  instanceName: PolicyInvalidationInstanceName,
  fn: () => Promise<T>,
): Promise<T> {
  return await app.bean.executor.mockCtx(fn, { instanceName });
}

async function withRevisionInstance<T>(
  instanceName: PolicyInvalidationInstanceName,
  fn: () => Promise<T>,
): Promise<T> {
  let revisionId: string | undefined;
  try {
    await inRevisionInstance(instanceName, async () => {
      const adminRbac = app.scope('admin-rbac');
      await adminRbac.service.rbacPolicyRevision.current();
      const revision = await adminRbac.model.policyRevision.get({});
      assert.ok(revision);
      revisionId = String(revision.id);
    });
    return await fn();
  } finally {
    if (revisionId) {
      await inRevisionInstance(instanceName, async () => {
        const revision = await app.scope('admin-rbac').model.policyRevision.getById(revisionId!);
        if (revision) await app.scope('admin-rbac').model.policyRevision.deleteById(revision.id);
      });
    }
  }
}

async function currentRevision(instanceName: PolicyInvalidationInstanceName): Promise<number> {
  return await inRevisionInstance(instanceName, async () =>
    Number(await app.scope('admin-rbac').service.rbacPolicyRevision.current()),
  );
}

describe('policyInvalidation.test.ts', { concurrency: false }, () => {
  it('event:policyInvalidated rolls back revision and clears permission caches only after commit', async () => {
    await withRevisionInstance(primaryInstanceName, async () => {
      await inRevisionInstance(primaryInstanceName, async () => {
        const revision = app.scope('admin-rbac').service.rbacPolicyRevision;
        const cache = app.bean.summer.cache(
          beanFullNameFromOnionName('a-permission:permissionUser', 'summerCache'),
        );
        const cacheKey = `policy-invalidation-${crypto.randomUUID()}`;
        const marker = { cacheKey };
        const cacheOptions = { mode: 'mem' as const };
        try {
          await cache.set(marker, cacheKey, cacheOptions);
          const before = Number(await revision.current());

          const [result, error] = await catchError(() =>
            app.bean.database.current.transaction.begin(async () => {
              await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
              assert.equal(Number(await revision.current()), before + 1);
              assert.deepEqual(await cache.peek(cacheKey, cacheOptions), marker);
              throw new Error('rollback policy invalidation');
            }),
          );

          assert.equal(result, undefined);
          assert.equal(error?.message, 'rollback policy invalidation');
          assert.equal(Number(await revision.current()), before);
          assert.deepEqual(await cache.peek(cacheKey, cacheOptions), marker);

          await app.bean.database.current.transaction.begin(async () => {
            await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
            assert.equal(Number(await revision.current()), before + 1);
            assert.deepEqual(await cache.peek(cacheKey, cacheOptions), marker);
          });

          assert.equal(Number(await revision.current()), before + 1);
          assert.equal(await cache.peek(cacheKey, cacheOptions), undefined);
        } finally {
          await cache.del(cacheKey, cacheOptions);
        }
      });
    });
  });

  it('event:roleMembershipChanged advances the isolated policy revision', async () => {
    await withRevisionInstance(primaryInstanceName, async () => {
      await inRevisionInstance(primaryInstanceName, async () => {
        const revision = app.scope('admin-rbac').service.rbacPolicyRevision;
        const before = Number(await revision.current());
        await app.scope('a-user').event.roleMembershipChanged.emit({
          userIds: ['membership-user'],
          roleIds: ['membership-role'],
        });
        assert.equal(Number(await revision.current()), before + 1);
      });
    });
  });

  it('event:policyInvalidated advances revision for each PostgreSQL contender', async t => {
    const isPostgres = await app.bean.executor.mockCtx(async () => app.ctx.db.dialectName === 'pg');
    if (!isPostgres) {
      t.skip('PostgreSQL locking proof');
      return;
    }

    await withRevisionInstance(primaryInstanceName, async () => {
      const before = await currentRevision(primaryInstanceName);
      const start = createBarrier(2);
      const contender = () =>
        inRevisionInstance(primaryInstanceName, async () => {
          await start();
          await app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
        });
      await Promise.all([contender(), contender()]);
      assert.equal(await currentRevision(primaryInstanceName), before + 2);
    });
  });

  it('service:rbacPolicyRevision maintains state independently by instance', async () => {
    await withRevisionInstance(primaryInstanceName, async () => {
      await withRevisionInstance(peerInstanceName, async () => {
        const primaryBefore = await currentRevision(primaryInstanceName);
        const peerBefore = await currentRevision(peerInstanceName);
        await inRevisionInstance(primaryInstanceName, async () => {
          const revision = app.scope('admin-rbac').service.rbacPolicyRevision;
          assert.equal(await revision.invalidate(), String(primaryBefore + 1));
        });
        assert.equal(await currentRevision(primaryInstanceName), primaryBefore + 1);
        assert.equal(await currentRevision(peerInstanceName), peerBefore);
      });
    });
  });
});
