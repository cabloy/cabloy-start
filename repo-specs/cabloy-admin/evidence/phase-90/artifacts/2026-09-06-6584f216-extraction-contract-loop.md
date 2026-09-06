# Phase 100 extraction contract-loop validation — redacted

## Execution identity

| Field | Observed value |
| --- | --- |
| Suite / WBS / ATP | Cabloy Admin / `WBS-ADM-100-03` / `ATP-ADM-MNU-09` |
| Source revision | `6584f216102c2ee7cc87a124864424edb02bed40` |
| Working tree | Dirty: MNU-09 Vona test additions plus generator-produced Zova OpenAPI snapshot updates |
| Edition / flavor | Cabloy Start / Vona `normal` / Start Admin SSR and REST |
| Database classification | Managed local better-sqlite3 test databases created by test runners |
| OpenAPI producer | Managed local Vona normal-flavor Swagger producer at `http://127.0.0.1:7202` |
| Browser target | Managed local fast-E2E Start Admin runtime at `http://127.0.0.1:7202` |
| Secret handling | Access tokens, cookies, fixture identities, and mail-preview URLs are omitted from this retained record |

## Ownership and reconciliation result

- Vona `admin-menu` owns the role-menu controller, entity, model, service, safe projection, visibility revision, and version-1 table creation.
- Vona `admin-rbac` version 1 creates only its retained grant/policy storage; it has no `roleMenu` controller ownership.
- Role View metadata composes `admin-menu:blockRoleMenuEditor` and retains `admin-rbac:blockPolicyEditor` for Resource Permissions.
- OpenAPI operation IDs and tags are `AdminMenuRoleMenu_*` / `AdminMenuRoleMenu`; no `AdminRbacRoleMenu_*` operation or controller owner was found.
- The new `ATP-ADM-MNU-09` test inserts a test-owned retired final-leaf tuple, proves it is ignored by resolver/configuration state and rejected by protected create validation, then performs protected batch reconciliation to delete the retired tuple and create the exact current tuple. Only the current tuple enables the dynamic leaf. Test-owned records are deleted in `finally`.

## Generated contract result

The following sequence was run twice against the same managed producer:

```bash
npm run vona -- :tools:metadata admin-menu admin-rbac admin-role
npm run zova -- :tools:metadata admin-menu admin-rbac admin-role
API_BASE_URL=http://127.0.0.1:7202 \
  npm run zova -- :openapi:generate admin-menu admin-rbac admin-role
```

SHA-256 inventories of the affected Vona/Zova metadata and generated API surfaces were equal across the two passes (`fixed-point=pass`). Generated consumer output was not edited manually.

The generator updated broad raw `types.ts` and `schemas.ts` Swagger snapshots in `admin-menu`, `admin-rbac`, and `admin-role`. Those snapshots reproduce shared Swagger components; they are not role-menu ownership declarations. Meaningful ownership remains the `admin-menu` operation matcher, generated `AdminMenuRoleMenu` consumer, module metadata, and Vona controller/entity/service surface.

## Procedures and observed results

```bash
./node_modules/.bin/oxfmt --check \
  vona/src/suite/cabloy-admin/modules/admin-menu/test/roleMenu.test.ts \
  vona/src/suite/cabloy-admin/modules/admin-menu/test/roleMenuOpenapi.test.ts
# pass

git diff --check
# pass

npm run vona -- :bin:test --flavor=normal \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuOpenapi.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenu.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuAuthorization.test.ts \
  src/suite/cabloy-admin/modules/admin-menu/test/roleMenuProjection.test.ts \
  src/suite/cabloy-admin/modules/admin-role/test/role.test.ts
# pass before and after generation — 23 passed, 0 failed

npm run build:zova:admin
# pass — paired Start Admin SSR then REST output

npm run deps:vona
# pass — executed after the paired build

npm run tsc
# pass

npm run test:e2e:fast -- cabloy-admin --grep 'ATP-ADM-MNU-(06|07|08)'
# pass — 4 passed

npm run test
# pass — 187 passed, 0 failed, 4 expected PostgreSQL-only skips
```

The root regression initialized version-1 paths for both `admin-menu` and `admin-rbac`, confirming that the retained version-1 ownership split is runnable. Browser log entries for intentionally denied direct Student/Record requests were expected MNU-06 assertions, not failures.

## Boundary and disposition

This record closes `WBS-ADM-100-03` / `ATP-ADM-MNU-09` as `verified`: the extracted ownership contract loop, generator fixed point, paired reverse handoff, changed version-1 path regression, and retired-to-current identity reconciliation are retained at this revision.

It does not begin `WBS-ADM-90-08`. That downstream task owns the combined Phase 90 closure decision.
