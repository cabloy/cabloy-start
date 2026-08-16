# Cabloy Admin Software Requirements Specification

## Purpose and Authority

This specification translates the [Cabloy Admin PRD](./prd.md) and [ADR 0001](./decisions/0001-admin-mvp-boundaries.md) into implementable, testable technical contracts. It is the authority for data and capability ownership, server-side authorization, API and DTO boundaries, transactions, invariants, cache ownership, and contract-loop behavior. The [PDP/WBS](./pdp-wbs.md) sequences delivery; the [test plan](./test-plan.md) defines how these contracts are proved.

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

| Owner                  | Owns                                                                                                                                    | Does not own                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `admin-user`           | Account-management projections, permitted profile updates, activation commands, role/Department composition                             | Account identity, credentials, auth providers, Passport persistence |
| `admin-role`           | Ordinary-role management façade, ordinary role memberships, protected `systemAdmin` workflow, sensitive-operation audit                 | A replacement role or role-membership entity                        |
| `admin-department`     | Department forest, Department memberships, position text, primary membership, manager lifecycle                                         | Tenant identity, Organization, dynamic data scope                   |
| `home-user` / `a-user` | `homeUser`, `homeRole`, `homeRoleUser`, authentication, Passport, tokens, stable `bean.user`, `bean.role`, and `bean.passport` surfaces | Cabloy Admin operational use cases                                  |
| `rest-resource`        | Conventional Admin Resource bootstrap, schemas, permissions, queries, mutations, query keys, and invalidation                           | Domain-specific custom-command semantics                            |

`bean.user` and `bean.role` do not currently expose every operation required by Cabloy Admin. Cabloy Admin services must add managed façades around those facts rather than bypassing or duplicating their ownership.

## Tenant and Authorization Contracts

- **SRS-ADM-TEN-01**: The active Vona instance is the tenant for every Cabloy Admin query, mutation, relation traversal, audit lookup, background path, and recovery path.
- **SRS-ADM-TEN-02**: Every new Department, membership, and sensitive-operation audit model uses normal active-instance scope. No Cabloy Admin model sets `disableInstance`.
- **SRS-ADM-TEN-03**: Request DTOs never accept authoritative `iid`, instance ID, instance name, actor identity, or Department scope. The server derives each authority from the active context and protected resource lookup.
- **SRS-ADM-TEN-04**: A cross-instance record is treated as absent. Services must not use an unscoped probe merely to distinguish `403` from a scoped not-found result.
- **SRS-ADM-AUT-01**: Every phase-one operational API is independently protected by `@Passport.systemAdmin()` or an equivalent server-side guard. Menu visibility, route admission, and browser filters are not API authority.
- **SRS-ADM-AUT-02**: Standard Passport admission remains in effect: unauthenticated requests are rejected, inactive callers cannot use protected administration, and the active caller must hold `systemAdmin`.
- **SRS-ADM-AUT-03**: Domain conflicts use stable application error codes and `409`; authentication failures remain `401`, and authorization failures remain `403`.

## Account Management Contracts

- **SRS-ADM-USR-01**: `admin-user` lists and views existing `homeUser` facts only in the active instance. List and view DTOs expose an intentional operational projection rather than an entity-shaped `IUser` dump.
- **SRS-ADM-USR-02**: The phase-one profile update allowlist is `avatar`, `email`, `mobile`, `locale`, and `tz`. Update validation is aware of the target record so a user may retain their own unique email value.
- **SRS-ADM-USR-03**: `id`, `iid`, timestamps, deletion state, `name`, credentials, authentication-provider records, password/reset lifecycle, actor identity, and target ownership are never browser-mutable. `name` remains immutable in phase one.
- **SRS-ADM-USR-04**: Activation is a dedicated command, not a generic profile patch. Any operation that can make a `systemAdmin` unusable delegates to the protected administrator service.
- **SRS-ADM-USR-05**: Public account deletion is deferred in phase one. Deactivation is the supported ordinary account-retirement operation until a future contract defines authentication, role/membership, Department-manager, audit, retention, and protected-administrator cascades.

