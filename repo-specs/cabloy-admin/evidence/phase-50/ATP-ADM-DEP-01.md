# ATP-ADM-DEP-01 — Department roots, instance scope, and forest integrity

## Traceability

| Field            | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| ATP              | `ATP-ADM-DEP-01`                                            |
| PRD              | `PRD-ADM-DEP-01` through `PRD-ADM-DEP-04`, `PRD-ADM-SEC-01` |
| SRS              | `SRS-ADM-DEP-01` through `SRS-ADM-DEP-04`, `SRS-ADM-TEN-04` |
| WBS              | `WBS-ADM-50-01`, `WBS-ADM-50-02`                            |
| Tested revision  | Uncommitted working tree based on `ff7270f`                 |
| Database clients | SQLite (`better-sqlite3`) and PostgreSQL                    |
| Zova flavor      | `cabloyStartAdmin`                                          |
| Executor date    | 2026-08-17                                                  |

## Procedure and fixtures

The focused API tests own their exact Department records in `mockCtx(...)` boundaries and delete them in reverse tree order. The instance-scope scenario creates source-instance Departments, enters a second active instance, and proves that foreign view, list, tree, move, reorder, and activation operations treat those records as absent. It does not use an unscoped probe to distinguish authorization states.

The PostgreSQL tree test creates two candidate parents and one child, then launches competing moves from distinct `mockCtx(...)` request boundaries through an explicit promise barrier. It asserts one durable valid parent relation with no cycle after the competing operations complete.

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
npm run test:e2e cabloy-admin -- --grep 'ATP-ADM-RES-01'
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

## Expected result

- Roots persist with `parentId: null`; `0` is invalid.
- Parents and all forest commands resolve only in the active instance; foreign records are absent.
- Generic `PATCH` cannot change parent, lifecycle, ordering, or internal manager-reference fields.
- Self/descendant moves are rejected, and competing PostgreSQL moves leave one valid durable forest state.
- Start Admin SSR hydrates the Department Resource and uses only dedicated lifecycle endpoints.

## Observed result

Pass. The focused SQLite suite reported 15 tests: 13 passed, 0 failed, and 2 PostgreSQL-only tests skipped. It includes explicit cross-instance absence checks for Department view, list, tree, move, reorder, and activation.

The PostgreSQL tree suite reported 2 passed, 0 failed, and 0 skipped, including `serializesMovesUnderPostgreSQLContention`. The explicit-barrier, separate-request race left a valid durable tree state.

The constrained metadata generator, Start Admin SSR/REST build, Vona dependency synchronization, and combined Zova/Vona typecheck all completed successfully. The focused rendered lifecycle scenario passed, and the tagged Start Admin browser suite reported 4 passed. The browser proof confirmed SSR hydration, rendered Move/Reorder/activation actions, dedicated lifecycle traffic, visible post-mutation Department state, and zero generic Department `PATCH` lifecycle requests.

## Retained evidence

- This record retains the redacted final command set and observed results for the current uncommitted revision.
- No credential, cookie, fixture identity, database name, screenshot, or network payload is retained.
- CI job: not used.

## Remaining closure gates

None for `WBS-ADM-50-01` or `WBS-ADM-50-02`.

## Waiver

None.
