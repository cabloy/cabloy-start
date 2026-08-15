# ATP-ADM-RES-01 — Start Admin Resource projection and entry

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-RES-01` |
| PRD | `PRD-ADM-UI-01`; `PRD-ADM-MEM-01` through `PRD-ADM-MEM-05` |
| SRS | `SRS-ADM-MEM-01` through `SRS-ADM-MEM-05`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02` |
| WBS | `WBS-ADM-60-03` |
| Tested backend revision | `534056c7cf59b4bde6b96abefe01cf462ec91203` |
| Browser-test source | uncommitted [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) |
| Database client | clean `better-sqlite3` E2E database |
| Zova flavor | Start Admin SSR |
| Executor date | 2026-08-15 |

## Procedure

```bash
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The clean harness resets managed E2E state and starts the Start Admin SSR runtime. The browser signs in through the rendered captcha login flow, opens the seeded account detail route, verifies its `Roles` and `Department Memberships` projections, opens the empty Department Resource, and verifies that the generic Create entry renders the `Department Name` control. The test records browser page errors and requires none.

## Expected and observed result

Partial pass. The tagged run reports 2 tests passed. It proves that the existing Admin Resource owner renders the account detail projection and that the Department Resource remains reachable through its generic Create entry.

This ATP's test-plan procedure also calls for a custom Department or role command. The current browser UI does not render membership, primary, manager, role, or cache-refresh command controls, so this record does **not** claim that unobservable browser behavior. The backend API, model-façade, cache-owner, and PostgreSQL behaviors remain covered by the other Phase 60 records; the missing rendered custom-command evidence remains the closure gap.

## Retained evidence

- [Start Admin browser log](./artifacts/2026-08-15-534056c-start-admin-browser.log)
- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Focused PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)

## Waiver

None.
