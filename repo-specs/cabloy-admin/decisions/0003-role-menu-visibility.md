# ADR 0003: Role Menu Visibility

## Status

Accepted on 2026-08-30 as the bounded authority closure for `WBS-ADM-90-01`.

Amended and reaccepted on 2026-08-30. This amendment supersedes the earlier Admin-only, explicit-opt-in, immutable-`menuKey`, static-or-dynamic-exclusive, and implicit-`systemAdmin` visibility rules in this ADR. The accepted Phase 100 ownership extraction supersedes `admin-rbac` as the role-menu runtime owner: paired `admin-menu` modules own the menu domain instead. It does not authorize source implementation, ATP execution, deployment, or a change to independently enforced Resource, controller, API, action, or data-scope authority.

Amended and reaccepted on 2026-08-31 for the frontend current-subject freshness mechanism and cache-ownership clarification. This amendment does not change the role-menu visibility semantics, server-side evaluation, ownership extraction, or authorization boundaries below.

## Background

ADR 0001 intentionally deferred dynamic role-to-menu policy. ADR 0002 subsequently accepted dynamic role-to-action authorization and Department data scope, but it does not make navigation disclosure an authorization boundary or create role-to-menu grants.

Cabloy Start currently filters static `@SsrMenu(...)` leaves using server-only role-name metadata and removes that metadata from the public menu DTO. Cabloy Admin needs a governed way for a System Administrator to configure additional navigation disclosure without exposing policy internals or changing route, Resource, controller, API, action, or data-scope authority.

## Observed Current Source and Approved Target

| Category                | Fact or contract                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Observed current source | The SSR evaluator currently treats both omitted `roles` and `roles: []` as public, because it uses `!menu.roles?.length                                                                                                              |     | checkRoleName(...)`. A nonempty array uses static any-role matching. |
| Observed current source | A menu declaration with omitted `site` currently binds to every registered SSR site. A prepared `item` leaf uses its SSR menu onion name; a keyed `items` leaf uses `<ssrMenuName>#<itemKey>`.                                       |
| Approved target         | `roles === undefined` is public and never dynamically configurable; `roles: []` is default-deny and dynamically configurable; a nonempty `roles` array is visible through a static any-role match or a matching dynamic association. |
| Approved target         | The durable association identity is `roleId + ssrSiteName + ssrMenuName`, where both names are actual onion/prepared menu identities.                                                                                                |
| Not yet implemented     | The target evaluator, all-site catalog, persistence, protected configuration APIs, frontend editor, revision path, and tests are future Phase 90 work.                                                                               |

The observed facts are implementation inputs, not an assertion that the target behavior already exists.

## Problem

Static role-name declarations cannot express per-role configuration for every restricted SSR menu leaf. Reusing `admin-rbac` action grants would conflate a menu with an API action and make a browser-facing item appear to authorize server behavior. The revised product rule deliberately uses the actual SSR tree identity as the role-menu association identity, so site/menu onion renames must be governed rather than silently changing effective policy.

The solution must preserve the active Vona instance as tenant, public-menu confidentiality for private policy state, static role compatibility where roles are nonempty, and independently enforced API authorization.

## Decision

### Establish a separate role-menu visibility policy domain

Paired `admin-menu` modules will own the separate role-to-menu visibility association domain, catalog/configuration surface, visibility revision/invalidation, and Role-detail editor. `admin-rbac` retains role-to-action grants, Department/owner data-scope resolution, and action-policy UI; it will not add a menu action, data scope, or menu-specific interpretation to `rbacGrant`. `home-user` remains authoritative for `homeRole`, role membership, and Passport role facts.

The protected configuration surface is administered by `systemAdmin`, but that control-plane admission is not a menu-visibility bypass. This decision does not create a new SSR site, public path, flavor, tenant, identity, persistence, or API-authority boundary.

### Derive one catalog tree for every registered SSR site

The future protected catalog enumerates registered and enabled SSR sites for the active instance. Each partition is identified by its SSR-site onion name (`ssrSiteName`), for example:

```text
start-siteadmin:admin
start-siteweb:web
```

