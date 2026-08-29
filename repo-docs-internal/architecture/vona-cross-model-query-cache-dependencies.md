# Vona Cross-Model Query-Cache Dependencies

This note records Cabloy Start maintainer rationale and source evidence for cross-Model query-cache invalidation. The portable operational contract is maintained in the public [Cache Guide](../../repo-docs/backend/cache-guide.md); this note is supporting evidence and is not required to execute the workflow.

## Decision boundary

A Model-cache dependency exists when a mutation in one Model can make a cached query result in another Model stale. Choose the dependency from query-result semantics, not merely from a foreign key or ORM relation. Consider changes to:

- query membership;
- totals and aggregates;
- ordering or pagination;
- projected fields;
- included or related data;
- visibility, publication, permission, soft-deletion, or instance scope.

Declare one directed source-to-target edge for each dependency. Use either `modelsClear` on the source Model or `modelsClearedBy` on the target Model, but do not declare both forms for the same edge. Keep the graph narrow, acyclic, and free of duplicate edges. A cache dependency refreshes query-cache state; it does not replace transaction boundaries, locking, authorization, or business consistency rules.

A normal default edge clears the target query cache and allows downstream edges to propagate. `modelsClearedByFn` is an override, not an additional callback: when present, it replaces the default target clear, so the callback must deliberately clear the target and perform any downstream propagation that its contract requires.

Use normal Model or service mutation paths. Those paths keep entity/query invalidation, commit-time re-clear, and configured sharding double-delete behavior together. A direct database write can bypass the invalidation contract.

## Source-proven behavior in this Start checkout

The following observations were checked against the current Start source:

- Model cache options expose `modelsClear`, `modelsClearedBy`, and `modelsClearedByFn` in [`types/onion/model.ts`](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/types/onion/model.ts).
- [`lib/const.ts`](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/const.ts) collects each source Model's `modelsClear` targets and normalizes each target-side `modelsClearedBy` declaration into the same source-to-target map. Collection appends declarations; it does not deduplicate them or guard against cycles.
- [`bean.model/bean.model_cache.ts`](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/bean.model/bean.model_cache.ts) clears a Model's query cache before walking its configured targets. Default propagation invokes the target's `cacheQueryClearInner()`, so downstream dependencies can be reached transitively.
- The same cache implementation invokes a target's `modelsClearedByFn` instead of the default target clear when the callback is configured.
- Public cache-clearing methods register a commit-time clear. The implementation also schedules configured sharding double-delete work through the ORM queue.
- [`transactionConsistency_.ts`](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/service/transactionConsistency_.ts) stores commit callbacks and executes them after the transaction's work completes, preserving the transaction-aware consistency boundary used by the ORM cache path.

These are current source observations, not claims that every application Model has a dependency declaration or a dedicated regression suite.

## Regression-tested in this Start checkout

The inspected Start `training-student` resource test verifies emitted metadata, DTO projections, CRUD behavior, nested records, and invalid or serialized values. It does not establish a cross-Model query-cache dependency regression. No matching Start-side `modelCache.test.ts`, Commerce catalogue fixture, or application-level `modelsClear` declaration was found during this review.

Therefore this checkout currently provides no Start application-test evidence for a particular cross-Model cache graph. Do not present a Basic application example or Basic test path as Start regression coverage.

When a Start dependency is introduced, the minimum regression shape is:

1. warm the identical target query;
2. mutate the source through the normal Model/service API;
3. repeat the target query;
4. assert that members, totals, ordering, included relations, projection, and relevant visibility are fresh.

The test should own and clean up any test-local persisted resources in `finally`, using the repository's scoped context and resource-lifecycle conventions.

## Recommended regression coverage

The following cases are recommended framework or application coverage. They are not asserted to exist in the current Start checkout:

- source-side `modelsClear` declaration and target-side `modelsClearedBy` normalization;
- a transitive graph such as `A → B → C`;
- callback replacement, including explicit target clear and downstream behavior;
- dynamic table and datasource selection;
- duplicate-edge and cycle handling, with the desired behavior made explicit before adding a guard or changing traversal;
- commit-time re-clear and configured sharding double-delete behavior;
- cache disabled or transaction rollback paths;
- tenant/instance visibility changes where a source mutation changes target membership.

If the runtime later adds deduplication or cycle detection, update this note and the public Cache Guide together, and add a focused test proving the new contract.

## Maintainer checklist

Before adding an edge, verify:

- the target query can actually become stale;
- the edge direction is source mutation → target query;
- exactly one declaration form is used;
- no duplicate or cyclic path is introduced;
- the mutation uses a normal Model/service path;
- a warmed-query regression test covers the affected result semantics;
- the source and test evidence cited in the note belongs to the active Start checkout.
