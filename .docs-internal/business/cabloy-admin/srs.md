# Cabloy Admin Software Requirements Specification

## Purpose and Authority

This specification translates the [Cabloy Admin PRD](./prd.md), [ADR 0001](./decisions/0001-admin-mvp-boundaries.md), and [ADR 0002](./decisions/0002-dynamic-rbac-and-data-scope.md) into implementable, testable technical contracts. It is the authority for data and capability ownership, server-side authorization, API and DTO boundaries, transactions, invariants, cache ownership, and contract-loop behavior. The [PDP/WBS](./pdp-wbs.md) sequences delivery; the [test plan](./test-plan.md) defines how these contracts are proved.

This document does not expand product scope or supersede the PRD or ADR.

## System Context

Cabloy Admin is a Cabloy Start suite-first domain:

```text
vona/src/suite/cabloy-admin/modules/<module>/
zova/src/suite/cabloy-admin/modules/<module>/
```

It integrates with the existing Start Admin site:

| Concern             | Contract                   |
| ------------------- | -------------------------- |
| Vona SSR site       | `admin`                    |
| Public path         | `/admin`                   |
| Zova flavor         | `cabloyStartAdmin`         |
| Reverse-chain build | `npm run build:zova:admin` |

Phase one creates no new Admin SSR site, public path, flavor, or independent application.

## Capability and Persistence Ownership

| Owner                  | Owns                                                                                                                                     | Does not own                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `admin-user`           | Account-management projections, permitted profile updates, activation commands, role/Department composition                              | Account identity, credentials, auth providers, Passport persistence           |
| `admin-role`           | Custom-role lifecycle façade, non-system-administrator memberships, protected `systemAdmin` workflow, sensitive-operation audit          | A replacement role or role-membership entity                                  |
| `admin-department`     | Department forest, Department memberships, position text, primary membership, manager lifecycle                                          | Tenant identity, Organization, dynamic data scope                             |
| `a-rbac`               | Reusable RBAC decorator/guard, canonical action catalog, policy decision contracts, safe predicate/capability contracts                  | Department semantics, Start grant persistence, `systemAdmin` policy, Admin UI |
| `admin-rbac`           | Start role-action grants, custom Department associations, policy resolution, catalog projection, policy revision/invalidation, policy UI | Identity, role, Department, or Passport fact ownership                        |
| `home-user` / `a-user` | `homeUser`, `homeRole`, `homeRoleUser`, authentication, Passport, tokens, stable `bean.user`, `bean.role`, and `bean.passport` surfaces  | Cabloy Admin operational use cases                                            |
| `rest-resource`        | Conventional Admin Resource bootstrap, schemas, permissions, queries, mutations, query keys, and invalidation                            | Domain-specific custom-command semantics                                      |

`bean.user` and `bean.role` do not currently expose every operation required by Cabloy Admin. Cabloy Admin services must add managed façades around those facts rather than bypassing or duplicating their ownership.

## Tenant and Authorization Contracts

- **SRS-ADM-TEN-01**: The active Vona instance is the tenant for every Cabloy Admin query, mutation, relation traversal, audit lookup, background path, and recovery path.
- **SRS-ADM-TEN-02**: Every new Department, membership, and sensitive-operation audit model uses normal active-instance scope. No Cabloy Admin model sets `disableInstance`.
- **SRS-ADM-TEN-03**: Request DTOs never accept authoritative `iid`, instance ID, instance name, actor identity, or Department scope. The opted-in Controller/action boundary derives each authority from authenticated active-instance context and protected resource lookup, then passes it through a typed internal context; neutral services never derive authority from public DTOs or ambient caller state.
- **SRS-ADM-TEN-04**: A cross-instance record is treated as absent. Services must not use an unscoped probe merely to distinguish `403` from a scoped not-found result.
- **SRS-ADM-AUT-01**: Every phase-one operational API is independently protected by its applicable server-side contract. Legacy actions retain their existing guards; explicitly opted-in actions additionally evaluate independent `@Passport.rbac(...)` policy. Menu visibility, route admission, and browser filters are not API authority.
- **SRS-ADM-AUT-02**: Standard Passport admission remains in effect: unauthenticated requests are rejected and inactive callers cannot use protected administration. `systemAdmin` remains mandatory for protected control-plane workflows, while an opted-in delegated action may admit a caller through a valid RBAC decision without the RBAC guard inspecting or duplicating `systemAdmin` logic.
- **SRS-ADM-AUT-03**: Domain conflicts use stable application error codes and `409`; authentication failures remain `401`, and authorization failures remain `403`.

