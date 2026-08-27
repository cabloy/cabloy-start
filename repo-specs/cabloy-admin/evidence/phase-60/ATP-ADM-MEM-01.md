# ATP-ADM-MEM-01 — Membership lifecycle and relation boundary

## Traceability

| Field           | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| ATP             | `ATP-ADM-MEM-01`                                                     |
| PRD             | `PRD-ADM-MEM-01` through `PRD-ADM-MEM-03`; `PRD-ADM-UI-01`           |
| SRS             | `SRS-ADM-MEM-01`, `SRS-ADM-MEM-02`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02` |
| WBS             | `WBS-ADM-60-01`, `WBS-ADM-60-03`                                     |
| Tested revision | `534056c7cf59b4bde6b96abefe01cf462ec91203`                           |
| Database client | `better-sqlite3`                                                     |
| Zova flavor     | N/A — backend integration scenario                                   |
| Executor date   | 2026-08-15                                                           |

## Procedure

```bash
pnpm --dir vona run vona :bin:test \
  src/suite/cabloy-admin/modules/admin-user/test/user.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts \
  -- --flavor=normal
```

The membership suite uses isolated test-created users, Departments, and memberships. It exercises multiple memberships for one user, membership-scoped positions, duplicate prevention, scoped absence, lifecycle guards, and duplicate-create serialization. Cleanup removes all test-owned persisted records in reverse dependency order.

## Expected and observed result

Pass. The retained run reports 8 tests total: 7 passed, 0 failed, and one PostgreSQL-only proof skipped under SQLite. The lifecycle scenario accepted valid multi-membership state and rejected unauthorized, forbidden, duplicate, and dependent-lifecycle operations. The account detail projection test ran with the same focused command.

## Retained evidence

- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Repository TypeScript log](./artifacts/2026-08-15-534056c-tsc.log)

## Waiver

None.
