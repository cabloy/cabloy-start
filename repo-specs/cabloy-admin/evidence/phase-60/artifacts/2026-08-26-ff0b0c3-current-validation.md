# Current Phase 60 Validation Summary

- **Tested revision:** `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` (`feat: rbac admin`)
- **Captured worktree state:** the only tracked modification was the authoritative Phase 70/80 dependency clarification in `pdp-wbs.md`; no application source, schema, generated consumer, environment, or port configuration was modified.
- **Executor date:** 2026-08-26

## Focused Department, authorization, and scoped-resource run

```bash
npm run vona :bin:test -- \
  src/suite/a-training/modules/training-student/test/dataScope.test.ts \
  src/suite/a-training/modules/training-student/test/student.test.ts \
  src/suite/a-training/modules/training-record/test/dataScope.test.ts \
  src/suite/a-training/modules/training-record/test/record.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts \
  src/suite/cabloy-admin/modules/admin-user/test/authorization.test.ts \
  src/suite/cabloy-admin/modules/admin-role/test/authorization.test.ts \
  src/suite/cabloy-admin/modules/admin-department/test/authorization.test.ts \
  --flavor=normal
```

- Database client: managed clean `better-sqlite3` Vona test databases.
- Result: 26 tests, 25 passed, 0 failed, 1 skipped.
- The skipped case was the explicitly PostgreSQL-only primary-membership contention proof; it was run separately below.
- Expected authorization, validation, not-found, duplicate, and lifecycle-conflict log entries were asserted negative-path outcomes.

## PostgreSQL primary-membership contention

```bash
DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- \
  src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts \
  --flavor=normal
```

- Database client: PostgreSQL.
- Result: 7 tests, 7 passed, 0 failed, 0 skipped.
- The named primary-membership contention scenario used two separate `mockCtx(...)` request contexts and the test's explicit two-party barrier. Its durable final assertion confirmed exactly one enabled primary membership for the test-owned user.

## Start Admin browser acceptance

```bash
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

- Runtime: clean managed local Start Admin SSR runner; `better-sqlite3` test database; no `E2E_BASE_URL`.
- Result: 6 passed.
- The tagged current specification passed `ATP-ADM-SSR-01`, `ATP-ADM-RES-02`, `ATP-ADM-RES-03`, `ATP-ADM-POL-03`, `ATP-ADM-POL-04`, and `ATP-ADM-RES-01`.
- The relevant Phase 60 scenarios exercised SSR redirect/hydration/navigation; rendered membership create/edit/primary/manager/delete and Resource refresh; rendered ordinary-role replacement; and account/Department projections plus Department Move refresh.
- Expected `403` and lifecycle-conflict server responses were deliberately asserted by the browser scenarios. Test-owned data was cleaned by the test suite.

## Shared checks relevant to the retained source state

```bash
npm run build:zova:admin
npm run deps:vona
npm run deps:zova
npm run tsc
npm run test
```

All commands passed. The root test run reported 154 tests, 150 passed, 0 failed, and 4 intentional PostgreSQL-only skips.

Repository-wide `npm run lint` and `npm run format` were attempted separately and were not clean on the existing repository source. They are not represented as passes or waivers in this record.
