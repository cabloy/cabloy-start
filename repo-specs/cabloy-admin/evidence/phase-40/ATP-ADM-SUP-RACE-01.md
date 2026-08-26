# ATP-ADM-SUP-RACE-01 — PostgreSQL protected-operation contention

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-SUP-RACE-01` |
| PRD | `PRD-ADM-SUP-03`, `PRD-ADM-SUP-04` |
| SRS | `SRS-ADM-TXN-01` through `SRS-ADM-TXN-04`; `SRS-ADM-NFR-02`, `SRS-ADM-NFR-03` |
| WBS | `WBS-ADM-40-03` |
| Tested revision | `3faf3d02864c678416eb6f703a52ce508acfa303` |
| Database client | `pg` (PostgreSQL) |
| Zova flavor | N/A — backend PostgreSQL transaction scenario |
| Executor date | 2026-08-13 |

## Procedure and interleaving

The test creates an activated test-owned target named `admin-system-admin-race-target-<UUID>` in the default active test instance and adds its `systemAdmin` membership. The seeded `admin` user remains the second usable administrator.

Two independently scoped `app.bean.executor.mockCtx(...)` request contexts each sign in as the seeded `admin`, issue a separate fresh proof, then wait at a two-party explicit start barrier before concurrently sending the same protected revoke request for the shared target. This is deliberate business-operation concurrency, not node:test runner parallelism. Cleanup deletes the target's eviction rows, audits, proofs, membership, and user in reverse dependency order in `finally`.

```bash
DATABASE_DEFAULT_CLIENT=pg pnpm --dir vona run vona :bin:test --module=admin-role --files=systemAdminProtection.test.ts
```

The scenario is implemented by `action:systemAdmin:preserves an administrator under PostgreSQL contention` in `vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts`.

## Expected result

- PostgreSQL locking serializes the competing authority-reduction requests.
- Exactly one revoke succeeds; the other returns the stable protected-command `409` (`admin-role:1005`).
- No test-owned target remains a usable system administrator; the seeded `admin` remains activated and retains `systemAdmin` membership.
- Durable facts are coherent: one accepted and one rejected audit and exactly one session-eviction row linked to the accepted audit.

## Observed result

Pass. The retained PostgreSQL command log identifies the `pg` dialect and reports 37 tests total, 37 passed, 0 failed, and 0 skipped. The contention test passed after both request contexts reached the explicit barrier. It asserted one `null` success, one `admin-role:1005`/`409` rejection, no remaining target membership, active seeded administrator membership, one accepted audit, one rejected audit, and one eviction record for the accepted audit.

## Retained evidence

- [Focused PostgreSQL command log](./artifacts/2026-08-13-3faf3d0-system-admin-pg.log)
- [Focused SQLite baseline log](./artifacts/2026-08-13-3faf3d0-system-admin-sqlite3.log)
- [Root regression-suite command log](./artifacts/2026-08-13-3faf3d0-root-test.log)
- [Module typecheck log](./artifacts/2026-08-13-3faf3d0-admin-role-tsc.log)
- CI job: not used.
- Screenshot: N/A.

## Waiver

None.
