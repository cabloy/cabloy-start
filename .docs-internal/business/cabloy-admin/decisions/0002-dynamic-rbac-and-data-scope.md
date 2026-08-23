# ADR 0002: Dynamic RBAC and Department Data Scope

## Status

Accepted.

## Background

ADR 0001 established Cabloy Admin as a suite-first system-management domain and deliberately deferred dynamic role-to-action authorization and Department data scopes. The implementation now requires a reusable authorization mechanism and a Start-specific policy domain without weakening the active-instance boundary or the protected `systemAdmin` recovery authority.

This ADR supersedes only ADR 0001's deferral of dynamic RBAC and Department data scopes. ADR 0001 remains the historical record of the Phase 1 boundary, identity/role ownership, Department model, Start Admin application, and protected administrator decisions.

## Problem

A Resource-only permission projection cannot express all intended authorization objects: some relevant Controllers are not `@Resource()` Controllers, and Department/owner scope is user-specific. A frontend permission matrix is also insufficient because direct API calls, stale browser state, nested mutations, and concurrent changes must remain protected by server-side policy.

The design must therefore define one stable action identity, an explicit opt-in rule, reusable guard mechanics, Start-owned Department semantics, default-deny behavior, and a traceable policy-editor/capability boundary.

## Decision

### Separate reusable RBAC mechanics from Start policy

The paired `a-rbac` modules own reusable mechanics:

- `@Passport.rbac(...)` integration and normal `GuardBase` composition;
- the action catalog and canonical action identity;
- typed policy request/decision and scope-term contracts;
- same-Controller `actionInherit` validation;
- fail-closed predicate/capability contracts and policy request state.

The Start `admin-rbac` modules own:

- role-to-action grant and custom-Department persistence;
- policy administration and catalog projection;
- Department membership and descendant resolution;
- policy revision and invalidation integration;
- Cabloy Admin policy-editor presentation.

`a-rbac` does not import or duplicate Department, role, `systemAdmin`, or Admin business semantics. Start resolves the generic policy event using the existing identity/role facts and `admin-department` facts.

### Make explicit action opt-in the catalog boundary

Only an action explicitly decorated with `@Passport.rbac(...)` enters the dynamic RBAC catalog. The catalog includes decorated actions whether or not the Controller uses `@Resource()`. A Controller with no RBAC-decorated action remains outside dynamic RBAC, and existing undecorated actions require no migration or new grant.

The canonical action key is:

```text
<controllerBeanFullName>#<action>
```

HTTP method, route path, and Resource metadata are display or integration metadata, not authorization identity. `actionInherit` is an action name from the same Controller's routed action list; a missing target, self-reference, or cycle is invalid. It is distinct from a frontend permission hint.

### Let opted-in RBAC actions admit unrestricted subjects through the scope adapter

Every explicitly decorated `@Passport.rbac(...)` action first asks the configured `IRbacScopeAdapter.isUnrestricted()` whether the current subject receives the default unrestricted admission. The default Start adapter returns `bean.passport.isSystemAdmin()`, while another adapter may define an equivalent business subject. When the adapter returns `true`, `GuardRbac` skips dynamic policy resolution, stores an allowed decision with `terms: [{ dataScope: 'all' }]` for the effective action, and admits the request. `BeanRbacScope.current()` consumes that request-local decision; it does not independently recheck unrestricted status or resolve policy a second time.

When the adapter returns `false`, the action follows ordinary dynamic policy resolution and default-deny validation. `all` is an explicit full-row scope within the active instance, and `IRbacScopeAccess.unrestricted` is derived from the decision's `all` term. The RBAC guard still follows normal `GuardBase` options for its own decision, while standalone `@Passport.systemAdmin()` guards remain appropriate for protected control-plane workflows. A paired fall-through `systemAdmin` decorator is not required on an opted-in RBAC action.

### Use default deny and union-based scope semantics

An anonymous subject, missing grant, invalid catalog/alias, unavailable resolver, invalid target mapping, disabled scope target, or empty restricted result denies access. The active Vona instance remains the only tenant boundary; no browser-supplied actor, tenant, Department authority, or raw predicate is trusted.

The supported scopes are:

- `all`: no additional row predicate within the active instance;
- `customDepartments`: explicitly selected enabled Departments, without implicit descendants;
- `ownDepartment`: enabled Department memberships only;
- `ownDepartmentAndDescendants`: enabled membership roots and recursively enabled descendants;
- `mine`: the authenticated subject matches the server-controlled owner field.

Matching grants from multiple roles form a logical union. `all` dominates; otherwise Department terms and owner terms remain independent OR alternatives. Scope kinds are not reduced to a numeric ranking. Caller filters and server policy predicates are combined with structural logical AND. The opted-in Controller/action boundary resolves the effective policy from authenticated, active-instance server context and constructs a typed internal authoritative scope context. Neutral domain services apply that supplied context to select, view, create, update, delete, bulk, custom, and nested operations; enforce owner, Department, parent, and relationship consistency; and never derive authority from Passport, browser input, menus, routes, opaque capabilities, or ambient request state. The training Record service deliberately uses direct ORM CRUD and ids-only bulk deletion without an application transaction or row lock; its Controller performs complete target and relationship preflight, but nested and multi-row writes do not claim rollback or concurrency serialization. Frontend permissions and opaque row/detail capabilities are UX projections only.

### Retain all compatible create scopes in the policy editor