## Ordinary Role Contracts

- **SRS-ADM-ROL-01**: `admin-role` manages the existing `homeRole` and `homeRoleUser` facts. It does not create a duplicate role or role-membership table.
- **SRS-ADM-ROL-02**: A role `name` is a trimmed, locale-neutral authorization identity, is case-insensitively unique in the active instance, and is immutable after creation. `title`, optional locales, and validated `siteIds` remain distinct fields.
- **SRS-ADM-ROL-03**: Role-name and membership business uniqueness use ordinary lookup indexes plus transactional service checks. Tenant-scoped business uniqueness must not use `table.unique(...)`.
- **SRS-ADM-ROL-04**: Configured built-in role names cannot be renamed or deleted through generic role operations. Generic membership replacement cannot add, remove, or indirectly alter a configured built-in role membership.
- **SRS-ADM-ROL-05**: Generic role APIs must additionally reject all `systemAdmin` site-admission, delete, rename, and membership-replacement changes. Only the protected workflow can grant or revoke `systemAdmin`.
- **SRS-ADM-ROL-06**: One canonical atomic ordinary-membership replacement command owns ordinary role assignment. It validates every supplied role/user in active-instance scope, excludes protected memberships, and leaves no partial relation set on failure.

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

## API, DTO, and Frontend State Contracts

- **SRS-ADM-API-01**: Resource identities are `admin-user:user`, `admin-role:role`, and `admin-department:department`. Conventional Resource operations are exposed only when their lifecycle is supported; `admin-user` has no create action until an authentication/credential creation workflow exists.
- **SRS-ADM-API-02**: Operation DTOs are narrow. Dedicated commands cover account activation, ordinary-role membership replacement, system administrator grant/revoke, Department move and activation, manager assignment, and membership create/update/delete/primary operations.
- **SRS-ADM-API-03**: Generic DTOs never accept authoritative instance scope, protected state transitions, actor identity, target ownership, or nested arbitrary entity writes. List, view, create, update, and command DTOs are distinct where their audience or fields differ.
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

| PRD family                      | SRS contracts                                                     | Delivery work                  | Acceptance scenarios                                                                     |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| `PRD-ADM-USR-*`                 | `SRS-ADM-USR-*`                                                   | `WBS-ADM-30-*`                 | `ATP-ADM-USR-01`                                                                         |
| `PRD-ADM-ROL-*`                 | `SRS-ADM-ROL-*`                                                   | `WBS-ADM-30-*`                 | `ATP-ADM-ROL-01`                                                                         |
| `PRD-ADM-SUP-*`                 | `SRS-ADM-SUP-*`, `SRS-ADM-TXN-*`, `SRS-ADM-AUD-*`                 | `WBS-ADM-40-*`                 | `ATP-ADM-SUP-*`                                                                          |
| `PRD-ADM-DEP-*`                 | `SRS-ADM-DEP-*`                                                   | `WBS-ADM-50-*`                 | `ATP-ADM-DEP-*`                                                                          |
| `PRD-ADM-MEM-*`                 | `SRS-ADM-MEM-*`                                                   | `WBS-ADM-60-*`                 | `ATP-ADM-MEM-*`, `ATP-ADM-MGR-01`                                                        |
| `PRD-ADM-SEC-*`, `PRD-ADM-UI-*` | `SRS-ADM-TEN-*`, `SRS-ADM-AUT-*`, `SRS-ADM-API-*`, `SRS-ADM-UI-*` | `WBS-ADM-20-*`, `WBS-ADM-70-*` | `ATP-ADM-TEN-01`, `ATP-ADM-AUT-01`, `ATP-ADM-CTR-01`, `ATP-ADM-RES-01`, `ATP-ADM-SSR-01` |

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
- [User Access Guide](../../../cabloy-docs/backend/user-access-guide.md)
- [Contract Loop Playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
- [Admin Resource and Web Self-Service](../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md)
