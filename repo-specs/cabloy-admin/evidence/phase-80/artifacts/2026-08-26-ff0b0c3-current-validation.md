# Current Phase 80 Validation Summary

- **Tested revision:** `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` (`feat: rbac admin`)
- **Captured worktree state:** the only tracked modification was the authoritative Phase 70/80 dependency clarification in `pdp-wbs.md`; no application source, schema, generated consumer, environment, or port configuration was modified.
- **Executor date:** 2026-08-26

## Focused reusable RBAC and Start policy run

```bash
npm run vona :bin:test -- \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrant.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrantDepartment.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacPolicyProjection.test.ts \
  --flavor=normal
```

- Database client: managed clean `better-sqlite3` Vona test databases.
- Result: 35 tests, 34 passed, 0 failed, 1 skipped.
- The skipped case was the explicitly PostgreSQL-only policy-invalidation contention proof; it was run separately below.
- Covered contract behavior includes explicit decorator opt-in, canonical action identity, alias fail-closed behavior, default deny, action-bound unrestricted `all` decisions, request-local clearing, opaque capabilities, five-scope union/all semantics, protected grants, grant-Department association validation, policy revision invalidation, and active-instance isolation.

## Focused Student/Record controller scope run

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
- The skipped case was the independently retained PostgreSQL primary-membership contention proof, not a Phase 80 contention substitute.
- Coverage includes opted-in Student/Record actions, inherited scope keys, forged ownership/Department/instance resistance, server-derived ownership, caller-filter structural composition, Record Student preflight/inheritance, and empty/duplicate/missing/out-of-scope/mixed bulk-target rejection before mutation.

## PostgreSQL policy-invalidation contention

```bash
DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  --flavor=normal
```

- Database client: PostgreSQL.
- Result: 3 tests, 3 passed, 0 failed, 0 skipped.
- The contention test uses two separate `app.bean.executor.mockCtx(...)` operations, an explicit barrier, and a third request context. It confirmed two durable revision increments and two post-commit cache clears; rollback and per-instance isolation are exercised in the same test file.

## Contract loop and shared verification

```bash
npm run build:zova:admin
npm run deps:vona
npm run deps:zova
npm run tsc
npm run test
```

All commands passed. The paired Start Admin command built SSR and REST output before Vona dependency synchronization. `npm run tsc` passed for Zova and all Vona projects/suites. The repository regression run reported 154 tests, 150 passed, 0 failed, and 4 intentional PostgreSQL-only skips.

The intended four-module metadata/OpenAPI procedure was exercised against a managed local Swagger service:

```bash
npm run vona :tools:metadata admin-user admin-rbac admin-role admin-department
npm run zova :tools:metadata admin-user admin-rbac admin-role admin-department
npm run zova :openapi:generate admin-user admin-rbac admin-role admin-department
# Repeat the three commands above, then:
git diff --exit-code -- vona/src/suite/cabloy-admin zova/src/suite/cabloy-admin vona/pnpm-lock.yaml
```

The procedure produced broad generated-consumer output drift rather than a clean fixed point. The generated Swagger type/schema documents intentionally contain the complete runtime Swagger document for every consumer module; the observed changes therefore could not be attributed only to the four Admin operation filters. The generated artifacts were restored rather than hand-edited. A clean current four-module fixed point remains unverified until the exact Swagger source and environment are captured and the resulting contract changes are independently classified.

The current module manifests keep `training-student`, `training-record`, and `admin-rbac` at `vonaModule.fileVersion: 1`. Their version-1 `MetaVersion` paths create the scoped ownership/policy tables and fields; no version-2 migration exists. The clean `npm run test` reset initialized those version-1 paths.

## Browser acceptance

```bash
npm run test:e2e cabloy-admin -- --grep 'ATP-ADM-POL-04'
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

- Runtime: clean managed local Start Admin SSR runner; `better-sqlite3` test database; no `E2E_BASE_URL`.
- Result: focused `ATP-ADM-POL-04` scenario: 1 passed. Tagged Admin suite: 6 passed.
- The focused run confirmed delegated Student row/detail action projections, raw SSR and hydrated markers, and a real stale delegated `PATCH` rejected with `403` after the update grant was revoked; a system-administrator read confirmed the Student remained unchanged.
- The tagged run also passed current SSR, Department membership, User-role replacement, and Role policy-editor scenarios.
- Expected `403` and Department lifecycle-conflict server responses were deliberately asserted by the browser scenarios. Test-owned fixtures were removed by the test suite.

## Quality disposition

```bash
npm run lint
npm run format
git diff --check
```

`git diff --check` passed. Repository-wide lint and format checks did not pass because of existing findings in unrelated source files. The lint output contained 16 findings, including files in `admin-department`, `admin-rbac`, `admin-role`, and `training-record`; format reported 57 existing files. No unrelated source was reformatted, and these non-clean checks are neither passes nor waivers.
