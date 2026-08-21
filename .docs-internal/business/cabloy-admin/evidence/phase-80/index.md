# Phase 80 Acceptance Evidence Index

This retained evidence set covers the reusable RBAC contract-hardening increment and the local Start grant, scope-resolution, and invalidation implementation evidence. It does not close the remaining Dynamic RBAC and Department data-scope acceptance work.

## Evidence set

| ATP | WBS | Result | Tested revision | Primary retained artifact |
| --- | --- | --- | --- | --- |
| [ATP-ADM-POL-01](./ATP-ADM-POL-01.md) | `WBS-ADM-80-01` | implementation-complete | `533c66e` plus uncommitted RBAC hardening changes | [Reusable catalog/guard regression](./ATP-ADM-POL-01.md) |
| [ATP-ADM-POL-02](./ATP-ADM-POL-02.md) | `WBS-ADM-80-02` | implementation-complete | `e8abda0` | [Start policy admission and invalidation evidence](./ATP-ADM-POL-02.md) |
| [ATP-ADM-SCP-01](./ATP-ADM-SCP-01.md) | `WBS-ADM-80-02` | implementation-complete | `e8abda0` | [Start five-scope resolver evidence](./ATP-ADM-SCP-01.md) |

## Supporting checks

| Check | Result |
| --- | --- |
| Focused reusable RBAC, Start policy, and Student/Record scope suite | pass — 37 tests, 0 failed, 0 skipped |
| Zova and Vona typecheck | pass — all projects/suites |

## Retention and closure state

- The evidence records explicit decorator opt-in, canonical identity, alias fail-closed behavior, unrestricted action-bound decisions, request-local fail-closed handoff, scoped decision validation, GuardBase options, opaque capability contract validation, committed invalidation behavior, and five-scope resolution.
- The `WBS-ADM-80-02` records are local managed-SQLite implementation evidence. They do not establish PostgreSQL contention/transaction proof or complete direct external API acceptance.
- This index does not claim `WBS-ADM-80-01` through `WBS-ADM-80-05` verified. Complete Student/Record ATP coverage, policy editor/capability UX, generated contract-loop synchronization, PostgreSQL gates, and SSR/browser evidence remain pending.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
