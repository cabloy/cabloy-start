# Phase 60 Acceptance Evidence Index

This retained evidence set covers Phase 60 — Department memberships and managers. It is not a Phase 70 release decision.

## Evidence set

| ATP | WBS | Result | Tested revision | Primary retained artifact |
| --- | --- | --- | --- | --- |
| [ATP-ADM-MEM-01](./ATP-ADM-MEM-01.md) | `WBS-ADM-60-01`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log) |
| [ATP-ADM-MEM-02](./ATP-ADM-MEM-02.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log) |
| [ATP-ADM-MGR-01](./ATP-ADM-MGR-01.md) | `WBS-ADM-60-02`, `WBS-ADM-60-03` | pass | `534056c7cf59b4bde6b96abefe01cf462ec91203` | [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log) |
| [ATP-ADM-RES-01](./ATP-ADM-RES-01.md) | `WBS-ADM-60-03` | pass | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md) |
| [ATP-ADM-SSR-01](./ATP-ADM-SSR-01.md) | `WBS-ADM-60-03` | pass | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a` plus uncommitted E2E spec | [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md) |

## Supporting checks

| Check | Result | Retained artifact |
| --- | --- | --- |
| Full repository TypeScript check | pass | [TypeScript log](./artifacts/2026-08-15-534056c-tsc.log) |
| Start Admin clean tagged browser run | pass — 2 tests, 10.0 seconds | [Browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md) |
| PostgreSQL primary-membership contention | pass — 6 tests, 0 skipped | [PostgreSQL log](./artifacts/2026-08-15-534056c-primary-contention-pg.log) |

## Retention and closure state

- Evidence was captured locally on 2026-08-15 using clean test databases, PostgreSQL, Redis, and the Start Admin SSR runtime.
- Tests remove test-owned persisted resources in `finally`; retained summaries omit credentials, tokens, cookies, fixture identities, database names, and network payloads.
- The tagged browser file [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) was uncommitted when browser proof ran; the backend source revision was `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a`.
- `ATP-ADM-RES-01` passes for account-detail projections and the rendered Department Move command with its Resource/tree refresh. It does not establish browser membership, primary, manager, ordinary-role, or membership-query cache-refresh behavior, because that command surface is not currently rendered.
- Phase 60 and `WBS-ADM-60-03` remain `implementation-complete`; the successful Department Move proof does not substitute for independent closure evidence or a scope decision for the unrendered membership command surface.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