## Account Management Contracts

- **SRS-ADM-USR-01**: `admin-user` lists and views existing `homeUser` facts only in the active instance. List and view DTOs expose an intentional operational projection rather than an entity-shaped `IUser` dump.
- **SRS-ADM-USR-02**: The phase-one profile update allowlist is `avatar`, `email`, `mobile`, `locale`, and `tz`. Update validation is aware of the target record so a user may retain their own unique email value.
- **SRS-ADM-USR-03**: `id`, `iid`, timestamps, deletion state, `name`, credentials, authentication-provider records, password/reset lifecycle, actor identity, and target ownership are never browser-mutable. `name` remains immutable in phase one.
- **SRS-ADM-USR-04**: Activation is a dedicated command, not a generic profile patch. Any operation that can make a `systemAdmin` unusable delegates to the protected administrator service.
- **SRS-ADM-USR-05**: Public account deletion is deferred in phase one. Deactivation is the supported ordinary account-retirement operation until a future contract defines authentication, role/membership, Department-manager, audit, retention, and protected-administrator cascades.
- **SRS-ADM-USR-06**: User detail resolves and displays every active-instance role membership. Each role summary carries a presentation-only `systemAdmin` marker; it is not an authorization input.

## Ordinary Role Contracts

- **SRS-ADM-ROL-01**: `admin-role` manages the existing `homeRole` and `homeRoleUser` facts. It does not create a duplicate role or role-membership table.
- **SRS-ADM-ROL-02**: A role `name` is a trimmed, locale-neutral authorization identity, is case-insensitively unique in the active instance, and is immutable after creation. `title`, optional locales, and validated `siteIds` remain distinct fields.
- **SRS-ADM-ROL-03**: Role-name and membership business uniqueness use ordinary lookup indexes plus transactional service checks. Tenant-scoped business uniqueness must not use `table.unique(...)`.
- **SRS-ADM-ROL-04**: Configured built-in role definitions cannot be created, viewed, renamed, updated, deleted, or otherwise exposed through generic Role Resource lifecycle APIs. This definition protection applies to both `registeredUser` and `systemAdmin`.
- **SRS-ADM-ROL-05**: Generic role APIs must additionally reject all `systemAdmin` site-admission, delete, rename, candidate-selection, and membership-replacement changes. Only the protected workflow can grant or revoke `systemAdmin`.
- **SRS-ADM-ROL-06**: One canonical atomic non-system-administrator membership replacement command owns custom-role and `registeredUser` assignment. It validates every supplied role/user in active-instance scope, preserves an existing `systemAdmin` membership when omitted, rejects a supplied `systemAdmin` ID before any write, and leaves no partial relation set on failure.
- **SRS-ADM-ROL-07**: The guarded membership-candidate selector returns custom roles and `registeredUser` while server-enforcing exclusion of `systemAdmin`, including when a caller supplies a conflicting filter. It does not widen the generic Role Resource list or view contract.

## Protected System Administrator Contracts

### Sensitive commands and fresh verification

- **SRS-ADM-SUP-01**: `grantSystemAdmin` and `revokeSystemAdmin` are dedicated commands with dedicated DTOs. They require a target user, a mandatory normalized reason, and fresh reauthentication; generic role APIs cannot reach these mutations.
- **SRS-ADM-SUP-02**: Fresh reauthentication produces a provider-neutral proof bound to the actor, active instance, purpose, and short expiry. It is single-use or replay-protected and never stored in logs or audit rows. The implementation may require auth-provider adapter work; an existing session token is not fresh reauthentication.
- **SRS-ADM-SUP-03**: The acting caller must be activated and hold `systemAdmin`. A target user must be resolved through active-instance scope. Granting `systemAdmin` to an inactive target is rejected.

### Transaction and invariant

- **SRS-ADM-TXN-01**: Every mutation that can reduce usable `systemAdmin` authority executes in one `@Core.transaction()` service boundary. This includes revoke, account deactivation, future account deletion, and any replacement operation that would remove the protected membership.
- **SRS-ADM-TXN-02**: The protected service locks the active-instance `systemAdmin` role row, target user state, and relevant role-membership facts, then recounts activated, non-deleted `systemAdmin` users inside that transaction before mutation.
- **SRS-ADM-TXN-03**: The active instance must retain at least one activated `systemAdmin`. An operation that would break this invariant returns a stable `409` conflict and leaves role, user, and cache state unchanged.
- **SRS-ADM-TXN-04**: Competing protected operations are proved through explicitly concurrent requests in separate `mockCtx(...)` boundaries; test-runner parallelism is not contention proof. PostgreSQL locking evidence is required before release closure.