A menu or group appears in a site partition only when its declaration binds to that actual SSR site. An omitted `site` binds to every registered SSR site; a scalar or array binds only to matching SSR-site onion names. A declaration's `locale` selects display only: role-menu identity and eligibility are locale-independent. Groups remain display hierarchy only: no group has a persisted association, grant, or durable policy identity. A group disappears from an effective rendered tree when it has no visible descendant leaf.

The following source-informed snapshot records the currently registered trees. It is a reviewable input to the future catalog algorithm, not a permanently hand-maintained eligibility allowlist.

| SSR site                | Current bound leaves / hierarchy facts                                                                                                                                                                                                                                                                                                                                       | Policy interpretation after implementation                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `start-siteadmin:admin` | Explicitly bound Admin leaves include `start-siteadmin:home`, `training-student:student#student`, and `training-record:record#record`. Omitted-site restricted leaves include `admin-user:user#user`, `admin-role:role`, `admin-department:department`, and `start-metrics:metrics#metrics`. `start-siteadmin:management` and `start-siteadmin:systemManagement` are groups. | Each leaf follows its declared `roles` state; groups are display-only. |
| `start-siteweb:web`     | Explicitly bound Web leaves include `start-siteweb:home`, `demo-basic:admin`, `demo-basic:demo#state`, `demo-basic:demo#component`, and `demo-basic:demo#cssInJs`. The omitted-site leaves above also bind here. `start-siteadmin:systemManagement` is an omitted-site group and participates as display hierarchy where its bindings resolve.                               | Each leaf follows its declared `roles` state; groups are display-only. |

A `roles === undefined` leaf is presented as public and has no checkbox. A leaf with defined `roles` is presented with a checkbox for a target role. The catalog never accepts a group association.

### Use definedness-based static and dynamic visibility

The target evaluator distinguishes `undefined` from an empty array deliberately:

```text
roles === undefined:
  visible = true
  dynamic association is neither evaluated nor configurable

roles is []:
  visible = matching existing dynamic association for any current role

roles is nonempty:
  visible = static any-role Passport match
            OR matching existing dynamic association for any current role
```

A dynamic association is additive: it can disclose a nonempty-static-role leaf to another role but cannot remove visibility already supplied by the static declaration. A surviving association row is the only enabled dynamic state; unchecking removes that row and does not retain a disabled tombstone. An ordinary caller with no matching current role, no association, or an invalid association is denied for a defined-role leaf. Matching associations union across the subject's current active-instance roles.

There is no hidden `systemAdmin` evaluator shortcut. A `systemAdmin` sees a leaf only through its declared static roles or a matching dynamic association. Protected administration APIs remain independently protected by their own `systemAdmin` server guard.

### Persist actual SSR tree identities

The future active-instance-scoped association records these core fields:

```text
roleId
ssrSiteName
ssrMenuName
```

`ssrSiteName` is the SSR-site onion name, not `siteId`, a public path, or a flavor. `ssrMenuName` is the final prepared leaf name: an `item` uses its SSR menu onion name, while a keyed `items` entry uses `<ssrMenuName>#<itemKey>`. Thus, a current Student association is expressed as:

```text
roleId: "1"
ssrSiteName: "start-siteadmin:admin"
ssrMenuName: "training-student:student#student"
```

Ordinary entity lifecycle/audit fields may be retained, but no enabled state is stored: a surviving row is the only enabled association, and an unchecked association is deleted atomically without a disabled tombstone. Tenant-scoped business uniqueness uses ordinary lookup indexes plus transactional service checks, not `table.unique(...)`. The target role, site partition, and final leaf must be validated in trusted active-instance scope. `systemAdmin` is not rejected merely because of its role name; any policy about configuration targets must be explicit in the protected service contract rather than implicit in visibility evaluation.

When an SSR site or final menu identity is renamed, removed, or no longer binds to a site, existing associations fail closed. Future delivery must provide a protected reconciliation, migration, or removal path; it must never fall back to a title, URL, route, group, static role result, or guessed identity.

### Keep evaluation server-side and public menus policy-detail-free

The SSR menu layer retains its structural site/instance/host/locale cache. It evaluates the target visibility rule for each request before stripping private fields. The dynamic evaluator uses trusted current role identities and exact `ssrSiteName`/`ssrMenuName` facts; structural caching must not retain a subject-specific visible result.

