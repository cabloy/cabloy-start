# ATP-ADM-SCP-01 — Start five-scope policy resolution

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-SCP-01` |
| PRD | `PRD-ADM-SCP-01`–`PRD-ADM-SCP-04` |
| SRS | `SRS-ADM-SCP-01`–`SRS-ADM-SCP-05` |
| WBS | `WBS-ADM-80-02` |
| Tested source revision | `e8abda0d8cda44605a3500e530f123663450b99e` |
| Database client | managed clean `better-sqlite3` Vona test databases |
| Zova flavor | `normal` Vona test flavor; no frontend artifact was changed |
| Executor date | 2026-08-21 |

## Procedure

The focused scope and consumer run was executed from the repository root:

```bash
npm run vona :bin:test -- \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts \
  src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrant.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrantDepartment.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  src/suite/cabloy-admin/modules/admin-rbac/test/rbacPolicyProjection.test.ts \
  src/suite/a-training/modules/training-student/test/dataScope.test.ts \
  src/suite/a-training/modules/training-record/test/dataScope.test.ts \
  --flavor=normal
```

The same source revision was checked with:

```bash
npm run tsc
```

## Coverage

The Start `admin-rbac` scope resolver regression creates test-owned active-instance fixtures and verifies:

- `customDepartments` matches the explicitly associated enabled Department only, without implicitly including descendants;
- `ownDepartment` resolves enabled memberships;
- `ownDepartmentAndDescendants` includes enabled membership roots and recursively discovered enabled descendants;
- disabled Departments and disabled custom associations do not widen a decision;
- `mine` uses the authenticated user’s server-derived owner identity;
- multiple restricted grants are returned as independent OR terms; and
- an `all` grant dominates the restricted terms and returns an explicit `{ dataScope: 'all' }` term.

The test also verifies cleanup in reverse dependency order for grant-Department associations, grants, memberships, Departments, role memberships, roles, and users. The reusable scope consumer tests separately verify stored all decisions, restricted predicate/row application, action binding, default deny, and adapter-derived owner values.

## Expected and observed result

**Implementation-complete; local acceptance pass.** The focused run reported 37 tests passed, 0 failed, 0 cancelled, and 0 skipped. `npm run tsc` passed for Zova and all Vona projects/suites.

## Verification boundary

This record is retained evidence for the local implementation slice, not a final `verified` claim for `WBS-ADM-80-02`. The run used managed SQLite (`better-sqlite3`). It does not include PostgreSQL contention/transaction evidence or a dedicated two-database PostgreSQL scope run. The separate local Student/Record `ATP-ADM-SCP-02` record now exists, while structural AND composition and full direct external API coverage remain part of the broader Phase 80 closure work where applicable.

No schema, `meta.version.ts`, generated frontend artifact, or environment configuration was changed.

## Retained evidence

- [Start scope resolver regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts)
- [Reusable scope consumer regression](../../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts)
- [Student scope consumer regression](../../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)
- [Record scope consumer regression](../../../../../vona/src/suite/a-training/modules/training-record/test/dataScope.test.ts)
