# ATP-ADM-MNU-08 — SSR Role menu editor and leaf-only group batching

| Field           | Value                                    |
| --------------- | ---------------------------------------- |
| WBS             | `WBS-ADM-90-07`                          |
| Tested revision | `f84ca8e6` plus dirty test-only worktree |
| Procedure       | Start Admin fast browser tests           |
| Result          | pass                                     |

Role View response markup contains the server-render marker and no hydration marker; the browser then hydrates as Start Admin. The Menu Authorization tab composes beside existing Role detail content, displays public leaves without a persisted-association checkbox, retrieves role configuration narrowly after safe individual leaf mutation, and sends the exact Role/site/final-leaf body.

The presentation-level Management group bulk toggle is also tested. Its resulting batch contains one or more configurable descendant leaf `{ ssrSiteName, ssrMenuName }` identities and no group identity. Thus the group control is a leaf-operation convenience rather than a persisted group grant. See [focused validation](./artifacts/2026-09-06-f84ca8e6-focused-validation.md).
