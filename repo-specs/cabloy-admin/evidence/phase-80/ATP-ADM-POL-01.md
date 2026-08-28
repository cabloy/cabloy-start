# ATP-ADM-POL-01 — Reusable RBAC catalog and guard contract

## Traceability

| Field                  | Value                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-POL-01`                                                                        |
| PRD                    | `PRD-ADM-POL-01`–`PRD-ADM-POL-03`                                                       |
| SRS                    | `SRS-ADM-POL-01`–`SRS-ADM-POL-04`; `SRS-ADM-SCP-09`                                     |
| WBS                    | `WBS-ADM-80-01`                                                                         |
| Tested source revision | `533c66edc03ab0d5337eaab3087806f0acb3fad1` plus the uncommitted changes described below |
| Database client        | managed clean `better-sqlite3` Vona test database                                       |
| Zova flavor            | not applicable — reusable Vona contract tests                                           |
| Executor date          | 2026-08-21                                                                              |

## Procedure

```bash
npm run vona :bin:test -- \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts \
  --flavor=normal

npm run vona :bin:test -- \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrant.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrantDepartment.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacPolicyProjection.test.ts \
  --flavor=normal

npm run tsc
npm run test
```

Formatting and lint checks were also run on the changed reusable files. The complete test command uses the repository-managed Vona test harness and clean managed SQLite state.

## Coverage

The reusable catalog/guard suites cover:

- explicit Resource and non-Resource action opt-in and undecorated exclusion;
- real no-options `Passport.rbac()` metadata, action-only decoration, and class-level rejection;
- canonical action keys and valid, missing, self, cyclic, and cross-Controller alias behavior;
- default-deny malformed, missing, denied, and action-mismatched policy states;
- request-local decision clearing before catalog miss, resolver rejection, invalid resolver result, deny, and guard fall-through;
- unrestricted adapter admission storing an action-bound `all` decision without policy resolution;
- non-empty terms for allowed data-scoped decisions;
- GuardBase default, pass-through, and reject options;
- child/request decision isolation; and
- the then-current minimal `{ key, allowed }` opaque-capability helper, rejecting predicates and Department topology.

## Expected and observed result

Pass. The reusable RBAC run reported 19 tests passed, 0 failed, and 0 skipped. The affected Start `admin-rbac` run reported 14 tests passed, 0 failed, and 0 skipped. The full Vona repository run reported 92 tests passed, 0 failed, and 3 expected PostgreSQL-only skips. Vona typecheck passed across all 14 projects/suites. Changed-file formatting and lint checks passed after formatting normalization.

The expected authorization errors emitted by the broader suites were asserted negative outcomes, not test failures. PostgreSQL-only skips are documented contention gates and do not represent failures in the managed SQLite run.

## Implementation boundary

This evidence closes the reusable contract-hardening portion of `WBS-ADM-80-01` as implementation-complete evidence for this slice. The later Resource permission projection with normalized matcher rules is outside this retained execution and is not claimed here. It does not verify the remaining Phase 80 work: Start revision/cache freshness and PostgreSQL policy contention, complete Student/Record ATP evidence, policy editor/capability UI, generated Admin contract-loop evidence, or SSR/browser acceptance. Those remain pending under `WBS-ADM-80-02` through `WBS-ADM-80-05`.

No schema, `meta.version.ts`, generated frontend artifact, or environment configuration was changed.

## Retained evidence

- [Reusable catalog/guard regression](../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts)
- [Reusable scope consumer regression](../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts)
- [Start policy regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts)
- [Start grant regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrant.test.ts)
- [Start grant Department regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrantDepartment.test.ts)
- [Policy invalidation regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts)
- [Policy projection regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacPolicyProjection.test.ts)

## Waiver

None.
