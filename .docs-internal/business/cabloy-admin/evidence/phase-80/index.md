# Phase 80 Acceptance Evidence Index

This retained evidence set covers the reusable RBAC contract-hardening increment, the local Start grant/scope-resolution/invalidation implementation evidence, the Student/Record controller scope slice, and the Role-detail policy-editor slice. Subsequent source revisions add a browser-safe RBAC action projection and generic Start list-row/page-detail data handoff, but those changes are not covered by the retained execution records. Nested Start Details rows and bulk renderers are intentionally outside the current matcher-consumption scope because details are normally embedded in the primary form; Cabloy Admin User/Role/Department system-management controllers also intentionally retain `systemAdmin` protection. Earlier records retain their stated implementation-complete boundaries; `ATP-ADM-POL-04` records the current direct API, SSR/browser, PostgreSQL contention, and contract-loop checks for the opted-in Student slice.

## Evidence set

| ATP                                   | WBS                              | Result                  | Tested revision                                                                   | Primary retained artifact                                                          |
| ------------------------------------- | -------------------------------- | ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [ATP-ADM-POL-01](./ATP-ADM-POL-01.md) | `WBS-ADM-80-01`                  | implementation-complete | historical `533c66e` worktree; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |
| [ATP-ADM-POL-02](./ATP-ADM-POL-02.md) | `WBS-ADM-80-02`                  | implementation-complete | historical `e8abda0`; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6`          | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |
| [ATP-ADM-SCP-01](./ATP-ADM-SCP-01.md) | `WBS-ADM-80-02`                  | implementation-complete | historical `e8abda0`; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6`          | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |
| [ATP-ADM-SCP-02](./ATP-ADM-SCP-02.md) | `WBS-ADM-80-03`                  | implementation-complete | historical `2137752` worktree; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |
| [ATP-ADM-POL-03](./ATP-ADM-POL-03.md) | `WBS-ADM-80-04`                  | implementation-complete | historical `2137752` worktree; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |
| [ATP-ADM-POL-04](./ATP-ADM-POL-04.md) | `WBS-ADM-80-04`, `WBS-ADM-80-05` | acceptance pass         | historical `4701888` worktree; current `ff0b0c3d8c276c7bb98f53f69230b4f0dc483fb6` | [Current validation summary](./artifacts/2026-08-26-ff0b0c3-current-validation.md) |

## Supporting checks

| Check                                                          | Result                                                                            |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Current focused reusable RBAC and Start policy suite           | pass — 35 tests, 34 passed, 0 failed, 1 intentional PostgreSQL-only skip          |
| Current Student/Record, membership, and authorization suite    | pass — 26 tests, 25 passed, 0 failed, 1 unrelated PostgreSQL-only membership skip |
| Current PostgreSQL policy invalidation contention              | pass — 3 tests, 0 failed, 0 skipped                                               |
| Current Start Admin E2E                                        | pass — tagged Admin suite: 6 passed; `ATP-ADM-POL-04` focused scenario: 1 passed  |
| Current repository regression                                  | pass — 154 tests, 150 passed, 0 failed, 4 intentional skips                       |
| Current Zova and Vona typecheck                                | pass — all projects/suites                                                        |
| Current Start Admin reverse-chain build and dependency handoff | pass — `npm run build:zova:admin`, `npm run deps:vona`, `npm run deps:zova`       |

## Retention and closure state

- The immutable current-revision reconciliation is retained at [2026-08-26 current validation](./artifacts/2026-08-26-ff0b0c3-current-validation.md). It records explicit decorator opt-in, canonical identity, alias fail-closed behavior, unrestricted action-bound decisions, request-local fail-closed handoff, scoped decision validation, GuardBase options, opaque capability contract validation, committed invalidation, five-scope resolution, Student/Record controller scope enforcement, and current browser acceptance.
- The current PostgreSQL policy-invalidation contention run passed. It is distinct from the managed-SQLite focused runs, and uses the test's separate contexts and explicit barrier.
- `ATP-ADM-POL-04` additionally confirms the opted-in delegated Student Resource row/detail projection, stale-projection direct API denial, SSR/hydration marker, paired artifact/dependency handoff, and PostgreSQL invalidation contention. The existing system-management Resources remain intentionally `systemAdmin`-guarded and are not dynamic-RBAC acceptance targets.
- The current evidence reconciles source revision, PostgreSQL invalidation contention, the paired contract loop, version-1 path initialization, and browser acceptance. The attempted current four-module metadata/OpenAPI regeneration produced unclassified runtime-Swagger output drift, so no clean fixed point is claimed; generated artifacts were restored. `WBS-ADM-80-01` through `WBS-ADM-80-04` nevertheless remain `implementation-complete`: `ATP-ADM-POL-02`, `ATP-ADM-SCP-01`, and `ATP-ADM-SCP-02` still lack their complete direct external HTTP/API matrices. `WBS-ADM-80-05` remains `in-progress` for those matrices, the unclassified regeneration output drift, and the non-clean repository-wide lint and format gates. No waiver is recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
