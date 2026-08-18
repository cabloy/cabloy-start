# ATP-ADM-RES-03 — Rendered User non-system-administrator membership replacement and Resource refresh

## Traceability

| Field                  | Value                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-RES-03`                                                                                                                                          |
| PRD                    | `PRD-ADM-ROL-01` through `PRD-ADM-ROL-03`; `PRD-ADM-UI-01`                                                                                                |
| SRS                    | `SRS-ADM-USR-06`; `SRS-ADM-ROL-04` through `SRS-ADM-ROL-07`; `SRS-ADM-UI-01`, `SRS-ADM-UI-02`                                                             |
| WBS                    | `WBS-ADM-30-02`; `WBS-ADM-60-03`                                                                                                                          |
| Tested source revision | `6b34ae3f3fa434195b7a24867c70bc9aaf38257e` plus uncommitted non-system-administrator membership UI, generated contract, test, and evidence-record changes |
| Database client        | clean `better-sqlite3` E2E database                                                                                                                       |
| Zova flavor            | Start Admin SSR (`cabloyStartAdmin`)                                                                                                                      |
| Executor date          | 2026-08-17                                                                                                                                                |

## Procedure

```bash
npm run build:zova:admin
npm run deps:vona
pnpm --dir vona run tsc -- --pretty false
pnpm --dir vona run vona :bin:test -- --flavor=normal \
  src/suite/cabloy-admin/modules/admin-role/test/role.test.ts \
  src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts \
  src/suite/cabloy-admin/modules/admin-user/test/user.test.ts
npm run test:e2e:start:clean -- --grep 'ATP-ADM-RES-03'
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The clean harness resets managed E2E state and starts the Start Admin SSR runtime. The browser signs in through the rendered captcha login flow. Authenticated same-origin fixture requests read the target account's initial non-system-administrator role IDs, create and remove one isolated custom Role, and restore those non-system-administrator IDs in `finally`; they do not perform the command asserted below. The tagged clean suite was re-run on 2026-08-18 for the current authorization-test revision.

On rendered User detail, the browser verifies that all role memberships are present, including the protected `systemAdmin` row. It verifies that the row carries the protected presentation label and that the view-only `Replace Non-System-Administrator Roles` collection action is available. It opens the modal, verifies that the generated picker includes `Registered User` but omits `System Administrator`, selects the isolated custom Role, and observes the dedicated replacement request. The test asserts the complete submitted non-system-administrator ID set and confirms that `systemAdmin` is absent. It verifies that the modal closes and the Roles relation contains the selected Role without navigation or reload, confirms no generic User PATCH occurs, and verifies that the action is absent from the User edit scene.

Focused backend coverage independently proves fixed definition protection for both framework roles, `registeredUser` membership add/remove, server-enforced candidate exclusion of `systemAdmin` even under a conflicting caller filter, atomic generic rejection of a submitted `systemAdmin`, and continued dedicated protected-workflow behavior.

## Expected and observed result

Focused backend proof passed on 2026-08-17: 12 passed, 0 failed, 1 PostgreSQL-only contention test skipped under SQLite. The run includes `role.test.ts`, `systemAdminProtection.test.ts`, and `user.test.ts`; it proves the separated definition and membership semantics without changing the protected-system-administrator workflow.

The required paired Start Admin SSR/REST build, Vona dependency synchronization, post-sync Vona TypeScript check, and clean browser scenarios passed on this source revision. The focused `ATP-ADM-RES-03` run reported 1 passed in 7.4 seconds. The current 2026-08-18 tagged `@cabloy-admin` clean suite reported 4 passed in 21.7 seconds, including `ATP-ADM-RES-03`; the prior ordinary-role browser record remains superseded and is not proof of this policy revision.

The rendered workflow keeps the existing User Resource as the item-query cache owner. The action uses the existing Role model semantic mutation, which delegates through the existing Role Resource and invalidates only the affected User item. The generated request schema renders the membership-candidate Resource picker; neither the controller nor the browser test adds a second membership read/cache owner or a generic User role field. Picker exclusion is a convenience backed by the selector and replacement endpoint's server-authoritative protection.

## Retained evidence

- [Current redacted Start Admin browser record](./artifacts/2026-08-18-26c11a7-start-admin-browser.md)
- [Prior redacted Start Admin non-system-administrator membership browser record](./artifacts/2026-08-17-6b34ae3-start-admin-role-replacement-browser.md)
- Focused Vona test command/result and clean focused/tagged browser outcomes are recorded in this ATP.

## Waiver

None.
