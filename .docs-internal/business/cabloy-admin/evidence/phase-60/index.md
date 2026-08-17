# Phase 60 Acceptance Evidence Index

This retained evidence set covers Phase 60 — Department memberships and managers. It is not a Phase 70 release decision.

## Evidence set

| ATP                                   | WBS                              | Result | Tested revision                                                                                                                                     | Primary retained artifact                                                                                           |
| ------------------------------------- | -------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [ATP-ADM-MEM-01](./ATP-ADM-MEM-01.md) | `WBS-ADM-60-01`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                                                                          | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)                                 |
| [ATP-ADM-MEM-02](./ATP-ADM-MEM-02.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                                                                          | [PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)                               |
| [ATP-ADM-MGR-01](./ATP-ADM-MGR-01.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                                                                          | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)                                 |
| [ATP-ADM-RES-01](./ATP-ADM-RES-01.md) | `WBS-ADM-60-03`                  | pass   | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec                                                                                | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)                                 |
| [ATP-ADM-RES-02](./ATP-ADM-RES-02.md) | `WBS-ADM-60-01`–`WBS-ADM-60-03`  | pass   | `2866374e75f3b6acfec6c60afef46e23b2eec8fb` plus uncommitted DELETE-transport, generated-SDK, E2E spec, and prior Phase 60 documentation changes     | [Current Start Admin DELETE-body browser record](./artifacts/2026-08-16-2866374-start-admin-delete-body-browser.md) |
| [ATP-ADM-RES-03](./ATP-ADM-RES-03.md) | `WBS-ADM-30-02`, `WBS-ADM-60-03` | pass   | `6b34ae3f3fa434195b7a24867c70bc9aaf38257e` plus uncommitted non-system-administrator membership UI, generated contract, tests, and evidence changes | [Focused contract/test and browser record](./artifacts/2026-08-17-6b34ae3-start-admin-role-replacement-browser.md)  |
| [ATP-ADM-SSR-01](./ATP-ADM-SSR-01.md) | `WBS-ADM-60-03`                  | pass   | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec                                                                                | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)                                 |

## Supporting checks

| Check                                                 | Result                                                 | Retained artifact                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Full repository TypeScript check                      | pass                                                   | [TypeScript log](./artifacts/2026-08-15-534056c-tsc.log)                                                     |
| Current non-system-administrator role contract tests  | pass — 12 tests, 0 failed, 1 PostgreSQL-only skip      | [Focused contract/test record](./artifacts/2026-08-17-6b34ae3-start-admin-role-replacement-browser.md)       |
| Current Start Admin clean focused/tagged browser runs | pass — focused: 1 test (7.4s); tagged: 4 tests (16.7s) | [Current replacement browser record](./artifacts/2026-08-17-6b34ae3-start-admin-role-replacement-browser.md) |
| PostgreSQL primary-membership contention              | pass — 6 tests, 0 skipped                              | [PostgreSQL log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)                                   |

## Retention and closure state

- Earlier backend/API and PostgreSQL evidence was captured locally on 2026-08-15. Current Department browser evidence was captured on 2026-08-16. The new non-system-administrator membership policy passed its paired Start Admin SSR/REST build, Vona dependency synchronization, post-sync Vona typecheck, focused Role/User/protected-administrator regression tests, focused clean browser scenario (1 passed, 7.4 seconds), and tagged clean Start Admin browser suite (4 passed, 16.7 seconds) on 2026-08-17.
- Tests remove test-owned persisted resources in `finally`; retained summaries omit credentials, tokens, cookies, fixture identities, database names, and network payloads other than the non-sensitive asserted DELETE command shape.
- The tagged browser file [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) remains uncommitted during browser proof. `ATP-ADM-RES-02` records source revision `2866374e75f3b6acfec6c60afef46e23b2eec8fb` plus the current uncommitted DELETE-transport, generated-SDK, documentation, and E2E changes. `ATP-ADM-RES-03` records revision `6b34ae3f3fa434195b7a24867c70bc9aaf38257e` plus the superseding non-system-administrator membership UI, generated contract, tests, and evidence changes. The prior ordinary-role browser record is historical only and does not prove this policy revision.
- `ATP-ADM-RES-01` is revision-scoped proof for account-detail projections and rendered Department Move. `ATP-ADM-RES-02` independently proves the rendered membership, primary, and manager command surface, the atomic manager DELETE-body path, and membership-query Retry behavior. `ATP-ADM-RES-03` retains current focused contract/test and rendered User-detail proof for all-role presentation, protected `systemAdmin` labeling, `registeredUser` picker inclusion, and dedicated replacement transport.
- Phase 60 and `WBS-ADM-60-03` remain `implementation-complete` until all applicable closure evidence is retained; current focused verification does not by itself satisfy every Phase 60 or release gate.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
