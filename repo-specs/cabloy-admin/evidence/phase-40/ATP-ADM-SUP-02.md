# ATP-ADM-SUP-02 — Final-administrator invariant and rollback

## Traceability

| Field           | Value                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| ATP             | `ATP-ADM-SUP-02`                                                              |
| PRD             | `PRD-ADM-SUP-03`, `PRD-ADM-SUP-04`                                            |
| SRS             | `SRS-ADM-TXN-01` through `SRS-ADM-TXN-03`; `SRS-ADM-AUD-01`, `SRS-ADM-AUD-02` |
| WBS             | `WBS-ADM-40-02`                                                               |
| Tested revision | `3faf3d02864c678416eb6f703a52ce508acfa303`                                    |
| Database client | `sqlite3` (`better-sqlite3`)                                                  |
| Zova flavor     | N/A — backend transaction/API scenario                                        |
| Executor date   | 2026-08-13                                                                    |

## Procedure and fixtures

The test suite signs into the seeded `admin` user, the final activated `systemAdmin` in the active test instance. It executes each request within a scoped `app.bean.executor.mockCtx(...)` boundary. Audit rows created for this seeded fixture are scoped by command and reason and are not treated as permanent test fixtures; all test-owned user records in companion cases are deleted in `finally`.

```bash
DATABASE_DEFAULT_CLIENT=sqlite3 pnpm --dir vona run vona :bin:test --module=admin-role --files=systemAdminProtection.test.ts
```

The scenario is implemented by `action:systemAdmin:rolls back rejected protected mutations and retains audit evidence` and `action:systemAdmin:preserves final usable administrator` in `vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts`.

## Expected result

- A revoke, deactivate, or equivalent authority-loss command that would remove the final usable system administrator fails with stable `409`.
- The rejected mutation leaves user activation, account status, and protected membership unchanged.
- Rejected audit evidence survives the rolled-back protected mutation; it contains coherent identical before/after protected state.
- Rejected commands create no session-eviction work; accepted commands retain durable eviction/recovery behavior.

## Observed result

Pass. The retained command log reports 37 tests total, 36 passed, 0 failed, and 1 skipped PostgreSQL-only contention test. The rollback test asserts `admin-role:1006`, preserves the seeded administrator's user and membership facts, records one rejected deactivation audit with unchanged before/after state, and finds no outbox row for that rejected audit. The final-administrator test separately asserts stable `409` and preserved membership. The durable-worker assertions in the same focused suite cover dispatch, retry, lease recovery, and exhaustion without persisting downstream error details.

## Retained evidence

- [Focused SQLite command log](./artifacts/2026-08-13-3faf3d0-system-admin-sqlite3.log)
- [Root regression-suite command log](./artifacts/2026-08-13-3faf3d0-root-test.log)
- [Module typecheck log](./artifacts/2026-08-13-3faf3d0-admin-role-tsc.log)
- CI job: not used.
- Screenshot: N/A.

## Waiver

None.
