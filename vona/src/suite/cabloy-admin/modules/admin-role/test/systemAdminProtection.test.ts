import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const freshProofPath = '/admin/role/system-admin/fresh-proof';

async function issueFreshProof() {
  return await app.bean.executor.performAction('post', freshProofPath, {
    body: { password: '123456' },
  });
}

async function protectedCommand(
  path: string,
  userId: string,
  proof: string,
  reason = 'Phase 40 protection test',
) {
  return await app.bean.executor.performAction('post', path, {
    params: { userId },
    body: { freshProof: proof, reason },
  });
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

describe('systemAdminProtection.test.ts', { concurrency: false }, () => {
  it('action:systemAdmin:requires and consumes fresh proof', async () => {
    const userIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const target = await app.bean.user.register({
          name: `admin-system-admin-target-${crypto.randomUUID()}`,
        });
        userIds.push(target.id as string);
        await app.bean.user.activate(target);

        await app.bean.passport.signinMock();
        try {
          const [missingProofResult, missingProofError] = await catchError(() => {
            return protectedCommand('/admin/role/system-admin/grant/:userId', target.id as string, 'missing');
          });
          assert.equal(missingProofResult, undefined);
          assert.equal(missingProofError?.code, 'admin-role:1004');

          const freshProof = await issueFreshProof();
          assert.equal(typeof freshProof.proof, 'string');
          assert.ok(freshProof.expiresAt);

          assert.equal(
            await protectedCommand(
              '/admin/role/system-admin/grant/:userId',
              target.id as string,
              freshProof.proof,
            ),
            null,
          );
          const homeUser = app.scope('home-user');
          const role = await homeUser.model.role.get({ name: 'systemAdmin' });
          assert.ok(role);
          assert.ok(
            await homeUser.model.roleUser.get({ userId: target.id, roleId: role.id }),
          );

          const [replayedProofResult, replayedProofError] = await catchError(() => {
            return protectedCommand(
              '/admin/role/system-admin/revoke/:userId',
              target.id as string,
              freshProof.proof,
            );
          });
          assert.equal(replayedProofResult, undefined);
          assert.equal(replayedProofError?.code, 'admin-role:1004');

          const audits = await app.scope('admin-role').model.systemAdminAudit.select({
            where: { targetId: target.id },
          });
          assert.equal(audits.filter(item => item.result === 'accepted').length, 1);
          assert.equal(audits.filter(item => item.result === 'rejected').length, 2);
          assert.ok(audits.every(item => item.proofMethod === 'auth-simple:password'));
          assert.ok(audits.every(item => !JSON.stringify(item).includes(freshProof.proof)));
          assert.equal(audits.find(item => item.result === 'accepted')?.reason, 'Phase 40 protection test');
          const evictions = await app.scope('admin-role').model.systemAdminSessionEviction.select({
            where: { targetId: target.id },
          });
          assert.equal(evictions.length, 1);
          assert.equal(evictions[0].state, 'pending');

          const invalidReasonProof = await issueFreshProof();
          const [invalidReasonResult, invalidReasonError] = await catchError(() => {
            return protectedCommand(
              '/admin/role/system-admin/revoke/:userId',
              target.id as string,
              invalidReasonProof.proof,
              '   ',
            );
          });
          assert.equal(invalidReasonResult, undefined);
          assert.equal(invalidReasonError?.code, 'admin-role:1008');
          assert.equal(invalidReasonError?.status, 422);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        if (userIds.length) {
          await adminRole.model.systemAdminSessionEviction.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminAudit.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminFreshProof.delete({ actorId: { _in_: userIds } });
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) {
            await app.bean.user.removeById(userId);
          }
        }
      });
    }
  });

  it('service:systemAdmin:recovers durable session-eviction work', async () => {
    const userIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const target = await app.bean.user.register({
          name: `admin-system-admin-eviction-${crypto.randomUUID()}`,
        });
        userIds.push(target.id as string);
        await app.bean.user.activate(target);
        await app.bean.passport.signinMock();
        try {
          const proof = await issueFreshProof();
          await protectedCommand(
            '/admin/role/system-admin/grant/:userId',
            target.id as string,
            proof.proof,
            'Create durable eviction work',
          );

          const adminRole = app.scope('admin-role');
          const service = adminRole.service.systemAdminSessionEviction;
          const [eviction] = await adminRole.model.systemAdminSessionEviction.select({
            where: { targetId: target.id },
          });
          assert.ok(eviction);
          assert.equal(eviction.state, 'pending');

          await adminRole.queue.systemAdminSessionEviction.pushAsync({ evictionId: eviction.id });
          let current = await adminRole.model.systemAdminSessionEviction.getById(eviction.id);
          assert.equal(current?.state, 'dispatched');
          assert.ok(current?.dispatchedAt);

          const retryable = await service.enqueue(target.id, eviction.auditId);
          const firstClaim = await service.claim(retryable.id);
          assert.ok(firstClaim?.claimToken);
          assert.equal(firstClaim.attemptCount, 1);
          assert.equal(await service.claim(retryable.id), undefined);

          await service.release(retryable.id, firstClaim.claimToken!, new Error('sensitive failure detail'));
          current = await adminRole.model.systemAdminSessionEviction.getById(retryable.id);
          assert.equal(current?.state, 'pending');
          assert.equal(current?.errorSummary, 'session eviction failed');
          assert.ok(current?.nextAttemptAt && current.nextAttemptAt > new Date());

          await adminRole.model.systemAdminSessionEviction.updateById(retryable.id, {
            state: 'claimed',
            claimExpiresAt: new Date(Date.now() - 1_000),
          });
          const recoveredClaim = await service.claim(retryable.id);
          assert.ok(recoveredClaim?.claimToken);
          assert.equal(recoveredClaim.attemptCount, 2);
          await service.markDispatched(retryable.id, recoveredClaim.claimToken!);
          current = await adminRole.model.systemAdminSessionEviction.getById(retryable.id);
          assert.equal(current?.state, 'dispatched');
          assert.ok(current?.dispatchedAt);

          const terminal = await service.enqueue(target.id, eviction.auditId);
          await adminRole.model.systemAdminSessionEviction.updateById(terminal.id, {
            attemptCount: 9,
            nextAttemptAt: new Date(Date.now() - 1_000),
          });
          const terminalClaim = await service.claim(terminal.id);
          assert.ok(terminalClaim?.claimToken);
          assert.equal(terminalClaim.attemptCount, 10);
          await service.release(terminal.id, terminalClaim.claimToken!, new Error('retry exhausted'));
          current = await adminRole.model.systemAdminSessionEviction.getById(terminal.id);
          assert.equal(current?.state, 'failed');
          assert.equal(current?.errorSummary, 'session eviction failed');
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        if (userIds.length) {
          await adminRole.model.systemAdminSessionEviction.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminAudit.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminFreshProof.delete({ actorId: { _in_: userIds } });
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('action:systemAdmin:protects account status and activation commands', async () => {
    const userIds: string[] = [];
    try {
      await app.bean.executor.mockCtx(async () => {
        const target = await app.bean.user.register({
          name: `admin-system-admin-lifecycle-${crypto.randomUUID()}`,
        });
        userIds.push(target.id as string);
        await app.bean.user.activate(target);
        await app.bean.passport.signinMock();
        try {
          let proof = await issueFreshProof();
          assert.equal(
            await protectedCommand(
              '/admin/role/system-admin/grant/:userId',
              target.id as string,
              proof.proof,
            ),
            null,
          );

          proof = await issueFreshProof();
          assert.equal(
            await app.bean.executor.performAction('put', '/admin/role/system-admin/account-status/:userId', {
              params: { userId: target.id },
              body: {
                accountStatus: 'disabled',
                reason: 'Disable protected lifecycle target',
                freshProof: proof.proof,
              },
            }),
            null,
          );
          let current = await app.scope('home-user').model.user.getById(target.id);
          assert.equal(current?.accountStatus, 'disabled');

          proof = await issueFreshProof();
          assert.equal(
            await app.bean.executor.performAction('put', '/admin/role/system-admin/account-status/:userId', {
              params: { userId: target.id },
              body: {
                accountStatus: 'active',
                reason: 'Restore protected lifecycle target',
                freshProof: proof.proof,
              },
            }),
            null,
          );

          proof = await issueFreshProof();
          assert.equal(
            await app.bean.executor.performAction('put', '/admin/role/system-admin/activation/:userId', {
              params: { userId: target.id },
              body: { activated: false, reason: 'Deactivate protected lifecycle target', freshProof: proof.proof },
            }),
            null,
          );
          current = await app.scope('home-user').model.user.getById(target.id);
          assert.equal(current?.activated, false);

          proof = await issueFreshProof();
          assert.equal(
            await app.bean.executor.performAction('put', '/admin/role/system-admin/activation/:userId', {
              params: { userId: target.id },
              body: { activated: true, reason: 'Activate protected lifecycle target', freshProof: proof.proof },
            }),
            null,
          );
          current = await app.scope('home-user').model.user.getById(target.id);
          assert.equal(current?.activated, true);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        if (userIds.length) {
          await adminRole.model.systemAdminSessionEviction.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminAudit.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminFreshProof.delete({ actorId: { _in_: userIds } });
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('action:systemAdmin:rolls back rejected protected mutations and retains audit evidence', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const admin = await app.bean.user.findOneByName('admin');
        assert.ok(admin);
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        const role = await homeUser.model.role.get({ name: 'systemAdmin' });
        assert.ok(role);
        const before = await homeUser.model.user.getById(admin.id);
        assert.ok(before);

        const proof = await issueFreshProof();
        const [result, error] = await catchError(() => {
          return app.bean.executor.performAction('put', '/admin/role/system-admin/activation/:userId', {
            params: { userId: admin.id },
            body: {
              activated: false,
              reason: 'Verify rejected authority-loss rollback',
              freshProof: proof.proof,
            },
          });
        });
        assert.equal(result, undefined);
        assert.equal(error?.code, 'admin-role:1006');

        const after = await homeUser.model.user.getById(admin.id);
        assert.equal(after?.activated, before.activated);
        assert.equal(after?.accountStatus, before.accountStatus);
        assert.ok(await homeUser.model.roleUser.get({ userId: admin.id, roleId: role.id }));

        const rejectedAudits = await adminRole.model.systemAdminAudit.select({
          where: {
            targetId: admin.id,
            command: 'deactivate',
            result: 'rejected',
            reason: 'Verify rejected authority-loss rollback',
          },
          orders: [['id', 'desc']],
          limit: 1,
        });
        assert.equal(rejectedAudits.length, 1);
        assert.equal(rejectedAudits[0].beforeState?.activated, true);
        assert.deepEqual(rejectedAudits[0].beforeState, rejectedAudits[0].afterState);
        assert.equal(
          (await adminRole.model.systemAdminSessionEviction.select({
            where: { auditId: rejectedAudits[0].id },
          })).length,
          0,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:systemAdmin:preserves an administrator under PostgreSQL contention', async t => {
    const isPostgres = await app.bean.executor.mockCtx(async () => app.ctx.db.dialectName === 'pg');
    if (!isPostgres) {
      t.skip('PostgreSQL locking proof');
      return;
    }

    const userIds: string[] = [];
    let defaultAdminId: string | undefined;
    let systemAdminRoleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const defaultAdmin = await app.bean.user.findOneByName('admin');
        assert.ok(defaultAdmin);
        defaultAdminId = defaultAdmin.id as string;
        const systemAdminRole = await app.scope('home-user').model.role.get({ name: 'systemAdmin' });
        assert.ok(systemAdminRole);
        systemAdminRoleId = systemAdminRole.id as string;
        const target = await app.bean.user.register({
          name: `admin-system-admin-race-target-${crypto.randomUUID()}`,
        });
        userIds.push(target.id as string);
        await app.bean.user.activate(target);
        await app.scope('home-user').model.roleUser.insert({
          userId: target.id,
          roleId: systemAdminRole.id,
        });
      });

      const start = createBarrier(2);
      const results = await Promise.all(
        Array.from({ length: 2 }, () => {
          return app.bean.executor.mockCtx(async () => {
            await app.bean.passport.signinMock();
            try {
              const proof = await issueFreshProof();
              await start();
              return await catchError(() => {
                return protectedCommand(
                  '/admin/role/system-admin/revoke/:userId',
                  userIds[0],
                  proof.proof,
                  'Competing PostgreSQL authority reduction',
                );
              });
            } finally {
              await app.bean.passport.signout();
            }
          });
        }),
      );
      assert.equal(results.filter(([result]) => result === null).length, 1);
      assert.equal(
        results.filter(([_, error]) => error?.code === 'admin-role:1005' && error.status === 409).length,
        1,
      );

      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        const role = await homeUser.model.role.get({ name: 'systemAdmin' });
        assert.ok(role);
        const users = await Promise.all(userIds.map(userId => homeUser.model.user.getById(userId)));
        const memberships = await Promise.all(
          userIds.map(userId => homeUser.model.roleUser.get({ userId, roleId: role.id })),
        );
        const defaultAdmin = await homeUser.model.user.getById(defaultAdminId!);
        const defaultAdminMembership = await homeUser.model.roleUser.get({
          userId: defaultAdminId!,
          roleId: systemAdminRoleId!,
        });
        assert.equal(
          users.filter((user, index) => !!user && user.activated && !!memberships[index]).length,
          0,
        );
        assert.ok(defaultAdmin?.activated);
        assert.ok(defaultAdminMembership);
        assert.ok(users.every(user => user?.accountStatus === 'active'));

        const audits = await adminRole.model.systemAdminAudit.select({
          where: {
            targetId: { _in_: userIds },
            command: 'revoke',
            reason: 'Competing PostgreSQL authority reduction',
          },
        });
        assert.equal(audits.filter(audit => audit.result === 'accepted').length, 1);
        assert.equal(audits.filter(audit => audit.result === 'rejected').length, 1);
        const acceptedAudit = audits.find(audit => audit.result === 'accepted');
        assert.ok(acceptedAudit);
        const evictions = await adminRole.model.systemAdminSessionEviction.select({
          where: { auditId: acceptedAudit.id },
        });
        assert.equal(evictions.length, 1);
        assert.equal(evictions[0].targetId, acceptedAudit.targetId);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const adminRole = app.scope('admin-role');
        const homeUser = app.scope('home-user');
        if (userIds.length) {
          await adminRole.model.systemAdminSessionEviction.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminAudit.delete({ targetId: { _in_: userIds } });
          await adminRole.model.systemAdminFreshProof.delete({ actorId: { _in_: userIds } });
          await homeUser.model.roleUser.delete({ userId: { _in_: userIds } });
          for (const userId of userIds.reverse()) await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('action:systemAdmin:preserves final usable administrator', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const admin = await app.bean.user.findOneByName('admin');
        assert.ok(admin);
        const freshProof = await issueFreshProof();
        const [result, error] = await catchError(() => {
          return protectedCommand(
            '/admin/role/system-admin/revoke/:userId',
            admin.id as string,
            freshProof.proof,
          );
        });
        assert.equal(result, undefined);
        assert.equal(error?.code, 'admin-role:1006');
        assert.equal(error?.status, 409);

        const homeUser = app.scope('home-user');
        const role = await homeUser.model.role.get({ name: 'systemAdmin' });
        assert.ok(role);
        assert.ok(await homeUser.model.roleUser.get({ userId: admin.id, roleId: role.id }));
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
