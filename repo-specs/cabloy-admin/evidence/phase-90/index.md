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
| MNU-01–09 clean-candidate closure | pass — clean `1e6a5179`; fixed point, focused Vona 23/23, fast browser 4/4, paired build/deps/typecheck, and root Vona 187/191 with 4 expected skips |

## Retention and closure state

The retained [focused validation artifact](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) and [extraction contract-loop artifact](./artifacts/2026-09-06-6584f216-extraction-contract-loop.md) preserve the historical dirty-worktree MNU-01–08 and MNU-09 procedures. The clean [combined Phase 90 disposition](./artifacts/2026-09-06-1e6a5179-phase-90-disposition.md) revalidates their combined contract, focused/browser, reverse-chain, typecheck, and root-regression gates at `1e6a5179`; it supersedes their dirty-worktree attribution limitation for closure while retaining their original scope. All retained records omit credentials, tokens, cookies, fixture identities, and mail-preview links.

`WBS-ADM-90-08` and Phase 90 are `verified`: `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09` identify revision, environment, procedure, outcome, and redacted retained artifacts. No waiver or severity-one invariant failure remains.

The [test plan](../../test-plan.md#evidence-record) owns ATP acceptance criteria.
