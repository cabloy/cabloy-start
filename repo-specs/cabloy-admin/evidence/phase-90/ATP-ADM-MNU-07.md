# ATP-ADM-MNU-07 — Current-subject freshness without cross-browser push

| Field           | Value                                    |
| --------------- | ---------------------------------------- |
| WBS             | `WBS-ADM-90-07`                          |
| Tested revision | `f84ca8e6` plus dirty test-only worktree |
| Procedure       | Start Admin fast browser test            |
| Result          | pass                                     |

A separate authenticated Admin browser holding an assigned Role changes that Role's menu configuration and reloads once; the reloaded application remains authenticated, exposes fresh Passport roles, and renders the changed configuration. The same rendered User-detail workflow replaces the current subject's ordinary roles, excludes `systemAdmin` from the picker and submitted IDs, reloads the affected browser, and returns a Passport that includes the replacement Role.

The test also changes an unrelated user's ordinary roles and an unrelated Role-menu configuration. Neither causes the current subject browser to reload, and the original browser sees no real-time push. Isolated account and Role fixtures are removed/restored in `finally`. See [focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md).
