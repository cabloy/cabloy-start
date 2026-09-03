# Vona Queue Retry and Durable Outbox Recovery

This note records Cabloy Start source observations and maintainer rationale about BullMQ retries in Vona `@Queue` beans and their relationship to a durable application outbox. It is supporting material for Start maintainers, not a replacement for the portable queue documentation or an implementation prerequisite.

## Scope and source boundary

The framework observations below were checked against the current Start `a-queue` implementation. The A-Flow references describe the bounded WBS-FLW-30-02 worktree implementation under `.claude/worktrees/spec-start-a-flow/` at the time of analysis; that implementation was uncommitted. Treat the underlying Vona framework behavior as source-backed, and treat the A-Flow design guidance as the stated boundary of that increment rather than as a generic outbox requirement.

## Confirmed Vona and BullMQ retry surface

A Vona queue bean can configure BullMQ job options on the decorator:

```ts
@Queue({
  options: {
    job: {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1_000,
      },
    },
  },
})
export class QueueExample extends BeanQueueBase<ExampleData, void> {}
```

The same options can be selected for an individual enqueue through `IQueuePushOptions.jobOptions`:

```ts
await this.scope.queue.example.pushAsync(data, {
  jobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1_000 },
  },
});
```

The relevant Start type surfaces are:

- [`IQueuePushOptions`](../../vona/src/suite-vendor/a-vona/modules/a-queue/src/types/queue.ts), which exposes `jobOptions?: Bull.JobsOptions`;
- [`IDecoratorQueueOptions`](../../vona/src/suite-vendor/a-vona/modules/a-queue/src/types/queue.ts), which exposes `options.job?: Bull.JobsOptions`;
- [`ServiceQueue`](../../vona/src/suite-vendor/a-vona/modules/a-queue/src/service/queue.ts), which merges decorator-level job options with enqueue-level options before creating the BullMQ job.

At the time of analysis, Start resolves BullMQ `5.76.8`. Its `attempts` value is the **total** number of processing attempts, including the initial attempt. Consequently, `attempts: 5` permits at most four retries. `backoff` does not itself enable a retry; a later attempt must be permitted by `attempts`.

Decorator job options are the direct per-queue default. Queue-level `defaultJobOptions` can also exist in the lower-level BullMQ queue options, but should not be preferred merely to bypass Vona's clearer `options.job` surface. Per-enqueue `jobOptions` override the decorator defaults.

## Failure propagation is the retry boundary

BullMQ retries a job only when its processor rejects or throws and the failure reaches BullMQ. Vona's queue worker awaits `beanInstance.execute(...)` and rethrows an escaping failure from its task wrapper. Therefore an uncaught rejection from a queue bean can use BullMQ `attempts` and `backoff` without a Vona framework change.

Conversely, a queue bean that catches an error and then returns normally has completed successfully from BullMQ's perspective. Adding `attempts` and `backoff` to such a bean does not activate BullMQ retry.

This distinction must remain explicit when reading code such as the A-Flow dispatcher in the WBS worktree:

```ts
try {
  // claim, causally validate, deliver, and acknowledge
} catch (error) {
  await this.scope.service.workflowOutbox.release(event.id, event.claimToken!, error);
}
```

The dispatcher deliberately converts delivery failure into durable database state and returns. It therefore uses database-scheduled retry, not retry of the same BullMQ job.

`pushAsync()` follows the underlying job's final outcome: when BullMQ retries are enabled, it remains pending through intermediate failures, resolves on a later success, and rejects only after terminal failure. A periodic scanner should not accidentally wait through a long chain of worker retries unless that blocking behavior is an explicit design choice.

## Durable outbox and queue retries solve different failures

BullMQ retry is valuable for short-lived worker failures after a job was successfully persisted in Redis. A durable outbox remains necessary when the business system must retain and recover a delivery intent independently of Redis job lifecycle.

A database-backed outbox recovery loop covers failures that BullMQ retry alone cannot establish as durable application truth:

1. the business transaction commits but the post-commit queue push fails;
2. the process stops after the outbox row commits but before a job is added;
3. a worker claims an outbox row and then stops, so a lease must expire before another worker can take it;
4. Redis jobs are removed, expire, or terminally fail while the application still needs to reconcile the persisted delivery intent;
5. retry count, terminal failure, safe error summary, and aggregate audit need to remain queryable as application records rather than as ephemeral job metadata.

