# ATP-ADM-AUT-01 — Direct external Cabloy Admin API authorization

## Traceability

| Field                  | Value                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ATP                    | `ATP-ADM-AUT-01`                                                                                                   |
| PRD                    | `PRD-ADM-SEC-*`; `PRD-ADM-UI-*`                                                                                    |
| SRS                    | `SRS-ADM-AUT-*`                                                                                                    |
| WBS                    | `WBS-ADM-20-02`                                                                                                    |
| Tested source revision | `26c11a76f85969a071757a02089f03665a45ed9f` plus the uncommitted authorization suites and retained evidence updates |
| Database client        | managed clean `better-sqlite3` Vona test database                                                                  |
| Zova flavor            | not applicable — direct Vona action/API acceptance                                                                 |
| Executor date          | 2026-08-18                                                                                                         |

## Procedure

```bash
npm run vona :bin:test -- \
  admin-user/test/authorization.test.ts \
  admin-role/test/authorization.test.ts \
  admin-department/test/authorization.test.ts \
  --flavor=normal
```

The three module-owned, serialized `vona-mock` suites establish each caller state in an independent `app.bean.executor.mockCtx(...)` context and invoke every exposed Phase 1 Cabloy Admin controller action with `app.bean.executor.performAction(...)` and `innerAccess: false`.

The matrix covers 32 actions:

- User: 5 actions;
- Role: 12 actions;
- Department: 15 actions.

For each action, the suites assert the following direct external outcomes:

| Caller                                           | Expected result                       |
| ------------------------------------------------ | ------------------------------------- |
| Anonymous                                        | `401`                                 |
| Registered but unactivated account               | `403`                                 |
| Activated ordinary account without `systemAdmin` | `403`                                 |
| Seeded active `systemAdmin`                      | endpoint-specific successful response |

State-changing positive rows use isolated test-owned fixtures. Each suite signs out callers in `finally` and removes exact test-owned rows in a final fresh scoped context, in reverse dependency order. Role fresh-proof cleanup uses only hashes of proofs issued by the suite, so shared seeded administrator data is not broadly removed.

## Expected and observed result

Pass. The focused run initialized managed Vona test state and reported 3 passing authorization suites, with 0 failed and 0 skipped. It establishes that direct knowledge of a Cabloy Admin API path does not grant authority: anonymous callers receive `401`; inactive and active ordinary callers receive `403`; and the seeded `systemAdmin` receives each action's expected successful response.

The expected authorization failures are emitted by the executor during the run and are asserted test outcomes, not test failures.

## Retained evidence

- [Redacted focused authorization record](./artifacts/2026-08-18-26c11a7-admin-api-authorization.md)
- Module suites:
  - [User authorization suite](../../../../vona/src/suite/cabloy-admin/modules/admin-user/test/authorization.test.ts)
  - [Role authorization suite](../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/authorization.test.ts)
  - [Department authorization suite](../../../../vona/src/suite/cabloy-admin/modules/admin-department/test/authorization.test.ts)

## Waiver

None.
