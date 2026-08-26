# ATP-ADM-RES-01 — Start Admin Resource projection and Department Move refresh

## Traceability

| Field                   | Value                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| ATP                     | `ATP-ADM-RES-01`                                                                               |
| PRD                     | `PRD-ADM-UI-01`; `PRD-ADM-MEM-01` through `PRD-ADM-MEM-05`                                     |
| SRS                     | `SRS-ADM-MEM-01` through `SRS-ADM-MEM-05`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02`                    |
| WBS                     | `WBS-ADM-60-03`                                                                                |
| Tested backend revision | `603cb4cfb9fd1c0fe08d14bb72804c0e82ba766a`                                                     |
| Current browser-test source | tracked [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-admin.spec.ts)              |
| Database client         | clean `better-sqlite3` E2E database                                                            |
| Zova flavor             | Start Admin SSR                                                                                |
| Executor date           | 2026-08-15                                                                                     |

## Procedure

```bash
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

The historical two-test result below was captured before the unified runner and flat spec layout. The command above is the current rerun equivalent.

The clean harness resets managed E2E state and starts the Start Admin SSR runtime. The browser signs in through the rendered captcha login flow and opens the seeded account detail route to verify its `Roles` and `Department Memberships` projections. It then creates isolated test-owned Department roots and a child through authenticated same-origin browser fixture requests, opens the Department `presetResource`, and invokes the visible `Move Department` row action for that child. In the rendered dialog it chooses the second root and submits the rendered command, while observing the successful Department Move response. Without a full-page reload, it selects each root in the rendered Department tree and verifies that the child has left the original root's table and appears in the destination root's table. Test-owned records are removed in reverse dependency order in `finally`; browser page errors are collected and must be absent.

## Expected and observed result

Pass. The tagged run reports 2 tests passed in 10.0 seconds. It proves that the existing Admin Resource owner renders the account detail projections, the Department `presetResource` exposes the rendered `Move Department` custom command, and a successful visible move refreshes the Department tree/list state: the child is absent under its old parent and visible under its new parent without a full-page reload.

Fixture requests only arrange and remove isolated test data; they are not evidence of a rendered command. This record proves the Department Resource/tree refresh path at the tested 2026-08-15 revision, not membership-specific behavior. Its statement that membership, primary, and manager controls were unrendered is revision-scoped: the current rendered command coverage is retained separately in [ATP-ADM-RES-02](./ATP-ADM-RES-02.md). Ordinary-role replacement UI remains outside that newer browser scenario. The backend API, model-façade, cache-owner, and PostgreSQL behaviors remain covered by the other Phase 60 records.

## Retained evidence

- [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)
- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Focused PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)

## Waiver

None.
