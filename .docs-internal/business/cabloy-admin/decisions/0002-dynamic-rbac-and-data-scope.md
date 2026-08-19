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

### Keep guards independent and composable

The RBAC guard evaluates only its own dynamic policy. It follows normal `GuardBase` semantics: a matching decision passes unless `passWhenMatched === false`, in which case the chain continues; a mismatch rejects unless `rejectWhenDismatched === false`, in which case the chain continues.

This permits composition such as:

```ts
@Web.post('someAction')
@Passport.rbac({ dataScope: true })
@Passport.systemAdmin({ passWhenMatched: true, rejectWhenDismatched: false })
async someAction() {}
```

The RBAC guard does not inspect, duplicate, or depend on `systemAdmin` logic. Existing Passport authentication, activation, and account-status behavior remains authoritative.

### Use default deny and union-based scope semantics

An anonymous subject, missing grant, invalid catalog/alias, unavailable resolver, invalid target mapping, disabled scope target, or empty restricted result denies access. The active Vona instance remains the only tenant boundary; no browser-supplied actor, tenant, Department authority, or raw predicate is trusted.

The supported scopes are:

- `all`: no additional row predicate within the active instance;
- `customDepartments`: explicitly selected enabled Departments, without implicit descendants;
- `ownDepartment`: enabled Department memberships only;
- `ownDepartmentAndDescendants`: enabled membership roots and recursively enabled descendants;
- `mine`: the authenticated subject matches the server-controlled owner field.

Matching grants from multiple roles form a logical union. `all` dominates; otherwise Department terms and owner terms remain independent OR alternatives. Scope kinds are not reduced to a numeric ranking. Caller filters and server policy predicates are combined with structural logical AND. Frontend permissions and opaque row/detail capabilities are UX projections only; backend services remain authoritative for select, view, create, update, delete, bulk, custom, and nested operations.

### Preserve protected control-plane authority

RBAC policy administration, bootstrap/repair, and protected `systemAdmin` grant, revoke, activation, account-status, audit, and session-eviction workflows remain protected control-plane operations. Mutable grants cannot remove the recovery authority required by the existing protected workflow. A baseline grant may preserve protected access to deliberately opted-in delegated actions, but it is not an implicit bypass for every action.

Organization, manager-derived authorization, role hierarchy, employment workflows, and a Position catalog remain deferred. A Department remains an in-instance business structure, not a tenant.

### Use Student and Record as the first acceptance slice

Selected `training-student:student` and `training-record:record` actions may be deliberately opted into RBAC for development and acceptance coverage; this does not migrate unrelated existing business actions. Student and Record use server-controlled `departmentId` and `userIdOwner` fields. Record scope is inherited from its Student, including nested relation writes, and clients cannot transfer ownership or scope by submitting those fields.

Both training modules retain `vonaModule.fileVersion: 1`. Their scope columns are placed in the existing version-1 schema creation paths; no version-2 migration is introduced by this decision.

## Consequences

- Action catalog, policy grants, and data scope become traceable product and technical contracts rather than undocumented implementation details.
- The policy domain can support non-Resource Controllers without changing the existing `a-permission` Resource cache into a user-specific policy evaluator.
- Every opted-in action requires a catalog entry, an explicit target mapping when scoped, a policy decision, and service-level enforcement. A decorator alone is not a row-authorization boundary.
- Policy changes, role membership changes, Department tree/lifecycle changes, and Department membership changes require separate RBAC invalidation from coarse permission-cache invalidation.
- Training schema changes remain version-1 creation-path changes and require the repository test database to be recreated and tested before implementation closure.
- The Admin policy editor must expose safe catalog metadata and effective summaries, never raw predicates, hidden topology, or grant internals that are not needed for the operation.

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
