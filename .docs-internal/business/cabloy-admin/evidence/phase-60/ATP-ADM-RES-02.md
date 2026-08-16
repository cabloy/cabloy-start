# ATP-ADM-RES-02 — Rendered Department membership commands and Resource refresh

## Traceability

| Field                  | Value                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-RES-02`                                                                                     |
| PRD                    | `PRD-ADM-MEM-01` through `PRD-ADM-MEM-05`; `PRD-ADM-UI-01`                                           |
| SRS                    | `SRS-ADM-MEM-01` through `SRS-ADM-MEM-05`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02`                          |
| WBS                    | `WBS-ADM-60-01` through `WBS-ADM-60-03`                                                              |
| Tested source revision | `648d1a9e0199c92a7d7263faffc9941c3acb337a` plus uncommitted SRS, test-plan, and browser-spec changes |
| Database client        | clean `better-sqlite3` E2E database                                                                  |
| Zova flavor            | Start Admin SSR (`cabloyStartAdmin`)                                                                 |
| Executor date          | 2026-08-16                                                                                           |

## Procedure

```bash
npm run build:zova:admin
npm run deps:vona
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The clean harness resets managed E2E state and starts the Start Admin SSR runtime. The browser signs in through the rendered captcha login flow. Authenticated same-origin fixture requests create and remove isolated Departments; they do not perform the actions asserted below.

On rendered Department detail, the browser creates a membership through `Add Membership`, edits its position, sets and clears the primary membership, and sets and clears the Department manager. It observes the exact custom POST, PATCH, and PUT endpoints and verifies the resulting table and manager state without a full-page navigation or reload. It records that no generic `PATCH /api/admin/department/:id` is used for manager mutations.

The browser then sets the manager again and opens the rendered manager-membership Delete confirmation. The current generated DELETE-client path produces the expected lifecycle `409`; the browser verifies the displayed error, closes it, clears the manager through the rendered dedicated Manager command, and successfully deletes the same membership through the rendered Delete command. The scenario also verifies view-versus-edit command visibility and a failed membership-query Retry path. Test-owned records are removed in reverse dependency order in `finally`, and browser page errors must be absent.

## Expected and observed result

Pass. The paired Start Admin SSR/REST build and `deps:vona` synchronization passed. The clean tagged browser suite reported 3 tests passed in 14.0 seconds, including this scenario.

The observed rendered workflow proves that the existing selector-scoped generic Department Resource remains the conventional CRUD and cache owner while the thin Department semantic facade executes custom membership commands and refreshes visible membership/manager state. The scenario does not claim that the manager Delete confirmation implicitly clears the manager: under the current generated DELETE client shape, its intended clear input is not delivered and the backend correctly rejects the operation with `409`. The separately rendered clear-manager command followed by rendered Delete completes the permitted lifecycle.

## Retained evidence

- [Redacted Start Admin browser record](./artifacts/2026-08-16-648d1a9-start-admin-browser.md)
- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Focused PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)

## Waiver

None.
