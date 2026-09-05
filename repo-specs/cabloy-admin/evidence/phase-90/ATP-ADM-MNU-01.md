# ATP-ADM-MNU-01 — Protected role-menu administration

| Field           | Value                                        |
| --------------- | -------------------------------------------- |
| WBS             | `WBS-ADM-90-07`                              |
| Tested revision | `f84ca8e6` plus dirty test-only worktree     |
| Procedure       | Focused Vona `roleMenuAuthorization.test.ts` |
| Result          | pass                                         |

The controller matrix exercised catalog, target-role configuration, create, delete, and batch endpoints with `innerAccess: false`. Anonymous callers received `401`; inactive and ordinary callers received `403`; only `systemAdmin` completed the protected mutation lifecycle. The retained [focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md) records command, environment, and redaction details.
