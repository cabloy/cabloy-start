# Phase 80 Acceptance Evidence Index

This retained evidence set covers the reusable RBAC contract-hardening increment. It does not close the remaining Dynamic RBAC and Department data-scope acceptance work.

## Evidence set

| ATP | WBS | Result | Tested revision | Primary retained artifact |
| --- | --- | --- | --- | --- |
| [ATP-ADM-POL-01](./ATP-ADM-POL-01.md) | `WBS-ADM-80-01` | implementation-complete | `533c66e` plus uncommitted RBAC hardening changes | [Reusable catalog/guard regression](./ATP-ADM-POL-01.md) |

## Supporting checks

| Check | Result |
| --- | --- |
| Reusable `a-rbac` catalog/guard and scope tests | pass — 19 tests, 0 failed, 0 skipped |
| Start `admin-rbac` affected tests | pass — 14 tests, 0 failed, 0 skipped |
| Full Vona repository test suite | pass — 92 tests, 0 failed, 3 expected PostgreSQL-only skips |
| Vona typecheck | pass — all 14 projects/suites |
| Changed-file format and lint checks | pass |

## Retention and closure state

- The evidence records explicit decorator opt-in, canonical identity, alias fail-closed behavior, unrestricted action-bound decisions, request-local fail-closed handoff, scoped decision validation, GuardBase options, and opaque capability contract validation.
- This index does not claim `WBS-ADM-80-02` through `WBS-ADM-80-05` verified. Start revision/cache freshness and PostgreSQL policy contention, complete Student/Record ATP coverage, policy editor/capability UX, generated contract-loop synchronization, and SSR/browser evidence remain pending.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
