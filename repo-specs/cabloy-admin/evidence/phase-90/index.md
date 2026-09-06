# Phase 90 Role-menu ATP Evidence Index

## Evidence set

| ATP                                   | WBS             | Result | Tested revision                          | Retained artifact                                                           |
| ------------------------------------- | --------------- | ------ | ---------------------------------------- | --------------------------------------------------------------------------- |
| [ATP-ADM-MNU-01](./ATP-ADM-MNU-01.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-02](./ATP-ADM-MNU-02.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-03](./ATP-ADM-MNU-03.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-04](./ATP-ADM-MNU-04.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-05](./ATP-ADM-MNU-05.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-06](./ATP-ADM-MNU-06.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-07](./ATP-ADM-MNU-07.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-08](./ATP-ADM-MNU-08.md) | `WBS-ADM-90-07` | pass   | `f84ca8e6` plus dirty test-only worktree | [Focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) |
| [ATP-ADM-MNU-09](./ATP-ADM-MNU-09.md) | `WBS-ADM-100-03` | pass | `6584f216` plus dirty proof/generator worktree | [Extraction contract loop](./artifacts/2026-09-06-6584f216-extraction-contract-loop.md) |

## Supporting checks

| Check                                       | Result                                                              |
| ------------------------------------------- | ------------------------------------------------------------------- |
| Scoped format and whitespace checks         | pass — four changed test files formatted; `git diff --check` passed |
| Focused Vona `admin-menu` ATP suite         | pass — 17 passed, 0 failed                                          |
| Start Admin fast browser ATPs MNU-06–MNU-08 | pass — 4 passed                                                     |
| MNU-09 generator fixed point and reverse chain | pass — two matching SHA-256 inventories; paired build before deps |
| MNU-09 focused/full regression | pass — focused Vona 23/23; root Vona 187/187, 4 expected skips |

## Retention and closure state

The retained [focused validation artifact](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) records actual commands, revision, dirty-tree classification, managed-SQLite/fast-E2E environment, cleanup, observed outcomes, and redaction. It intentionally omits startup credentials, fixture identifiers, and mail-preview links.

`WBS-ADM-90-07` is `implementation-complete` and `WBS-ADM-100-03` / `ATP-ADM-MNU-09` is `verified`: their scoped and contract-loop proofs are retained separately. `WBS-ADM-90-08` final Phase 90 closure is not claimed.

The [test plan](../../test-plan.md#evidence-record) owns ATP acceptance criteria.
