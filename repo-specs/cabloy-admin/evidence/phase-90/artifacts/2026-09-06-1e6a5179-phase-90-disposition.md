# Phase 90 combined traceability disposition — redacted

## Execution identity

| Field | Observed value |
| --- | --- |
| Suite / WBS | Cabloy Admin / `WBS-ADM-90-08` |
| Candidate revision | `1e6a51793e39eea156865aff9f218b949aecb58f` |
| Working tree | Clean before and after the verification procedures; `git diff --check` passed |
| Clean-tree diff digest | Empty `git diff --binary HEAD` SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| Edition / flavor | Cabloy Start / Vona `normal` / Start Admin SSR and REST |
| Database classification | Managed local better-sqlite3 test databases created by the test runners |
| OpenAPI producer | Managed local Vona normal-flavor Swagger producer |
| Browser target | Managed local fast-E2E Start Admin runtime |
| Secret handling | Access tokens, cookies, fixture identities, and mail-preview URLs are omitted from this retained record |

## Reconciliation

- `WBS-ADM-90-07` / `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08` remains retained in the historical [focused validation record](./2026-09-06-f84ca8e6-focused-validation.md) at `f84ca8e6`, including its dirty test-only classification.
- `WBS-ADM-100-03` / `ATP-ADM-MNU-09` remains retained in the historical [extraction contract-loop record](./2026-09-06-6584f216-extraction-contract-loop.md) at `6584f216`, including its dirty test/generator classification.
- This clean-candidate execution re-ran the combined existing verification procedures at `1e6a5179`. It supersedes the historical dirty-worktree attribution limitation for Phase 90 closure without rewriting or discarding their observed scope.
- The accepted amended ADR 0003 remains the governing role-menu decision. No implementation-affecting role-menu decision, waiver, or severity-one invariant failure is open.

## Contract and ownership result

- `admin-menu` remains the exclusive Vona role-menu controller/entity/model/service/projection/visibility-revision and version-1 schema owner. `admin-rbac` retains action-grant and data-scope policy ownership and no role-menu controller ownership.
- The protected operations remain `AdminMenuRoleMenu_*`; no retired `AdminRbacRoleMenu_*` operation/controller owner is present. Role View composes `admin-menu:blockRoleMenuEditor` beside `admin-rbac:blockPolicyEditor`.
- The metadata/OpenAPI sequence below was run twice. The affected Vona/Zova metadata and generated API inventory was byte-identical across both passes (`fixed-point=pass`; inventory SHA-256 `b96290b7b87429229578bc2190acd069aacf01944369249d71311a33f5460ad3`). Generated consumers were not manually edited.
- The existing retired-to-current reconciliation test confirms that a retired persisted identity is fail-closed, rejected for protected recreation, and replaced only through protected batch removal plus exact current identity creation.

## Procedures and observed results

```bash
npm run vona -- :tools:metadata admin-menu admin-rbac admin-role
npm run zova -- :tools:metadata admin-menu admin-rbac admin-role
API_BASE_URL=http://127.0.0.1:7202 \
  npm run zova -- :openapi:generate admin-menu admin-rbac admin-role
# repeat the same metadata/OpenAPI sequence
# pass — two SHA-256 inventories match

npm run vona -- :bin:test --flavor=normal \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuOpenapi.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenu.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuAuthorization.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuProjection.test.ts \
  src/suite/cabloy-admin/modules/admin-role/test/role.test.ts
# pass — 23 passed, 0 failed

npm run test:e2e:fast -- cabloy-admin --grep 'ATP-ADM-MNU-(06|07|08)'
# pass — 4 passed

npm run build:zova:admin
# pass — paired Start Admin SSR then REST output

npm run deps:vona
# pass — executed after the paired build

npm run tsc
# pass

npm run test
# pass — 191 tests: 187 passed, 0 failed, 4 expected PostgreSQL-only skips

git diff --check
# pass
```

The focused and browser procedures cover the retained MNU-01–MNU-08 role-menu policy, isolation, redaction, direct-API separation, current-subject reload, SSR/editor, and group leaf-only mutation scenarios. Expected direct Student/Record `403` responses in MNU-06 were asserted acceptance behavior, not failures. The root regression reinitialized the version-1 paths and confirms that `admin-menu` exclusively creates the role-menu schema while `admin-rbac` has no duplicate version-1 role-menu path.

## Derived status and disposition

| WBS | Derived status | Basis |
| --- | --- | --- |
| `WBS-ADM-90-02`–`WBS-ADM-90-06` | `verified` | Clean-candidate MNU-01–MNU-09 proof covers the persistence, visibility, protected API, editor, and freshness acceptance checks. |
| `WBS-ADM-90-07` | `verified` | All MNU-01–MNU-08 procedures are retained and revalidated at the clean candidate. |
| `WBS-ADM-100-01`–`WBS-ADM-100-02` | `verified` | Clean-candidate ownership, generated consumer, and version-1 path proof covers their acceptance checks. |
| `WBS-ADM-100-03` | `verified` | The historical extraction proof is retained and its contract/regression gates are revalidated at the clean candidate. |
| `WBS-ADM-90-08` | `verified` | This combined traceability disposition maps ATP-ADM-MNU-01–09 to clean, passing, redacted, retained proof. |

**Phase 90 is verified.** All applicable WBS acceptance checks and ATP-ADM-MNU-01–09 evidence are retained at the clean candidate, with no waiver or severity-one invariant failure. This is an evidence disposition only: no database-reset command, clean E2E runner, deployment, release, version change, commit, or push was performed.