The public menu endpoint retains its existing shape and anonymous behavior. It continues to expose ordinary rendered navigation data, including the final menu `name`, but never returns static roles, association state, protected catalog metadata, revisions, or role topology. A catalog/configuration DTO is a separate protected projection and exposes only the target role's safe checkbox state and the display hierarchy needed for editing.

Menu visibility does not authorize a route, Resource, controller, API request, action, or data scope. Existing Passport guards, `@Passport.rbac(...)` decisions, Resource permissions, and service-level boundaries remain authoritative and independently tested.

### Keep policy revisions and session freshness separate

A committed role-menu mutation advances a separate menu-visibility revision and invalidates the affected configuration-editor state. The normal `roleMenu` Model write path owns entity/query-cache invalidation, including its commit-time invalidation behavior; request-time visibility evaluation uses that normal Model cache path rather than bypassing it. The revision is not an ORM-cache substitute and does not reuse action-RBAC policy invalidation or coarse permission projections as its policy authority.

For a successful role-menu mutation affecting the current browser subject, the frontend invalidates the affected protected role-configuration state and invokes `this.app.reload()`. For a successful ordinary-role membership replacement targeting the current browser subject, it invalidates the affected User Resource item and invokes the same full application reload boundary. The reload re-establishes authenticated application state and obtains the next server-authoritative menu result; these mutation callbacks do not require a separate targeted Passport refresh, menu-model refetch, or mutation-level relogin fallback. Mutations affecting another subject do not reload the current browser. The public-path/locale menu query key remains stable and does not include role identity. No real-time push is introduced in this increment.

### Fold the future schema change into the current version path

The future `admin-menu` role-menu persistence change remains in its current `vonaModule.fileVersion: 1` schema path; no version increment is planned for this development-stage extraction. Its version-1 path creates the menu tables while `admin-rbac`'s version-1 path relinquishes them. Existing menu API paths and generated-consumer names need not be preserved. The implementation must document the fold, update the owning `meta.version.ts` paths, and run `npm run test` after those edits.

## Alternatives Rejected or Deferred

- **Treat menu visibility as API or route authorization:** rejected because browser navigation and direct requests require independent server authority.
- **Reuse `rbacGrant` action records:** rejected because menu visibility is not an action or data-scope decision.
- **Interpret `roles: []` as public in the target contract:** rejected because an explicitly supplied empty list is the dynamic-only/default-deny marker.
- **Persist parent-group grants:** deferred; groups are derived from visible children in this increment.
- **Use a hidden implicit `systemAdmin` visibility bypass:** rejected because visibility follows the declared static or dynamic rule; protected administration remains separately guarded.
- **Treat retired or renamed onion identities as a static-role fallback:** rejected because it could silently broaden disclosure.
- **Real-time cross-browser propagation:** deferred; next authenticated menu refresh is sufficient for this increment.

## Consequences

- Implementation must establish paired `admin-menu` modules and move the separate persistence, all-site catalog, evaluator integration, revision/invalidation path, protected API, and Role-detail editor out of `admin-rbac` without modifying action-grant semantics.
- Backend SSR retrieval must distinguish omitted, empty, and nonempty `roles` before private fields are projected away, while retaining the public `home-base` menu contract.
- Existing Role Resource composition remains the owner of conventional CRUD/cache state; the menu editor is a role-scoped custom block.
- API authorization and menu disclosure require independent negative tests and evidence.
- Delivery and proof remain sequenced in Phase 90 for behavior and Phase 100 for the ownership extraction. This amendment closes the extraction boundary; source implementation and ATP execution remain later work.

## Related Records

- [Cabloy Admin internal planning index](../README.md)
- [Product Requirements Document](../prd.md)
- [Software Requirements Specification](../srs.md)
- [Product Delivery Plan and Work Breakdown Structure](../pdp-wbs.md)
- [Test Strategy and Acceptance Plan](../test-plan.md)
- [Delivery Progress](../progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./0001-admin-mvp-boundaries.md)
- [ADR 0002: Dynamic RBAC and Department Data Scope](./0002-dynamic-rbac-and-data-scope.md)
- [Menu Guide](../../../repo-docs/backend/menu-guide.md)
- [Contract Loop Playbook](../../../repo-docs/fullstack/contract-loop-playbook.md)
