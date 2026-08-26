# Phase 80 Acceptance Evidence Index

This retained evidence set covers the reusable RBAC contract-hardening increment, the local Start grant/scope-resolution/invalidation implementation evidence, the Student/Record controller scope slice, and the Role-detail policy-editor slice. Subsequent source revisions add a browser-safe RBAC action projection and generic Start list-row/page-detail data handoff, but those changes are not covered by the retained execution records. Nested Start Details rows and bulk renderers are intentionally outside the current matcher-consumption scope because details are normally embedded in the primary form; Cabloy Admin User/Role/Department system-management controllers also intentionally retain `systemAdmin` protection. Earlier records retain their stated implementation-complete boundaries; `ATP-ADM-POL-04` records the current direct API, SSR/browser, PostgreSQL contention, and contract-loop checks for the opted-in Student slice.

## Evidence set

| ATP                                   | WBS                              | Result                  | Tested revision                                   | Primary retained artifact                                                            |
| ------------------------------------- | -------------------------------- | ----------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [ATP-ADM-POL-01](./ATP-ADM-POL-01.md) | `WBS-ADM-80-01`                  | implementation-complete | `533c66e` plus uncommitted RBAC hardening changes | [Reusable catalog/guard regression](./ATP-ADM-POL-01.md)                             |
| [ATP-ADM-POL-02](./ATP-ADM-POL-02.md) | `WBS-ADM-80-02`                  | implementation-complete | `e8abda0`                                         | [Start policy admission and invalidation evidence](./ATP-ADM-POL-02.md)              |
| [ATP-ADM-SCP-01](./ATP-ADM-SCP-01.md) | `WBS-ADM-80-02`                  | implementation-complete | `e8abda0`                                         | [Start five-scope resolver evidence](./ATP-ADM-SCP-01.md)                            |
| [ATP-ADM-SCP-02](./ATP-ADM-SCP-02.md) | `WBS-ADM-80-03`                  | implementation-complete | working tree based on `2137752`                   | [Student/Record controller scope evidence](./ATP-ADM-SCP-02.md)                      |
| [ATP-ADM-POL-03](./ATP-ADM-POL-03.md) | `WBS-ADM-80-04`                  | implementation-complete | working tree based on `2137752`                   | [Start Admin policy-editor and authority-separation slice](./ATP-ADM-POL-03.md)      |
| [ATP-ADM-POL-04](./ATP-ADM-POL-04.md) | `WBS-ADM-80-04`, `WBS-ADM-80-05` | acceptance pass         | working tree based on `4701888`                   | [Delegated Student Resource projection and stale-policy denial](./ATP-ADM-POL-04.md) |

## Supporting checks

| Check                                                  | Result                                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Focused reusable RBAC and Start policy suite           | pass — 37 tests, 0 failed, 0 skipped (prior retained run)                                                                        |
| Focused Student/Record scope suite                     | pass — 16 tests, 0 failed, 0 skipped                                                                                             |
| Current focused backend RBAC/scope run                 | pass — 7 tests, 6 passed, 0 failed, 1 intentional PostgreSQL-only skip; the skipped contention case passed in the PostgreSQL run |
| PostgreSQL policy invalidation contention              | pass — 3 tests, 0 failed, 0 skipped                                                                                              |
| Role policy-editor and delegated Student Resource E2E  | pass — tagged Admin suite: 6 passed; `ATP-ADM-POL-04` focused scenario: 1 passed                                                 |
| Repository regression                                  | pass — 154 tests, 150 passed, 0 failed, 4 intentional skips                                                                      |
| Zova and Vona typecheck                                | pass — all projects/suites                                                                                                       |
| Start Admin reverse-chain build and dependency handoff | pass — `npm run build:zova:admin`, `npm run deps:vona`, `npm run deps:zova`                                                      |

## Retention and closure state

- The evidence records explicit decorator opt-in, canonical identity, alias fail-closed behavior, unrestricted action-bound decisions, request-local fail-closed handoff, scoped decision validation, GuardBase options, opaque capability contract validation, committed invalidation behavior, and five-scope resolution.
- The earlier `WBS-ADM-80-02` records remain local managed-SQLite implementation evidence; the PostgreSQL contention result for the current invalidation listener is retained in `ATP-ADM-POL-04`.
- `ATP-ADM-POL-04` closes the opted-in delegated Student Resource row/detail projection, stale-projection direct API denial, SSR/hydration marker, paired artifact/dependency, and PostgreSQL invalidation contention checks for the current slice. The existing system-management Resources remain intentionally `systemAdmin`-guarded and are not dynamic-RBAC acceptance targets.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
