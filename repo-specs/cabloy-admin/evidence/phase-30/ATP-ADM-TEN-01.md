# ATP-ADM-TEN-01 — Active-instance isolation

## Traceability

| Field                  | Value                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-TEN-01`                                                                                                          |
| PRD                    | `PRD-ADM-SEC-*`, `PRD-ADM-UI-*`                                                                                           |
| SRS                    | `SRS-ADM-TEN-01` through `SRS-ADM-TEN-04`                                                                                 |
| WBS                    | `WBS-ADM-20-*`, `WBS-ADM-30-01`, `WBS-ADM-30-02`, `WBS-ADM-50-*`, `WBS-ADM-60-*`, `WBS-ADM-70-*`                          |
| Tested source revision | `da25284f7cd41726fc7698d04188b995890a55ac` plus uncommitted tenant-isolation implementation and retained-evidence updates |
| Database client        | managed clean `better-sqlite3` Vona test database                                                                         |
| Zova flavor            | not applicable — backend API/service scenario                                                                             |
| Executor date          | 2026-08-18                                                                                                                |

## Procedure and fixture discipline

```bash
npm run vona :bin:test -- \
  admin-user/test/user.test.ts \
  admin-role/test/role.test.ts \
  admin-role/test/systemAdminProtection.test.ts \
  admin-department/test/department.test.ts \
  admin-department/test/departmentMembership.test.ts \
  --flavor=normal
```

Each module-owned serialized scenario creates exact test-owned records in one active instance and runs foreign operations inside a separate `app.bean.executor.mockCtx(...)` with the `shareTest` instance. Cleanup removes only test-owned resources in reverse dependency order. The retained record intentionally omits credentials, fresh proofs, tokens, cookies, fixture identities, database identities, and sensitive payloads.

## Expected invariant

Foreign records are absent under the active instance. A foreign identifier must not mutate the source record, create a cross-instance Department, membership, manager, role, audit, queue, recovery, or relation association, or cause an unscoped probe merely to select a different authorization response.

A rejected protected command may record a local rejection in the caller's instance, but its audit must not retain or associate the foreign target identity and must not create session-eviction work.

## Observed result

Pass. The focused run reported 27 tests across 6 suites: 25 passed, 0 failed, and 2 PostgreSQL-only contention scenarios skipped.

- Instance-B reads, lists, PATCHes, activation changes, account-status changes, role updates, and role deletes against instance-A records observed scoped absence or the owning command's stable validation outcome; instance-A account and role state remained unchanged.
- Instance-B could not form a role relationship using an instance-A role ID. No B-local role membership was created.
- Instance-B could not view, list, traverse, PATCH, delete, move, reorder, activate, or attach a Department below an instance-A Department. The instance-A forest remained unchanged.
- Instance-B could not create or mutate foreign Department memberships, primary selection, or manager assignment. A B-local Department also rejected an instance-A user identity, and no membership relation was persisted. The A membership and manager facts remained unchanged.
- Instance-B could not scoped-read, claim, queue, recover, or dispatch instance-A protected-command audit or session-eviction records. A B protected command against an A target returned scoped absence. Its B-local rejected audit retained no target association and empty before/after state; it created no eviction work. The accepted A-side target, audit, membership, and eviction state remained intact.

Expected negative-command logs and the two PostgreSQL-only skips are asserted scenario behavior, not failures.

## Retained evidence

- [Redacted focused tenant-isolation record](./artifacts/2026-08-18-da25284-phase30-tenant-focused.md)
- [User isolation coverage](../../../../vona/src/suite/cabloy-admin/modules/admin-user/test/user.test.ts)
- [Role and protected-audit isolation coverage](../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/role.test.ts) and [protected workflow coverage](../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts)
- [Department forest isolation coverage](../../../../vona/src/suite/cabloy-admin/modules/admin-department/test/department.test.ts) and [membership/manager isolation coverage](../../../../vona/src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts)

## Remaining gates

This retained backend/API evidence establishes the scenario's current implementation proof. It does not verify Phase 20, Phase 30, Phase 60, Phase 70, or their WBS rows. `ATP-ADM-ROL-01` remains the stated Phase 30 acceptance item before broader Phase 30 closure can be considered.

## Waiver

None.
