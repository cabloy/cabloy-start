# ATP-ADM-USR-01 — Account projection and ordinary lifecycle

## Traceability

| Field                  | Value                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-USR-01`                                                                                   |
| PRD                    | `PRD-ADM-USR-*`                                                                                    |
| SRS                    | `SRS-ADM-USR-01` through `SRS-ADM-USR-06`; `SRS-ADM-TEN-*`; `SRS-ADM-AUT-*`                        |
| WBS                    | `WBS-ADM-30-01`                                                                                    |
| Tested source revision | `26c11a76f85969a071757a02089f03665a45ed9f` plus uncommitted User ATP and retained-evidence updates |
| Database client        | managed clean `better-sqlite3` Vona test database                                                  |
| Zova flavor            | not applicable — backend API/service scenario                                                      |
| Executor date          | 2026-08-18                                                                                         |

## Procedure and fixtures

```bash
npm run vona :bin:test -- \
  admin-user/test/user.test.ts \
  admin-role/test/systemAdminProtection.test.ts \
  --flavor=normal
```

The serialized User suite creates exact test-owned ordinary accounts in the default active test instance and removes role memberships before removing those users in `finally`. It uses separate `app.bean.executor.mockCtx(...)` boundaries for caller state and cross-instance checks. The separate protected-workflow suite owns its temporary protected target, fresh-proof, audit, session-eviction, and membership cleanup.

## Expected result

- Account list and view use intentional active-instance operational projections rather than entity-shaped identity output.
- Generic profile PATCH changes exactly the allowlisted `avatar`, `email`, `mobile`, `locale`, and `tz` fields; identity, credential-shaped, and lifecycle-shaped input does not change protected facts.
- Ordinary accounts can use named activation and account-status commands; duplicate email conflict, anonymous access, ordinary-caller access, and cross-instance access have stable outcomes.
- The generic User account-status path must not deactivate a `systemAdmin` target.
- The distinct `admin-role` fresh-proof workflow remains the permitted protected lifecycle path.

## Observed result

Pass. The focused run reported 9 tests across 3 suites: 8 passed, 0 failed, and 1 PostgreSQL-only protected-contention case skipped. The User scenario proved deliberate list/view projection keys; all five allowlisted profile fields; ignored `name`, credential-shaped, and lifecycle-shaped generic PATCH input; duplicate-email `409`; named ordinary activation; ordinary disabled/active transitions; anonymous `401`; ordinary-user `403`; and cross-instance absence.

The generic User account-status request against the seeded protected account returned `admin-user:1002` with HTTP `409`; the subsequent read confirmed that account remained active. This ATP does not claim generic-to-protected transparent delegation. The same retained command separately regression-covers the dedicated `admin-role` fresh-proof protected workflow; authoritative protected-command acceptance remains [Phase 40 evidence](../phase-40/index.md).

Expected rejected authorization and protected-workflow inputs were asserted test outcomes, not test failures.

## Retained evidence

- [Redacted focused User and protected-workflow record](./artifacts/2026-08-18-26c11a7-phase30-user-focused.md)
- [User module acceptance suite](../../../../../vona/src/suite/cabloy-admin/modules/admin-user/test/user.test.ts)
- [Protected-workflow regression suite](../../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts)

## Remaining gates

`ATP-ADM-ROL-01` and `ATP-ADM-TEN-01` remain outstanding. This record alone does not change Phase 30 or `WBS-ADM-30-01` from `implementation-complete` to `verified`.

## Waiver

None.