The A-Flow WBS worktree intentionally separates these roles:

```text
committed workflow transition
  → durable workflowOutboxEvent
  → best-effort post-commit queue wake-up
  → claim + causal validation + in-process event delivery
  → dispatched acknowledgement

failure or missed wake-up
  → pending durable outbox state / lease recovery
  → periodic scan
  → a new queue wake-up
```

The periodic [`ScheduleWorkflowOutboxDispatch`](../../.claude/worktrees/spec-start-a-flow/vona/src/suite/a-flow/modules/flow-runtime/src/bean/schedule.workflowOutboxDispatch.ts) is therefore a durable reconciler. It scans due `pending` rows and expired `claimed` leases through [`ServiceWorkflowOutbox.queueDue()`](../../.claude/worktrees/spec-start-a-flow/vona/src/suite/a-flow/modules/flow-runtime/src/service/workflowOutbox.ts). It is not merely a substitute for a queue backoff delay.

## Why the current A-Flow design does not simply enable BullMQ retry

The WBS dispatcher claims a database event with a 60-second lease before calling the typed transition-event listener. Its `release(...)` operation advances the durable attempt count and writes the next database-controlled retry time. Replacing this by only decorator options would create unresolved ownership conflicts:

- If the dispatcher throws while the row stays `claimed`, a fast BullMQ retry cannot claim it until the database lease expires.
- If the dispatcher releases the row and then throws, the database `nextAttemptAt` and the BullMQ backoff become two competing retry schedules.
- BullMQ retries are tied to one Redis job. A recovery scan creates a new job, so `attemptsMade` cannot be used as the durable cumulative delivery-attempt count.
- A terminal BullMQ failure needs a reliable, fenced write back to the durable outbox before it can represent a business-level terminal delivery failure.
- Applying both retry systems to every listener failure can amplify at-least-once delivery attempts and complicate idempotency.

For those reasons, the current A-Flow implementation uses one application-owned retry authority: `workflowOutboxEvent` records `attemptCount`, `nextAttemptAt`, claim token, claim expiry, terminal `failed` state, and a redacted error summary. The queue is a latency and execution mechanism; it is not the authority for notification-delivery truth.

## Recommended design rule

Choose one primary retry authority for each delivery class. For business delivery that requires reliable recovery, prefer an application-owned durable outbox scheduler over BullMQ `attempts` / `backoff`; use BullMQ retries for transient queue work that has no independent durable delivery obligation.

- For transient, non-business queue work with no durable delivery obligation, use BullMQ `attempts` and `backoff`, and allow failures to escape `execute()`.
- For a transactional outbox with recoverable, queryable, audited delivery intent, keep retry state, fencing, leases, and terminal failure in the application database; use a periodic scan to repair missed queue wake-ups and abandoned claims.
- A hybrid is possible only with an explicit split of responsibility. For example, BullMQ may make a small number of short infrastructure retries while the durable outbox remains the cross-process recovery authority. Before adopting that model, define how claim leases are released or renewed, how BullMQ terminal failure is persisted, how `pushAsync()` affects scans, and how duplicate delivery remains idempotent.

Do not enable decorator-level `attempts` / `backoff` on a durable-outbox dispatcher merely because the framework supports them. First decide whether errors should escape the dispatcher, whether the durable row is released, and which system owns the attempt count and next eligible delivery time.

## Maintainer checklist

Before changing queue retry behavior, verify:

1. Does the queue bean throw/reject, or does it catch and convert failure into durable state?
2. Is retry state owned by BullMQ, an application outbox, or an intentionally designed hybrid?
3. If a durable row is claimed, how do lease expiry, release, and queue backoff compose without blocking or duplicate scheduling?
4. Can a committed outbox row be recovered when no Redis job exists?
5. Do terminal failures create the required durable audit and use a bounded, redacted summary?
6. Can the consumer tolerate at-least-once delivery and deduplicate from a durable source-event identity?
7. Does any scheduler use `pushAsync()` in a way that would block scanning for the full BullMQ retry window?

Update this note when Vona changes queue failure propagation, option-merging behavior, or the framework's BullMQ version, and add focused coverage before changing the durable outbox retry contract.
