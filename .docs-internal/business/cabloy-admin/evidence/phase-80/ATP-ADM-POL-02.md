# ATP-ADM-POL-02 — Start policy admission and invalidation

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-POL-02` |
| PRD | `PRD-ADM-POL-02`, `PRD-ADM-POL-04`, `PRD-ADM-SCP-01` |
| SRS | `SRS-ADM-POL-04`–`SRS-ADM-POL-08` |
| WBS | `WBS-ADM-80-02` |
| Tested source revision | `e8abda0d8cda44605a3500e530f123663450b99e` |
| Database client | managed clean `better-sqlite3` Vona test databases |
| Zova flavor | `normal` Vona test flavor; no frontend artifact was changed |
| Executor date | 2026-08-21 |

## Procedure

The focused RBAC and downstream-consumer run was executed from the repository root:

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

The retained focused tests cover the ATP policy-admission boundary:

- an adapter-defined unrestricted subject receives an action-bound `all` decision without dynamic policy resolution;
- anonymous callers and protected policy-control operations are rejected by the independent authentication/system-administrator boundaries;
- absent, disabled, unavailable, and incompatible grants deny rather than widen authority;
- valid grant decisions retain the canonical action identity and supported scope terms;
- policy catalog and role-configuration projections expose safe metadata only;
- a committed `policyInvalidated` event increments the active-instance policy revision and clears coarse permission projections after commit;
- a rolled-back invalidation leaves both the revision and projection cache-clear count unchanged; and
- revision rows remain isolated by active Vona instance.

The grant and Department-association services use transactional ORM mutation paths and publish invalidation only after successful mutation. The cache audit found no raw SQL or alternate write path for the policy-source models. Vona ORM mutation invalidation therefore clears the relevant entity/query caches; no separate memoized RBAC decision cache exists in this implementation.

## Expected and observed result

**Implementation-complete; local acceptance pass.** The focused run reported 37 tests passed, 0 failed, 0 cancelled, and 0 skipped. `npm run tsc` passed for Zova and all Vona projects/suites.

The expected `401`, `403`, `422`, and duplicate/conflict errors emitted during negative tests were asserted outcomes, not test failures.

## Verification boundary

This record is retained evidence for the local implementation slice, not a final `verified` claim for `WBS-ADM-80-02`. The run used managed SQLite (`better-sqlite3`). It does not include PostgreSQL contention/transaction evidence, direct external API acceptance for every policy mutation path, or SSR/browser policy-editor evidence. Those remain open under `WBS-ADM-80-02`, `WBS-ADM-80-04`, and `WBS-ADM-80-05`.

No schema, `meta.version.ts`, generated frontend artifact, or environment configuration was changed.

## Retained evidence

- [RBAC catalog and guard regression](../../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts)
- [Start grant regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrant.test.ts)
- [Start grant Department regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacGrantDepartment.test.ts)
- [Policy invalidation regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts)
- [Policy projection regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/rbacPolicyProjection.test.ts)