### Session and audit behavior

- **SRS-ADM-SUP-04**: After a successful protected role or activation change commits, the service schedules `bean.passport.kickOut(targetUser)` through a post-commit path. A post-commit eviction failure is retained as an operational failure record and retried by a durable recovery mechanism; it cannot roll back an already committed security mutation.
- **SRS-ADM-AUD-01**: Every accepted sensitive operation appends immutable evidence containing actor, target, command, result, normalized reason, correlation ID, proof method but never proof material, timestamp, and relevant before/after authority or activation state.
- **SRS-ADM-AUD-02**: Every rejected sensitive attempt also retains immutable evidence. Because rejection rolls back the protected mutation transaction, this evidence uses an independently committed audit boundary or equivalent durable mechanism.
- **SRS-ADM-AUD-03**: Audit records have no public generic update/delete action and remain active-instance-scoped.

## Department Forest Contracts

### Department data and tree lifecycle

- **SRS-ADM-DEP-01**: A Department persists `name`, nullable `parentId`, `enabled`, deterministic sibling ordering, and nullable `managerId`. `managerId` identifies the account of an enabled membership of that exact Department. It has no `organizationId` or Organization relationship.
- **SRS-ADM-DEP-02**: `parentId = null` is the only top-level representation. `0` is invalid. A non-null parent must be an existing Department in the active instance.
- **SRS-ADM-DEP-03**: Sibling Department names are case-insensitively unique within the same active-instance parent scope, including the root scope. Enforcement uses transaction-aware service logic and lookup indexes, never `table.unique(...)`.
- **SRS-ADM-DEP-04**: `moveDepartment` is a dedicated command rather than an unrestricted `parentId` patch. It locks and rechecks the moving node and destination ancestry in one transaction, rejecting self-parent and ancestor cycles.
- **SRS-ADM-DEP-05**: Normal deletion is rejected while a Department has children, active memberships, or a manager reference. It never recursively deletes a subtree or memberships implicitly.
- **SRS-ADM-DEP-06**: Disabling a Department prevents new memberships and manager assignment. The lifecycle command must first require explicit handling of active manager/membership dependencies; it does not silently cascade state through the subtree.
- **SRS-ADM-DEP-07**: Sibling display order is deterministic by `(sortOrder, id)` after active-instance and parent filtering.

### Membership and manager lifecycle

- **SRS-ADM-MEM-01**: A Department membership persists `departmentId`, `userId`, optional trimmed textual `position`, `enabled`, and `primary`. Position is scoped to the membership, never the global account.
- **SRS-ADM-MEM-02**: One enabled live membership for a `(departmentId, userId)` pair is enforced with active-instance-scoped transactional service logic and non-unique lookup indexes. Both referenced records must be found in active-instance scope.
- **SRS-ADM-MEM-03**: A user has at most one enabled primary membership in an active instance. Setting a new primary atomically clears the previous enabled primary. Removing or disabling a primary clears that state rather than silently choosing a replacement.
- **SRS-ADM-MEM-04**: A Department manager is represented by `managerId`, the account identity of an enabled membership of that exact Department. The manager-assignment command accepts `membershipId` to validate this relationship; assignment never creates a membership implicitly.
- **SRS-ADM-MEM-05**: Removing or disabling a manager membership requires an explicit replacement membership or clear command in the same transaction. The service persists the replacement membership's `userId` as `managerId`; an invalid manager relation is rejected with `409`.

## Dynamic RBAC and Data-Scope Contracts

### Action catalog and policy resolution

