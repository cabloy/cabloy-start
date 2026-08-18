# ATP-ADM-RES-02 — Rendered Department membership commands and Resource refresh

## Traceability

| Field                  | Value                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-RES-02`                                                                                                                                    |
| PRD                    | `PRD-ADM-MEM-01` through `PRD-ADM-MEM-05`; `PRD-ADM-UI-01`                                                                                          |
| SRS                    | `SRS-ADM-MEM-01` through `SRS-ADM-MEM-05`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02`                                                                         |
| WBS                    | `WBS-ADM-60-01` through `WBS-ADM-60-03`                                                                                                             |
| Tested source revision | `2866374e75f3b6acfec6c60afef46e23b2eec8fb` plus uncommitted DELETE-transport, generated-SDK, browser-spec, and prior Phase 60 documentation changes |
| Database client        | clean `better-sqlite3` E2E database                                                                                                                 |
| Zova flavor            | Start Admin SSR (`cabloyStartAdmin`)                                                                                                                |
| Executor date          | 2026-08-16                                                                                                                                          |

## Procedure

```bash
npm run build:zova:admin
npm run deps:vona
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The clean harness resets managed E2E state and starts the Start Admin SSR runtime. The browser signs in through the rendered captcha login flow. Authenticated same-origin fixture requests create and remove isolated Departments; they do not perform the actions asserted below. The tagged clean suite was re-run on 2026-08-18 for the current authorization-test revision.

On rendered Department detail, the browser creates a membership through `Add Membership`, edits its position, sets and clears the primary membership, and sets and clears the Department manager. It observes the exact custom POST, PATCH, and PUT endpoints and verifies the resulting table and manager state without a full-page navigation or reload. It records that no generic `PATCH /api/admin/department/:id` is used for manager mutations.

The browser then sets the manager again and opens the rendered manager-membership Delete confirmation. It captures the successful real HTTP DELETE request and asserts its exact JSON body is `{ managerMembershipId: null }`. The existing transactional lifecycle service atomically clears the manager and deletes the membership; the browser verifies the neutral manager state and removed row without any dedicated manager-clear `PUT`, navigation, or reload. The scenario also verifies view-versus-edit command visibility and a failed membership-query Retry path. Test-owned records are removed in reverse dependency order in `finally`, and browser page errors must be absent.

## Expected and observed result

Pass. Scoped Admin Department OpenAPI generation from live Swagger, the paired Start Admin SSR/REST build, `deps:vona` synchronization, and the full Zova/Vona TypeScript check passed. The focused backend membership suite reported 5 passed, 0 failed, and 1 PostgreSQL-only skipped test. The prior clean focused browser scenario reported 1 passed in 9.8 seconds; the current 2026-08-18 clean tagged browser suite reported 4 tests passed in 21.7 seconds, including this scenario.

The observed rendered workflow proves that the existing selector-scoped generic Department Resource remains the conventional CRUD and cache owner while the thin Department semantic facade executes custom membership commands and refreshes visible membership/manager state. The generated Zova SDK accepts a DELETE command body as its first argument and uses Axios configuration `data`; Vona now parses DELETE bodies by default. The browser proof confirms that the manager Delete confirmation delivers its intended clear input and that the existing backend lifecycle service atomically clears the manager before deleting the membership.

## Retained evidence

- [Current redacted Start Admin browser record](./artifacts/2026-08-18-26c11a7-start-admin-browser.md)
- [Prior redacted Start Admin DELETE-body browser record](./artifacts/2026-08-16-2866374-start-admin-delete-body-browser.md)
- [Historical redacted Start Admin browser record](./artifacts/2026-08-16-648d1a9-start-admin-browser.md)
- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Focused PostgreSQL contention log](./artifacts/2026-08-15-534056c-primary-contention-pg.log)

## Waiver

None.
