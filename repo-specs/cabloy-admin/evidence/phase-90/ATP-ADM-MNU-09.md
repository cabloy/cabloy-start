# ATP-ADM-MNU-09 — Extracted role-menu contract loop and reconciliation

| Field | Value |
| --- | --- |
| WBS | `WBS-ADM-100-03` |
| Tested revision | `6584f216` plus dirty MNU-09 proof/generator-output worktree |
| Procedure | Metadata/OpenAPI fixed point, paired Start Admin reverse handoff, focused/browser/full regression |
| Result | pass |

Vona role-menu ownership is exclusively `admin-menu`: its controller emits `AdminMenuRoleMenu_*` operations and protected safe projections, while `admin-rbac` has no role-menu controller ownership and its version-1 path retains only policy/grant storage. Role View composes `admin-menu:blockRoleMenuEditor` beside `admin-rbac:blockPolicyEditor`.

A test-owned retired identity remains fail-closed: it cannot enable the current leaf or be recreated through protected validation. Protected batch reconciliation removes the retired tuple and creates the exact current `roleId + ssrSiteName + ssrMenuName` tuple, which then alone enables visibility/configuration. The generated metadata/OpenAPI surfaces reached a SHA-256 fixed point; the paired Start Admin SSR and REST build completed before `npm run deps:vona`; focused Vona tests, browser ATPs, typecheck, and root version-1 regression all passed. See the retained [extraction contract-loop validation](./artifacts/2026-09-06-6584f216-extraction-contract-loop.md).
