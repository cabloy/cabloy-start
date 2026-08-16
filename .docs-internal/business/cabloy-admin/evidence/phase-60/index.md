# Phase 60 Acceptance Evidence Index

This retained evidence set covers Phase 60 — Department memberships and managers. It is not a Phase 70 release decision.

## Evidence set

| ATP                                   | WBS                              | Result | Tested revision                                                                                  | Primary retained artifact                                                                   |
| ------------------------------------- | -------------------------------- | ------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [ATP-ADM-MEM-01](./ATP-ADM-MEM-01.md) | `WBS-ADM-60-01`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                       | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)         |
| [ATP-ADM-MEM-02](./ATP-ADM-MEM-02.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                       | [PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)       |
| [ATP-ADM-MGR-01](./ATP-ADM-MGR-01.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass   | `534056c7cf59b4bde6b96abefe01cf462ec91203`                                                       | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)         |
| [ATP-ADM-RES-01](./ATP-ADM-RES-01.md) | `WBS-ADM-60-03`                  | pass   | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec                             | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)         |
| [ATP-ADM-RES-02](./ATP-ADM-RES-02.md) | `WBS-ADM-60-01`–`WBS-ADM-60-03`  | pass   | `648d1a9e0199c92a7d7263faffc9941c3acb337a` plus uncommitted SRS, test-plan, and E2E spec changes | [Current Start Admin browser record](./artifacts/2026-08-16-648d1a9-start-admin-browser.md) |
| [ATP-ADM-SSR-01](./ATP-ADM-SSR-01.md) | `WBS-ADM-60-03`                  | pass   | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec                             | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)         |

## Supporting checks

| Check                                    | Result                       | Retained artifact                                                               |
| ---------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| Full repository TypeScript check         | pass                         | [TypeScript log](./artifacts/2026-08-15-534056c-tsc.log)                        |
| Start Admin clean tagged browser run     | pass — 3 tests, 14.0 seconds | [Current browser record](./artifacts/2026-08-16-648d1a9-start-admin-browser.md) |
| PostgreSQL primary-membership contention | pass — 6 tests, 0 skipped    | [PostgreSQL log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)      |

## Retention and closure state

- Earlier backend/API and PostgreSQL evidence was captured locally on 2026-08-15. Current browser evidence was captured on 2026-08-16 after the paired Start Admin SSR/REST build and Vona dependency synchronization, using clean managed E2E databases and the Start Admin SSR runtime.
- Tests remove test-owned persisted resources in `finally`; retained summaries omit credentials, tokens, cookies, fixture identities, database names, and network payloads.
- The tagged browser file [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) remained uncommitted during each browser proof. `ATP-ADM-RES-02` records source revision `648d1a9e0199c92a7d7263faffc9941c3acb337a` plus the current uncommitted documentation and E2E changes.
- `ATP-ADM-RES-01` is revision-scoped proof for account-detail projections and rendered Department Move. `ATP-ADM-RES-02` independently proves the currently rendered membership, primary, and manager command surface and membership-query Retry behavior; it still does not establish ordinary-role replacement UI.
- Phase 60 and `WBS-ADM-60-03` remain `implementation-complete` until all applicable closure evidence is retained; the new browser evidence closes the former rendered-membership-command gap but does not by itself satisfy every Phase 60 or release gate.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
