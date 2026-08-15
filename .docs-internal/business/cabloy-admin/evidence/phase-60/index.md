# Phase 60 Acceptance Evidence Index

This retained evidence set covers Phase 60 — Department memberships and managers. It is not a Phase 70 release decision.

## Evidence set

| ATP | WBS | Result | Tested revision | Primary retained artifact |
| --- | --- | --- | --- | --- |
| [ATP-ADM-MEM-01](./ATP-ADM-MEM-01.md) | `WBS-ADM-60-01`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log) |
| [ATP-ADM-MEM-02](./ATP-ADM-MEM-02.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log) |
| [ATP-ADM-MGR-01](./ATP-ADM-MGR-01.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log) |
| [ATP-ADM-RES-01](./ATP-ADM-RES-01.md) | `WBS-ADM-60-03` | partial | `534056c7cf59b4bde6b96abefe01cf462ec91203` plus uncommitted E2E spec | [Start Admin browser log](./artifacts/2026-08-15-534056c-start-admin-browser.log) |
| [ATP-ADM-SSR-01](./ATP-ADM-SSR-01.md) | `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` plus uncommitted E2E spec | [Start Admin browser log](./artifacts/2026-08-15-534056c-start-admin-browser.log) |

## Supporting checks

| Check | Result | Retained artifact |
| --- | --- | --- |
| Full repository TypeScript check | pass | [TypeScript log](./artifacts/2026-08-15-534056c-tsc.log) |
| Start Admin clean tagged browser run | pass — 2 tests | [Browser log](./artifacts/2026-08-15-534056c-start-admin-browser.log) |
| PostgreSQL primary-membership contention | pass — 6 tests, 0 skipped | [PostgreSQL log](./artifacts/2026-08-15-534056c-primary-contention-pg.log) |

## Retention and closure state

- Evidence was captured locally on 2026-08-15 using clean test databases, PostgreSQL, Redis, and the Start Admin SSR runtime.
- Tests remove test-owned persisted resources in `finally`; retained summaries omit credentials, tokens, cookies, fixture identities, database names, and network payloads.
- The tagged browser file [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) was uncommitted when browser proof ran; the backend source revision was `534056c7cf59b4bde6b96abefe01cf462ec91203`.
- `ATP-ADM-RES-01` remains partial: it proves Resource navigation, account-detail projections, and Department Create entry, but cannot prove an actual browser custom membership/primary/manager/role command or cache refresh because that command surface is not currently rendered.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