- **SRS-ADM-POL-01**: The reusable `a-rbac` catalog is built from registered Controller routes and includes only actions explicitly decorated with `@Passport.rbac(...)`. The catalog includes decorated actions even when their Controller is not annotated with `@Resource()`. A Controller with no decorated action remains outside dynamic RBAC; undecorated legacy actions require no migration or grant.
- **SRS-ADM-POL-02**: The canonical policy identity is `<controllerBeanFullName>#<action>`. HTTP method, route path, Resource identity, display label, and frontend permission metadata are not authorization identity. Catalog entries retain route/display metadata separately from the stable action key.
- **SRS-ADM-POL-03**: `actionInherit` may reference only an action in the current Controller's routed action list. Missing targets, self-reference, and cycles fail catalog construction or policy admission closed. Alias resolution does not cross Controllers and does not inspect frontend `permissionHint.actionInherit`.
- **SRS-ADM-POL-04**: `a-rbac` emits a typed policy request containing the catalog action descriptor and effective decorator options. `admin-rbac` resolves that request from active-instance identity, role, grant, and Department facts. A missing resolver, invalid decision, missing grant, unavailable target mapping, or stale action key returns deny; `a-rbac` does not import `admin-rbac`.
- **SRS-ADM-POL-05**: Grant lookup matches the exact canonical action key and enabled role/grant state in the active instance. A custom role has no dynamic authority until an enabled grant exists. Grant creation, update, Department association, deletion, role membership change, Department lifecycle change, and Department membership change participate in policy revision invalidation.
- **SRS-ADM-POL-06**: Every explicitly decorated `@Passport.rbac(...)` action first calls the configured `IRbacScopeAdapter.isUnrestricted()`. When it returns `true`, `GuardRbac` skips policy resolution, stores an allowed decision for the effective action with `terms: [{ dataScope: 'all' }]`, and admits the request. The default Start adapter maps this to `bean.passport.isSystemAdmin()`, while the adapter remains the customization point. When it returns `false`, normal policy resolution, typed decision validation, and default-deny behavior apply. `BeanRbacScope.current()` consumes the stored decision and does not independently recheck unrestricted status or resolve policy.
- **SRS-ADM-POL-07**: The RBAC guard retains normal `GuardBase` behavior for its own decision options. Standalone `@Passport.systemAdmin()` guards remain mandatory for protected control-plane workflows; paired fall-through `systemAdmin` decorators are not required on explicitly opted-in RBAC actions. Mutable grants cannot remove the protected `systemAdmin` recovery authority.

- **SRS-ADM-POL-08**: RBAC policy decisions are cached separately from coarse `a-permission` action projections. Any decision cache is keyed by active instance, subject/role revision, action key, and relevant Department/policy revision. Invalidation is revision-aware and must not expose a stale decision after a committed policy, membership, or Department-tree mutation.
- **SRS-ADM-POL-09**: Catalog and policy-editor projections expose only safe action metadata, supported scope options, and effective summaries. They must not expose raw policy predicates, hidden Department topology, grant internals, or server-only capability material that is not required for the operation.

### Scope semantics and server enforcement

- **SRS-ADM-SCP-01**: Supported terms are `all`, `customDepartments`, `ownDepartment`, `ownDepartmentAndDescendants`, and `mine`. An explicit `all` term means unrestricted rows within the active instance; it never crosses the tenant boundary. `IRbacScopeAccess.unrestricted` means that full-row scope and is derived only from the stored decision's `all` term.
- **SRS-ADM-SCP-02**: `customDepartments` matches only explicitly selected enabled Departments; it does not imply descendants. `ownDepartment` matches the caller's enabled Department memberships. `ownDepartmentAndDescendants` matches those enabled membership roots plus recursively discovered enabled descendants. Descendant traversal is cycle-safe and unavailable/disabled Departments do not match.
- **SRS-ADM-SCP-03**: `mine` matches only the authenticated subject's server-derived owner identity against the configured server-controlled owner field. The client cannot select the owner identity or substitute a different scope field. A missing or invalid target mapping denies rather than widening access.
- **SRS-ADM-SCP-04**: Effective grants combine as a logical union. `all` dominates; otherwise each valid Department or owner term remains an independent OR alternative. Scope kinds are not converted into a numeric ranking, and an empty restricted term set is distinct from unrestricted access and denies.
- **SRS-ADM-SCP-05**: Caller-supplied filters and server policy predicates are combined by structural logical AND. Implementations must not merge predicates by object spreading or allow an empty predicate to change denied, constrained, or unrestricted state. Active-instance filtering remains present in every ordinary model operation.
- **SRS-ADM-SCP-06**: The opted-in Controller/action boundary resolves the effective policy and constructs an explicit typed scope context. Neutral services apply that supplied context for select, view, create, update, delete, bulk, custom, and nested operations. Services enforce owner, Department, parent, and relationship consistency and never derive authority from Passport, browser input, menus, routes, opaque capabilities, or ambient request state. `@Arg.filter(...)`, validation pipes, frontend filters, menus, route permissions, and opaque capabilities are ergonomics or UX projections, not authorization boundaries.
- **SRS-ADM-SCP-07**: Select applies the Controller-supplied effective scope before the single authoritative query/count. View treats an out-of-scope row as absent at the Controller boundary. Mutation Controllers preflight targets and pass only trusted context to neutral services. The training Record service uses direct ORM CRUD and ids-only bulk deletion without an application transaction or row lock; complete target validation and scope admission happen before deletion, while multi-row and nested operations do not claim rollback or concurrency serialization. Other domain services may retain stronger transaction requirements where their contracts demand them. Bulk mutation validates the complete target set before mutation; atomicity is not implied by this preflight.
- **SRS-ADM-SCP-08**: The Controller/action boundary derives owner and Department fields from the authenticated subject, parent resource, or protected server context, and passes them through a private typed context or server-enriched input. It rejects or ignores client attempts to forge those fields. A resource with no valid policy mapping or no valid scope decision is denied by default.
- **SRS-ADM-SCP-09**: Backend-derived Resource action permissions may be emitted only as constrained UX projections. Legacy or non-RBAC actions may remain booleans. An RBAC action projection contains only its canonical action key, final allowed result, and either an `all` matcher or normalized row-field/accepted-value rules required to evaluate row/detail visibility. It never exposes HTTP routes, guard options, raw policy expressions, or role/grant topology, and the backend re-evaluates authority on every direct request.