The policy editor must present every `dataScopes` option that the server catalog declares compatible with a cataloged `create` action. It must not apply a create-specific filter that reduces the choice to `ownDepartment`, `mine`, the creator's resolved Department, or another inferred subset. Compatibility remains a server contract: `all` is always available; `customDepartments`, `ownDepartment`, and `ownDepartmentAndDescendants` require a valid configured Department field; and `mine` requires a valid configured owner field. Therefore, a normal `@Passport.rbac({ dataScope: true })` create action exposes all five scope terms, while an unscoped action or an action with unavailable scope mappings exposes only the scopes that remain compatible under the catalog contract.

This presentation rule preserves valid delegation paths. A grant is a role/action policy alternative, and matching grants combine by union; hiding a compatible Department or owner term from a create action would remove an authorization path that the server can otherwise safely evaluate. The editor configures grants, not caller-selected record ownership. At runtime, `BeanRbacScope.current()` derives the create candidate's Department and owner values from protected server context and verifies that candidate against the effective union decision before exposing it to the action implementation. Student create stamps those server-derived values, including nested Records, while standalone Record create authorizes its selected Student and copies that Student's ownership. Browser input cannot select a Department or owner to manufacture create authority.

### Preserve protected control-plane authority

RBAC policy administration, bootstrap/repair, and protected `systemAdmin` grant, revoke, activation, account-status, audit, and session-eviction workflows remain protected control-plane operations. Mutable grants cannot remove the recovery authority required by the existing protected workflow. A baseline grant may preserve protected access to deliberately opted-in delegated actions, but it is not an implicit bypass for every action.

Organization, manager-derived authorization, role hierarchy, employment workflows, and a Position catalog remain deferred. A Department remains an in-instance business structure, not a tenant.

### Use Student and Record as the first acceptance slice

Selected `training-student:student` and `training-record:record` actions may be deliberately opted into RBAC for development and acceptance coverage; this does not migrate unrelated existing business actions. Student and Record use server-controlled `departmentId` and `userIdOwner` fields. Student create stamps the authenticated server-derived values, while ordinary Student update preserves the persisted ownership. Record scope is inherited from its Student, including nested relation writes, and clients cannot transfer ownership or scope by submitting those fields.

The canonical Student command surface includes `POST /training/student`, `GET /training/student`, `GET /training/student/:id`, `GET /training/student/summary/:id` (inherits `view`), `PATCH /training/student/:id`, `DELETE /training/student/:id`, `DELETE /training/student/deleteForce/:id` (inherits `delete`), and `DELETE /training/student/bulk` with `DtoStudentBulkDelete` (inherits `delete`). The canonical Record mutation surface includes standard Record CRUD plus `DELETE /training/record/bulk` with `DtoRecordBulkDelete` (inherits `delete`); neither training module exposes a bulk-update route. Bulk targets are validated as a complete, unique, present, and in-scope set before deletion. Record create copies ownership from its selected Student, and its nested relation writes use direct ORM operations without application-level transaction or row-lock guarantees.

Both training modules retain `vonaModule.fileVersion: 1`. Their scope columns are placed in the existing version-1 schema creation paths; no version-2 migration is introduced by this decision.

## Consequences

- Action catalog, policy grants, and data scope become traceable product and technical contracts rather than undocumented implementation details.
- The policy domain can support non-Resource Controllers without changing the existing `a-permission` Resource cache into a user-specific policy evaluator.
- Every opted-in action requires a catalog entry, an explicit target mapping when scoped, a policy decision, and an explicit typed Controller-to-service scope handoff. The Controller/action boundary is the policy and scope authority; neutral services apply the supplied context and enforce domain consistency. The training Record service is intentionally a direct, non-transactional ORM path, so its Controller preflight does not imply rollback or concurrency serialization. A decorator alone is not a row-authorization boundary.
- Policy changes, role membership changes, Department tree/lifecycle changes, and Department membership changes require separate RBAC invalidation from coarse permission-cache invalidation.
- Training schema changes remain version-1 creation-path changes and require the repository test database to be recreated and tested before implementation closure.
- The Admin policy editor must expose safe catalog metadata and effective summaries, never raw predicates, hidden topology, or grant internals that are not needed for the operation. Future policy-editor implementations must consume a catalog action's compatible `dataScopes` as supplied and must not add create-specific filtering without a superseding decision.

## Alternatives Rejected

- **Migrate every existing Controller:** rejected. Explicit decorator opt-in avoids changing legacy authorization behavior and keeps adoption deliberate.
- **Use Resource identity or HTTP route as the policy key:** rejected. It excludes non-Resource actions and makes route refactors authorization changes.
- **Put Department semantics in generic `a-rbac`:** rejected. Department and active-instance facts belong to Start policy; generic mechanics must remain reusable.
- **Treat the frontend matrix or row capability as authorization:** rejected. Browser state is stale and caller-controlled; backend policy and scoped service queries remain authoritative.
- **Rank scope kinds numerically:** rejected. Mixed Department and owner terms require union semantics, not an artificial precedence order.

## Related Records

- [Cabloy Admin internal planning index](../README.md)
- [Cabloy Admin Product Requirements Document](../prd.md)
- [Software Requirements Specification](../srs.md)
- [Product Delivery Plan and Work Breakdown Structure](../pdp-wbs.md)
- [Test Strategy and Acceptance Plan](../test-plan.md)
- [Delivery Progress](../progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./0001-admin-mvp-boundaries.md)
- [Suites and Modules](../../../../cabloy-docs/fullstack/suites-and-modules.md)
- [User Access Guide](../../../../cabloy-docs/backend/user-access-guide.md)
- [Admin Resource and Web Self-Service](../../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md)
- [Contract Loop Playbook](../../../../cabloy-docs/fullstack/contract-loop-playbook.md)
