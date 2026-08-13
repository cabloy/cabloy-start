import type { TableIdentity } from 'table-identity';

import { randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

const ClaimLeaseMilliseconds = 60_000;
const MaxAttempts = 10;

@Service()
export class ServiceSystemAdminSessionEviction extends BeanBase {
  async enqueue(targetId: TableIdentity, auditId: TableIdentity) {
    const eviction = await this.scope.model.systemAdminSessionEviction.insert({
      targetId,
      auditId,
      state: 'pending',
      attemptCount: 0,
      nextAttemptAt: new Date(Date.now() - 1_000),
    });
    if (!this.app.meta.isTest) {
      this.ctx.db.commit(() => {
        this.scope.queue.systemAdminSessionEviction.push({ evictionId: eviction.id });
      });
    }
    return eviction;
  }

  @Core.transaction()
  async claim(id: TableIdentity) {
    const eviction = await this.scope.model.systemAdminSessionEviction.getByIdForUpdate(id);
    if (!eviction || eviction.state === 'dispatched' || eviction.state === 'failed') return;
    const now = new Date();
    const eligible =
      (eviction.state === 'pending' &&
        (!eviction.nextAttemptAt || eviction.nextAttemptAt <= now)) ||
      (eviction.state === 'claimed' &&
        !!eviction.claimExpiresAt &&
        eviction.claimExpiresAt <= now);
    if (!eligible) return;
    if (eviction.attemptCount >= MaxAttempts) {
      await this.scope.model.systemAdminSessionEviction.updateById(eviction.id, {
        state: 'failed',
        errorSummary: 'session eviction attempts exhausted',
      });
      return;
    }
    const claimToken = randomUUID();
    const claimedAt = now;
    const claimExpiresAt = new Date(now.getTime() + ClaimLeaseMilliseconds);
    await this.scope.model.systemAdminSessionEviction.updateById(eviction.id, {
      state: 'claimed',
      claimedAt,
      claimToken,
      claimExpiresAt,
      attemptCount: eviction.attemptCount + 1,
      errorSummary: undefined,
    });
    return {
      ...eviction,
      state: 'claimed' as const,
      claimedAt,
      claimToken,
      claimExpiresAt,
      attemptCount: eviction.attemptCount + 1,
      errorSummary: undefined,
    };
  }

  @Core.transaction()
  async markDispatched(id: TableIdentity, claimToken: string) {
    const eviction = await this.scope.model.systemAdminSessionEviction.getByIdForUpdate(id);
    if (!eviction || eviction.state !== 'claimed' || eviction.claimToken !== claimToken) return;
    const dispatchedAt = new Date();
    await this.scope.model.systemAdminSessionEviction.updateById(eviction.id, {
      state: 'dispatched',
      dispatchedAt,
      claimedAt: undefined,
      claimToken: undefined,
      claimExpiresAt: undefined,
      errorSummary: undefined,
    });
    return { ...eviction, state: 'dispatched' as const, dispatchedAt };
  }

  @Core.transaction()
  async release(id: TableIdentity, claimToken: string, _error: unknown) {
    const eviction = await this.scope.model.systemAdminSessionEviction.getByIdForUpdate(id);
    if (!eviction || eviction.state !== 'claimed' || eviction.claimToken !== claimToken) return;
    const errorSummary = 'session eviction failed';
    if (eviction.attemptCount >= MaxAttempts) {
      await this.scope.model.systemAdminSessionEviction.updateById(eviction.id, {
        state: 'failed',
        claimedAt: undefined,
        claimToken: undefined,
        claimExpiresAt: undefined,
        errorSummary,
      });
      return { ...eviction, state: 'failed' as const, errorSummary };
    }
    const nextAttemptAt = new Date(
      Math.ceil((Date.now() + retryDelayMilliseconds(eviction.attemptCount)) / 1_000) * 1_000,
    );
    await this.scope.model.systemAdminSessionEviction.updateById(eviction.id, {
      state: 'pending',
      claimedAt: undefined,
      claimToken: undefined,
      claimExpiresAt: undefined,
      nextAttemptAt,
      errorSummary,
    });
    return { ...eviction, state: 'pending' as const, nextAttemptAt, errorSummary };
  }

  async queueDue(limit = 100) {
    const now = new Date();
    const pending = await this.scope.model.systemAdminSessionEviction.select({
      where: { state: 'pending', nextAttemptAt: { _lte_: now } },
      orders: [
        ['nextAttemptAt', 'asc'],
        ['id', 'asc'],
      ],
      limit,
    });
    const claimed = await this.scope.model.systemAdminSessionEviction.select({
      where: { state: 'claimed', claimExpiresAt: { _lte_: now } },
      orders: [
        ['claimExpiresAt', 'asc'],
        ['id', 'asc'],
      ],
      limit: Math.max(0, limit - pending.length),
    });
    for (const eviction of [...pending, ...claimed]) {
      await this.scope.queue.systemAdminSessionEviction.pushAsync({ evictionId: eviction.id });
    }
  }
}

function retryDelayMilliseconds(attemptCount: number) {
  return Math.min(60_000, 1_000 * 2 ** Math.max(0, attemptCount - 1));
}
