# ATP-ADM-MNU-02 — Tri-state visibility and role union

| Field           | Value                                    |
| --------------- | ---------------------------------------- |
| WBS             | `WBS-ADM-90-07`                          |
| Tested revision | `f84ca8e6` plus dirty test-only worktree |
| Procedure       | Focused Vona `roleMenu.test.ts`          |
| Result          | pass                                     |

The resolver proof covers public leaves, dynamic-only default denial, nonempty static-role matching, static-or-dynamic composition, current-role association union, association removal, and no implicit `systemAdmin` visibility bypass. It uses the normal committed Model mutation path. See the retained [focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md).
