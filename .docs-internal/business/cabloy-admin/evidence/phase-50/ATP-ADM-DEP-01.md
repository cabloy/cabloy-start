# ATP-ADM-DEP-01 — Department roots, parent scope, and forest integrity

## Traceability

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| ATP             | `ATP-ADM-DEP-01`                                    |
| SRS             | `SRS-ADM-DEP-01` through `SRS-ADM-DEP-04`           |
| WBS             | `WBS-ADM-50-01`, `WBS-ADM-50-02`                    |
| Tested revision | Uncommitted working tree based on `ba44ec0`         |
| Database client | `sqlite3` (`better-sqlite3`)                        |
| Zova flavor     | `cabloyStartAdmin` for generated contract/SSR build |
| Executor date   | 2026-08-13                                          |

## Procedure and fixtures

The focused tests create exact UUID-named roots, children, and descendants in the active test instance. Each stateful suite declares `{ concurrency: false }`; each test owns its `app.bean.executor.mockCtx(...)` request boundary and deletes test-owned Departments in a separate cleanup context in reverse tree order.

```bash
pnpm --dir vona run vona :bin:test -- --flavor=normal \
  src/suite/cabloy-admin/modules/admin-department/test/department.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentTree.test.ts
DATABASE_DEFAULT_CLIENT=sqlite3 npm run test
```

## Expected result

- Root Departments persist `parentId: null`; `0` is rejected.
- Parent IDs resolve only through the active instance scope.
- A duplicate sibling name is rejected case-insensitively.
- Generic PATCH cannot change parent, lifecycle, order, or internal manager-reference fields.
- Self-parenting and ancestor-under-descendant moves return the stable tree conflict.

## Observed result

Pass. The focused suite reports 4 tests, 4 passed, 0 failed. It proves anonymous Resource access is rejected, creates root/child records, rejects the `0` parent and case-insensitive sibling collision, preserves dedicated-command boundaries on generic PATCH, and rejects self/descendant cycle attempts with stable `409` errors. The full root test suite passed after recreating the test database, including the `admin-department` migration at file version 1, with 41 tests total, 40 passed, 0 failed, and 1 PostgreSQL-only skip.

## Retained evidence

- [Root regression command log](./artifacts/2026-08-13-department-root-test.log)
- Focused command output was observed in the executor session; it is not retained as a separate artifact.
- CI job: not used.
- Screenshot: N/A.

## Remaining closure gates

- Add a PostgreSQL test that proves a Department competing-operation interleaving in separate `mockCtx(...)` boundaries.
- Retain cross-instance API evidence and Start Admin browser/SSR Resource-navigation evidence.

## Waiver

None.
