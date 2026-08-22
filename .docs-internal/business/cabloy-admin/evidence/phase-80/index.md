# Phase 80 Acceptance Evidence Index

This retained evidence set covers the reusable RBAC contract-hardening increment, the local Start grant/scope-resolution/invalidation implementation evidence, and the Student/Record controller scope slice. It does not close the remaining policy-editor, Dynamic RBAC, Department data-scope, PostgreSQL, or SSR/browser acceptance work.

## Evidence set

| ATP | WBS | Result | Tested revision | Primary retained artifact |
| --- | --- | --- | --- | --- |
| [ATP-ADM-POL-01](./ATP-ADM-POL-01.md) | `WBS-ADM-80-01` | implementation-complete | `533c66e` plus uncommitted RBAC hardening changes | [Reusable catalog/guard regression](./ATP-ADM-POL-01.md) |
| [ATP-ADM-POL-02](./ATP-ADM-POL-02.md) | `WBS-ADM-80-02` | implementation-complete | `e8abda0` | [Start policy admission and invalidation evidence](./ATP-ADM-POL-02.md) |
| [ATP-ADM-SCP-01](./ATP-ADM-SCP-01.md) | `WBS-ADM-80-02` | implementation-complete | `e8abda0` | [Start five-scope resolver evidence](./ATP-ADM-SCP-01.md) |
| [ATP-ADM-SCP-02](./ATP-ADM-SCP-02.md) | `WBS-ADM-80-03` | implementation-complete | working tree based on `2137752` | [Student/Record controller scope evidence](./ATP-ADM-SCP-02.md) |
| [ATP-ADM-POL-03](./ATP-ADM-POL-03.md) | `WBS-ADM-80-04` | implementation-complete | working tree based on `2137752` | [Start Admin policy-editor and authority-separation slice](./ATP-ADM-POL-03.md) |

## Supporting checks

| Check | Result |
| --- | --- |
| Focused reusable RBAC and Start policy suite | pass — 37 tests, 0 failed, 0 skipped (prior retained run) |
| Focused Student/Record scope suite | pass — 16 tests, 0 failed, 0 skipped |
| Current focused backend RBAC/scope run | pass — 92 tests, 0 failed, 3 skipped (PostgreSQL locking proofs) |
| Role policy-editor tabs E2E with raw SSR marker and post-hydration isolation | pass — `ATP-ADM-POL-03` |
| Zova and Vona typecheck | pass — all projects/suites |
| Start Admin reverse-chain build and dependency handoff | pass — `npm run build:zova:admin`, `npm run deps:vona` |

## Retention and closure state

- The evidence records explicit decorator opt-in, canonical identity, alias fail-closed behavior, unrestricted action-bound decisions, request-local fail-closed handoff, scoped decision validation, GuardBase options, opaque capability contract validation, committed invalidation behavior, and five-scope resolution.
- The `WBS-ADM-80-02` records are local managed-SQLite implementation evidence. They do not establish PostgreSQL contention/transaction proof or complete direct external API acceptance.
- This index does not claim `WBS-ADM-80-01` through `WBS-ADM-80-05` verified. Complete Student/Record ATP coverage, policy editor/capability UX, generated contract-loop synchronization, PostgreSQL gates, and SSR/browser evidence remain pending.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
