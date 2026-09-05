# ATP-ADM-MNU-04 — Exact identity, isolation, and lifecycle

| Field           | Value                                    |
| --------------- | ---------------------------------------- |
| WBS             | `WBS-ADM-90-07`                          |
| Tested revision | `f84ca8e6` plus dirty test-only worktree |
| Procedure       | Focused Vona `roleMenu.test.ts`          |
| Result          | pass                                     |

Focused service/resolver tests reject public, group, wrong-site, unknown, malformed, wrong-final-key, and retired identities. They prove omitted-site declarations remain separately addressable per bound site, active-instance isolation, atomic/idempotent batch behavior, competing-write serialization, datasource isolation, and dependent-row removal after Role deletion. Full execution details are retained in [focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md).
