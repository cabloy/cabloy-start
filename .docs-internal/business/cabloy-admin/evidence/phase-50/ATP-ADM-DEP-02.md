# ATP-ADM-DEP-02 — Department ordering and lifecycle guards

## Traceability

| Field           | Value                                       |
| --------------- | ------------------------------------------- |
| ATP             | `ATP-ADM-DEP-02`                            |
| SRS             | `SRS-ADM-DEP-03` through `SRS-ADM-DEP-07`   |
| WBS             | `WBS-ADM-50-02`                             |
| Tested revision | Uncommitted working tree based on `ba44ec0` |
| Database client | `sqlite3` (`better-sqlite3`)                |
| Zova flavor     | `cabloyStartAdmin`                          |
| Executor date   | 2026-08-13                                  |

## Procedure and fixtures

The tree test creates three roots, a child, and a grandchild. Creation and movement append into sibling namespaces with a fixed sort-order gap; explicit reorder resequences siblings by `(sortOrder, id)`. The resource test creates a parent and child, then attempts deactivation and deletion of the parent. All test-owned records are deleted by exact ID in reverse dependency order from a separate mock context.

```bash
pnpm --dir vona run vona :bin:test -- --flavor=normal \
  src/suite/cabloy-admin/modules/admin-department/test/department.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentTree.test.ts
npm run build:zova:admin
npm run deps:vona
npm run tsc
```

## Expected result

- A moved Department receives the destination parent and append position.
- Reorder places a sibling before the requested sibling and produces deterministic increasing order.
- Self/descendant moves and invalid reorder targets return stable `409` conflicts without partial state changes.
- Departments with children cannot be deactivated or deleted; there is no implicit subtree cascade.

## Observed result

Pass. The focused Department suite reports 4 tests, 4 passed, 0 failed. The full root regression suite reports exit code 0. `npm run build:zova:admin` completed both Start Admin SSR and REST builds, and `npm run deps:vona` completed successfully. `npm run tsc` completed successfully. Lifecycle rejection output confirms the child dependency guard remains active for both deactivation and deletion.

## Retained evidence

- [Root regression command log](./artifacts/2026-08-13-department-root-test.log)
- The paired Start Admin build and dependency-sync output completed successfully in the executor session; no standalone log was retained.
- CI job: not used.
- Screenshot: N/A.

## Remaining closure gates

- PostgreSQL contention proof for competing Department operations is not yet retained.
- Browser navigation and Resource interaction evidence is not yet retained.
- Cross-instance absence evidence is not yet retained.

## Waiver

None.
