# ATP-ADM-MEM-02 — PostgreSQL primary-membership contention

## Traceability

| Field           | Value                                                |
| --------------- | ---------------------------------------------------- |
| ATP             | `ATP-ADM-MEM-02`                                     |
| PRD             | `PRD-ADM-MEM-04`                                     |
| SRS             | `SRS-ADM-MEM-03`; `SRS-ADM-NFR-02`, `SRS-ADM-NFR-03` |
| WBS             | `WBS-ADM-60-02`, `WBS-ADM-60-03`                     |
| Tested revision | `534056c7cf59b4bde6b96abefe01cf462ec91203`           |
| Database client | `pg` (PostgreSQL)                                    |
| Zova flavor     | N/A — backend PostgreSQL transaction scenario        |
| Executor date   | 2026-08-15                                           |

## Procedure and interleaving

```bash
DATABASE_DEFAULT_CLIENT=pg pnpm --dir vona run vona :bin:test \
  src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts \
  -- --flavor=normal
```

`action:departmentMembership:serializesPrimaryAssignmentUnderPostgreSQLContention` creates one test-owned user, two test-owned Departments, and two enabled memberships. Two independent `app.bean.executor.mockCtx(...)` request contexts wait at an explicit two-party barrier, then each selects a different membership as primary. A final scoped read verifies durable state. The test cleans memberships, Departments, and the user in reverse dependency order in `finally`.

## Expected and observed result

Pass. The retained command ran against the `pg` dialect and reported 6 tests passed, 0 failed, and 0 skipped. The named contention proof ran rather than taking the SQLite skip branch. Its final durable assertion established exactly one enabled primary membership for the test user.

## Retained evidence

- [Focused PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)
- [Focused SQLite/API baseline](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)

## Waiver

None.