### Training acceptance slice

- **SRS-ADM-SCP-10**: Deliberately opted-in `training-student:student` and `training-record:record` actions are the first scoped acceptance resources; unrelated existing Controllers remain unchanged unless explicitly decorated.
- **SRS-ADM-SCP-11**: Student and Record persist server-controlled `departmentId` and `userIdOwner` fields. Student create derives and stamps ownership from authenticated protected context; ordinary Student update preserves the persisted ownership and cannot transfer it. Record Department and owner values always match its Student and cannot be supplied or overridden by the client.
- **SRS-ADM-SCP-12**: Controller-authorized Student create/update and nested Record writes validate inherited scope through the trusted server-enriched mutation path. Standalone Record create preflights its Student at the Controller boundary before the neutral service copies scope. Record reparenting is rejected unless a separately authorized reparenting contract is introduced; nested writes cannot bypass the Student/Record domain consistency rules. Record create derives `departmentId` and `userIdOwner` from the selected Student, and Record update excludes those server-controlled fields. Record nested relation writes intentionally use the same direct ORM path as Student and therefore do not claim transactional rollback.
- **SRS-ADM-SCP-12a**: Student bulk deletion and Record bulk deletion are exposed as `DELETE /training/student/bulk` and `DELETE /training/record/bulk`, respectively, with ids-only commands. Each Controller rejects empty, duplicate, missing, or out-of-scope targets before invoking deletion; `summary` inherits `view`, and `deleteForce`/`deleteBulk` inherit `delete`. Student and Record bulk update endpoints are not part of this contract.
- **SRS-ADM-SCP-13**: Training schema changes are folded into the existing version-1 creation paths. `training-student` and `training-record` retain `vonaModule.fileVersion: 1`; no version-2 migration is introduced by this slice. Any `meta.version.ts` change requires the repository test database reset and `npm run test`.

## API, DTO, and Frontend State Contracts

- **SRS-ADM-API-01**: Resource identities are `admin-user:user`, `admin-role:role`, and `admin-department:department`. Conventional Resource operations are exposed only when their lifecycle is supported; `admin-user` has no create action until an authentication/credential creation workflow exists.
- **SRS-ADM-API-02**: Operation DTOs are narrow. Dedicated commands cover account activation, non-system-administrator membership replacement, system administrator grant/revoke, Department move and activation, manager assignment, and membership create/update/delete/primary operations.
- **SRS-ADM-API-03**: Generic DTOs never accept authoritative instance scope, protected state transitions, actor identity, target ownership, or nested arbitrary entity writes. The Controller-to-service scope context is a private typed internal value, never a wire input or OpenAPI request field. List, view, create, update, and command DTOs are distinct where their audience or fields differ.
- **SRS-ADM-UI-01**: Conventional Start Admin resources use `presetResource` and selector-scoped `rest-resource.model.resource`. It remains the owner of schemas, permissions, standard queries/mutations, query keys, and invalidation.
- **SRS-ADM-UI-02**: A module-local Zova model is permitted only as a thin semantic façade for custom commands. It delegates to the same Resource selector and uses `queryItem` / `mutationItem` so it cannot become a competing CRUD/cache owner.
- **SRS-ADM-UI-03**: Menu roles and route admission support navigation but never replace Vona API authorization. Custom action visibility cannot imply permission.
- **SRS-ADM-API-04**: Backend entities, DTOs, controllers, validation, and OpenAPI are Vona contract truth. Generate Zova consumers through the forward contract loop; generated API/types are never hand-edited.
- **SRS-ADM-API-05**: A frontend route, renderer, metadata, menu-resource, or other reverse-chain change requires `npm run build:zova:admin` and then `npm run deps:vona`. REST-only output is insufficient because Start Admin SSR and REST artifacts move together.

