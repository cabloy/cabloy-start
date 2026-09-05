# Phase 90 Focused Validation — redacted

## Execution identity

| Field                   | Observed value                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Suite / WBS             | Cabloy Admin / `WBS-ADM-90-07`                                                                                        |
| Source revision         | `f84ca8e6f7d7ccd445c915f337d6987fc87134d0`                                                                            |
| Working tree            | Dirty, test-only scope: E2E spec plus extracted `admin-menu` test files; `roleMenuAuthorization.test.ts` is untracked |
| Edition / flavor        | Cabloy Start / Vona `normal`, Start Admin SSR browser runtime                                                         |
| Database classification | Managed local better-sqlite3 test databases; no clean E2E runner or explicit database-reset command was used          |
| Browser target          | Managed local fast-E2E runtime at `http://127.0.0.1:7202`                                                             |
| Secret handling         | Server startup tokens, fixture usernames, and mail-preview URLs were omitted from this retained record                |

## Procedures and observed results

```bash
./node_modules/.bin/oxfmt --check \
  repo-e2e/specs/cabloy-admin.spec.ts \
  vona/src/suite/cabloy-admin/modules/admin-menu/test/roleMenu.test.ts \
  vona/src/suite/cabloy-admin/modules/admin-menu/test/roleMenuProjection.test.ts \
  vona/src/suite/cabloy-admin/modules/admin-menu/test/roleMenuAuthorization.test.ts
# pass

git diff --check
# pass

npm run vona -- :bin:test --flavor=normal \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuAuthorization.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuProjection.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenu.test.ts
# pass — 17 tests, 17 passed, 0 failed

npm run test:e2e:fast -- cabloy-admin --grep 'ATP-ADM-MNU-(06|07|08)'
# pass — 4 tests, 4 passed
```

The browser procedure exercised the existing serial Admin suite. It created isolated Role and account fixtures and restored/deleted them in `finally`. Expected `403` responses in the MNU-06 direct-API denial matrix were observed and asserted; they are not failures.

## Coverage reconciliation

- MNU-01: protected `admin-menu` controller admission matrix for anonymous, inactive, ordinary, and `systemAdmin` callers.
- MNU-02 and MNU-03: public/dynamic/static visibility semantics, role union, association removal, no implicit `systemAdmin` bypass, and empty-group elision.
- MNU-04: exact final-leaf/site validation, omitted-site addressability, retired identities, active-instance isolation, concurrent idempotency, datasource isolation, and Role-deletion cleanup.
- MNU-05: public menu projection redaction for anonymous, dynamic-role, and static-role callers.
- MNU-06: surviving/deleted menu association does not authorize disclosed Student or guessed Record direct API calls, in Vona and an authenticated browser session.
- MNU-07: current role-holder Role-menu mutation and rendered ordinary-role replacement reload the subject browser and produce a fresh Passport state; unrelated Role/user mutations do not reload that browser, and a separate browser receives no push.
- MNU-08: Role View SSR/hydration, Menu Authorization composition, configuration refetch, exact safe leaf mutation, public display-only presentation, and group bulk-toggle payloads containing configurable descendant leaves rather than a persisted group identity.

## Boundary and disposition

This evidence closes the scoped test-only ATP procedure for `WBS-ADM-90-07`. It does not run the successor `WBS-ADM-100-03` contract loop, paired build, dependency handoff, full regression, or `ATP-ADM-MNU-09`; therefore it supports `implementation-complete`, not Phase 90 final verification.
