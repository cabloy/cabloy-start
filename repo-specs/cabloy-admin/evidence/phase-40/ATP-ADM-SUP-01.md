# ATP-ADM-SUP-01 — Protected command, fresh proof, audit, and session eviction

## Traceability

| Field           | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| ATP             | `ATP-ADM-SUP-01`                                                                     |
| PRD             | `PRD-ADM-SUP-01` through `PRD-ADM-SUP-04`                                            |
| SRS             | `SRS-ADM-SUP-01` through `SRS-ADM-SUP-04`; `SRS-ADM-AUD-01` through `SRS-ADM-AUD-03` |
| WBS             | `WBS-ADM-40-01`, `WBS-ADM-40-02`                                                     |
| Tested revision | `3faf3d02864c678416eb6f703a52ce508acfa303`                                           |
| Database client | `sqlite3` (`better-sqlite3`)                                                         |
| Zova flavor     | N/A — backend API/integration scenario                                               |
| Executor date   | 2026-08-13                                                                           |

## Procedure and fixtures

The test suite uses the default active test instance and the seeded `admin` system administrator. It creates an activated test-owned target named `admin-system-admin-target-<UUID>`, runs protected API actions through `app.bean.executor.mockCtx(...)`, and deletes its session-eviction rows, audits, proofs, role membership, and user in `finally`.

```bash
DATABASE_DEFAULT_CLIENT=sqlite3 pnpm --dir vona run vona :bin:test --module=admin-role --files=systemAdminProtection.test.ts
```

The scenario is implemented by `action:systemAdmin:requires and consumes fresh proof` and supported by `service:systemAdmin:recovers durable session-eviction work` in `vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts`.

## Expected result

- A protected grant requires a purpose-bound fresh proof, accepts one valid proof once, and rejects absent or replayed proof.
- Accepted and rejected commands retain redacted audit data; no raw proof appears in an audit serialization.
- An accepted protected mutation creates durable pending session-eviction work, and the worker can dispatch it after commit.
- Invalid whitespace-only reasons are rejected after proof consumption with the selected `422` validation error.

## Observed result

Pass. The retained command log reports 37 tests total, 36 passed, 0 failed, and 1 skipped PostgreSQL-only contention test. The relevant test asserts the accepted grant, two rejected attempts, proof-method-only audit metadata, raw-proof exclusion, normalized reason, a pending eviction record, and the protected reason `422`. The durable-worker test verifies dispatched state, retry release, expired-lease recovery, and terminal failure handling with a fixed safe error summary.

## Retained evidence

- [Focused SQLite command log](./artifacts/2026-08-13-3faf3d0-system-admin-sqlite3.log)
- [Root regression-suite command log](./artifacts/2026-08-13-3faf3d0-root-test.log)
- [Module typecheck log](./artifacts/2026-08-13-3faf3d0-admin-role-tsc.log)
- CI job: not used.
- Screenshot: N/A.

## Waiver

None.