## Non-Functional and Migration Requirements

- **SRS-ADM-NFR-01**: Protected operations, Department mutations, and membership transitions are attributable, transactionally consistent, active-instance-isolated, and cache-consistent after commit or rollback.
- **SRS-ADM-NFR-02**: PostgreSQL verification covers protected-administrator, tree, and membership contention. Focused tests prove all deliberately competing operations with explicit concurrent business calls.
- **SRS-ADM-NFR-03**: Every test-owned persistent record is removed in `finally` using exact identities and reverse dependency order. Shared durable fixtures use the owning module `meta.version.ts` seed hook and remain read-only to tests.
- **SRS-ADM-NFR-04**: Before changing an existing persisted resource, the implementer asks whether `vonaModule.fileVersion` must increment. Every `meta.version.ts` change requires `npm run test`.

## Acceptance Mapping

| PRD family                      | SRS contracts                                                     | Delivery work                                     | Acceptance scenarios                                                                                                                          |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `PRD-ADM-USR-*`                 | `SRS-ADM-USR-*`                                                   | `WBS-ADM-30-*`                                    | `ATP-ADM-USR-01`                                                                                                                              |
| `PRD-ADM-ROL-*`                 | `SRS-ADM-ROL-*`                                                   | `WBS-ADM-30-*`                                    | `ATP-ADM-ROL-01`                                                                                                                              |
| `PRD-ADM-SUP-*`                 | `SRS-ADM-SUP-*`, `SRS-ADM-TXN-*`, `SRS-ADM-AUD-*`                 | `WBS-ADM-40-*`                                    | `ATP-ADM-SUP-*`                                                                                                                               |
| `PRD-ADM-DEP-*`                 | `SRS-ADM-DEP-*`                                                   | `WBS-ADM-50-*`                                    | `ATP-ADM-DEP-*`                                                                                                                               |
| `PRD-ADM-MEM-*`                 | `SRS-ADM-MEM-*`                                                   | `WBS-ADM-60-*`                                    | `ATP-ADM-MEM-*`, `ATP-ADM-MGR-01`                                                                                                             |
| `PRD-ADM-POL-*`                 | `SRS-ADM-POL-*`                                                   | `WBS-ADM-80-01`, `WBS-ADM-80-02`, `WBS-ADM-80-04` | `ATP-ADM-POL-01`–`ATP-ADM-POL-04`                                                                                                             |
| `PRD-ADM-SCP-*`                 | `SRS-ADM-SCP-*`                                                   | `WBS-ADM-80-02`, `WBS-ADM-80-03`, `WBS-ADM-80-04` | `ATP-ADM-SCP-01`, `ATP-ADM-SCP-02`, `ATP-ADM-POL-04`                                                                                          |
| `PRD-ADM-SEC-*`, `PRD-ADM-UI-*` | `SRS-ADM-TEN-*`, `SRS-ADM-AUT-*`, `SRS-ADM-API-*`, `SRS-ADM-UI-*` | `WBS-ADM-20-*`, `WBS-ADM-70-*`, `WBS-ADM-80-*`    | `ATP-ADM-TEN-01`, `ATP-ADM-AUT-01`, `ATP-ADM-CTR-01`, `ATP-ADM-RES-01`–`ATP-ADM-RES-03`, `ATP-ADM-SSR-01`, `ATP-ADM-POL-03`, `ATP-ADM-POL-04` |

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
- [ADR 0002: Dynamic RBAC and Department Data Scope](./decisions/0002-dynamic-rbac-and-data-scope.md)
- [User Access Guide](../../../repo-docs/backend/user-access-guide.md)
- [Contract Loop Playbook](../../../repo-docs/fullstack/contract-loop-playbook.md)
- [Admin Resource and Web Self-Service](../../../repo-docs/fullstack/admin-resource-and-web-self-service.md)
