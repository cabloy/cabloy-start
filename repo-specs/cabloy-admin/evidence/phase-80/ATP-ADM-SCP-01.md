# ATP-ADM-SCP-01 — Start five-scope policy resolution

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-SCP-01` |
| PRD | `PRD-ADM-SCP-01`–`PRD-ADM-SCP-04` |
| SRS | `SRS-ADM-SCP-01`–`SRS-ADM-SCP-05` |
| WBS | `WBS-ADM-80-02` |
| Tested source revision | historical `e8abda0d8cda44605a3500e530f123663450b99e`; direct matrix working tree based on `b28df501233b4cf540c898ae138122c7b240ee44` |
| Database client | managed clean `better-sqlite3` Vona test databases; external matrix used the worktree-managed SQLite/`better-sqlite3` Vona development runtime |
| Zova flavor | `normal` Vona test flavor; direct matrix targeted the external Start Vona HTTP API and changed no frontend artifact |
| Executor date | 2026-08-21; direct matrix 2026-08-27 |

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

## Direct external HTTP/API matrix

On 2026-08-27, the real bearer-token API matrix ran against the worktree-managed external Vona runtime at `http://127.0.0.1:7103`:

```bash
E2E_BASE_URL=http://127.0.0.1:7103 npm run test:e2e:fast cabloy-admin-rbac-api -- --tag @admin-rbac-api
```

The combined API-only run reported `3 passed (6.3s)`. This ATP's direct matrix verifies all five scopes, restricted-term union, `all` dominance, custom Department mappings, descendant and ownership terms, disabled/unmapped behavior, and caller-filter structural AND composition. It uses test-owned accounts whose usernames begin with `e2e-fixture-admin-rbac-` and deterministic reverse-order cleanup.

## Verification boundary

The historical local implementation slice and the direct HTTP/API matrix now provide traceable API acceptance for this ATP, but they do not make `WBS-ADM-80-02` or Phase 80 `verified`. The current runtime-Swagger regeneration output drift remains unclassified, and repository-wide lint and format gates remain non-clean and unwaived. This SQLite external matrix does not replace a future PostgreSQL-specific scope/contention proof if the relevant contract requires one. `WBS-ADM-80-05` and Phase 70 remain open.

No schema, `meta.version.ts`, generated frontend artifact, or environment configuration was changed by this direct matrix.

## Retained evidence

- [Direct external HTTP/API matrix validation](./artifacts/2026-08-27-b28df50-direct-http-api-matrices.md)
- [API-only matrix specification](../../../../repo-e2e/specs/cabloy-admin-rbac-api.spec.ts)
- [External HTTP fixture helpers](../../../../repo-e2e/specs/helpers/cabloy-admin-api.ts)
- [Start scope resolver regression](../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacScope.test.ts)
- [Reusable scope consumer regression](../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacScopeCurrent.test.ts)
- [Student scope consumer regression](../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)
- [Record scope consumer regression](../../../../vona/src/suite/a-training/modules/training-record/test/dataScope.test.ts)
