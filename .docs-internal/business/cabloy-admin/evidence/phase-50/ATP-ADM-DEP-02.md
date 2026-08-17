# ATP-ADM-DEP-02 — Department ordering and lifecycle guards

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-DEP-02` |
| SRS | `SRS-ADM-DEP-03` through `SRS-ADM-DEP-07` |
| WBS | `WBS-ADM-50-02` |
| Tested revision | Uncommitted working tree based on `ff7270f` |
| Database clients | SQLite (`better-sqlite3`) and PostgreSQL |
| Zova flavor | `cabloyStartAdmin` |
| Executor date | 2026-08-17 |

## Procedure and fixtures

The focused tests create exact test-owned roots, children, memberships, and manager relationships. They assert deterministic sibling ordering, scoped move/reorder/activation behavior, lifecycle conflicts, and recovery without implicit cascades. Cleanup removes explicit relationships and records in reverse dependency order.

The rendered Start Admin scenario creates two roots, a movable child, and a protected Department with an enabled manager membership. It performs Move, sibling-only Reorder with the `Append` target, disables the movable child, and reloads the Resource state. It then attempts to disable the protected Department, observes the expected conflict and rendered error alert, clears the manager, removes the membership, and disables the Department successfully. Fixture arrangement and recovery use direct APIs; lifecycle acceptance uses the rendered commands.

```bash
pnpm --dir vona run vona :bin:test -- --flavor=normal \
  src/suite/cabloy-admin/modules/admin-department/test/department.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentTree.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts
DATABASE_DEFAULT_CLIENT=pg pnpm --dir vona run vona :bin:test \
  src/suite/cabloy-admin/modules/admin-department/test/departmentTree.test.ts \
  -- --flavor=normal
npm run zova :tools:metadata admin-department
npm run build:zova:admin
npm run deps:vona
npm run tsc
npm run test:e2e:start:clean -- --grep 'ATP-ADM-RES-01'
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

## Expected result

- Sibling ordering is deterministic by `(sortOrder, id)` after move and reorder.
- Invalid self/descendant move and stale reorder inputs produce stable conflicts without partial state changes.
- Disable/delete never silently cascades through children, enabled memberships, or a manager.
- A disabled Department cannot accept membership creation, membership re-enable, or manager assignment; recovery operations remain available.
- Rendered Reorder and activation actions use their dedicated `PUT` endpoints rather than generic Department `PATCH`.

## Observed result

Pass. The focused SQLite suite reported 15 tests: 13 passed, 0 failed, and 2 PostgreSQL-only tests skipped. It covers deterministic move/reorder, lifecycle dependency guards, disabled-Department membership re-enable and manager-assignment conflicts, and active-instance absence. The PostgreSQL tree suite reported 2 passed, 0 failed, and 0 skipped, including the explicit-barrier competing-move proof.

The constrained metadata generator, paired Start Admin SSR/REST build, Vona dependency synchronization, and full typecheck completed successfully. The focused browser lifecycle scenario passed. The tagged Start Admin browser suite reported 4 passed. The lifecycle scenario confirmed that Reorder preserves a nullable append target, the picker excludes the moving Department and non-siblings, activation sends the intended target state, the Department Resource renders the refreshed Enable action after deactivation, dependency blocking returns `409` with an error alert, and recovery permits a later deactivation. It observed zero generic Department `PATCH` lifecycle requests.

## Retained evidence

- This record retains the redacted final command set and observed results for the current uncommitted revision.
- No credential, cookie, fixture identity, database name, screenshot, or network payload is retained.
- CI job: not used.

## Remaining closure gates

None for `WBS-ADM-50-02`.

## Waiver

None.
