# RBAC Authorization

RBAC Authorization decides whether a backend action is allowed and, for scoped actions, which persisted data the caller may reach. It is server-enforced action and data authorization.

Read [Shared RBAC Architecture](https://cabloy.com/backend/shared-rbac-architecture) first for the shared Basic/Start `a-rbac` runtime, Resource permission projection, frontend matcher, SSR, and freshness model. This page focuses on the Cabloy Start suite policy: roles, grants, Departments, and administration workflow.

> **Warning:** RBAC is not authentication, SSR menu disclosure, or a frontend-button rule. A hidden action may improve UX, but every direct Vona request must pass the backend guard and, when applicable, the server-side data-scope check.

> This guide covers the `admin-rbac` policy implementation in the commercially licensed `cabloy-admin` suite for Cabloy Start. The shared `a-rbac` runtime remains a framework capability.

## The protected-action model

A controller opts an action into dynamic RBAC with `@Passport.rbac(...)` metadata. A representative scoped action looks like this:

```typescript
@Web.get()
@Passport.rbac({ dataScope: true })
async select(...) {
  return await this.scope.service.record.select({
    where: this.ctx.rbacScopeCurrent.where(where),
  });
}
```

The exact decorator options depend on the action contract. The important rule is that protected controllers consume the resulting request-local scope instead of treating guard admission as a complete row-level decision.

The runtime chain is:

```text
cataloged route action
  → current Passport role IDs
  → enabled role/action grants
  → allowed policy terms
  → typed scope operations in the controller
  → ORM query filter or persisted-entry check
```

For updates, views, and deletes, use the appropriate scope operation such as `checkEntry(...)` or `checkEntries(...)`. For creates, derive trusted owner/Department values with `ownerValues()` rather than accepting values that can widen a client request.

## Role, action, and scope grants

A grant binds a role to a stable catalog action and a compatible data scope:

```text
roleId + actionKey + dataScope + enabled
```

The catalog comes from routes decorated with `@Passport.rbac(...)`; ordinary routes do not become dynamic RBAC actions merely because they are visible in a UI. The Start catalog also supports controlled action inheritance, validated centrally to reject missing targets and cycles.

Multiple enabled grants held through the current user's roles combine as a union. A caller-provided query filter remains additionally constrained by the server scope, rather than replacing it.

## Data scopes

The suite supports these five scopes:

| Scope                         | Effective data boundary                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `all`                         | All records within the active Vona instance                    |
| `customDepartments`           | Records belonging to explicitly configured enabled Departments |
| `ownDepartment`               | Records in the caller's enabled Department scope               |
| `ownDepartmentAndDescendants` | Caller Department scope plus enabled descendants               |
| `mine`                        | Records owned by the current user                              |

`all` dominates narrower terms. Department-aware terms depend on enabled memberships and enabled Department topology; descendant expansion must be cycle-safe. A non-data-scoped action accepts only the scope compatible with its catalog definition.

Departments are inputs to the policy, not alternative authorization stores. Read [Department Management](department-management.md) before designing Department-scoped grants.

## Runtime authority and frontend projections

Resource permissions are derived from the same guards to support frontend action visibility. They are UX projections, not a second grant database and never the final authority:

```text
frontend permission projection → UX decision
backend RBAC guard/scope       → authoritative decision
```

For the shared guard simulation, projection contract, matcher semantics, SSR behavior, and active-tab freshness limitation, read [Shared RBAC Architecture](https://cabloy.com/backend/shared-rbac-architecture). This distinction prevents stale browser state, crafted requests, and hidden-button assumptions from becoming security vulnerabilities.

## Policy freshness

A grant change, role-membership change, Department-membership change, or Department-topology change can affect later policy resolution. The Start implementation emits `a-rbac:policyInvalidated`, advances policy revision state, and clears dependent permission caches after the relevant transaction commits.

Treat this as a dependency graph: source mutations must refresh every warmed policy or permission projection that depends on them. Do not hand-patch a browser cache while leaving the server policy stale.

## System-administrator safeguards

The Start grant service/editor excludes `systemAdmin` from ordinary grant management, and its scope adapter treats that subject as unrestricted for the RBAC decision path. These are explicit Start operational safeguards, not a guarantee that every Cabloy edition exposes the same UI or management rule.

Whatever the edition, protect administrator transitions deliberately and ensure the final backend decision remains explicit, testable, and server-owned.

## Implementation references

Source paths below are relative to the Cabloy Start repository root:

- `vona/src/suite/cabloy-admin/modules/admin-rbac/src/lib/rbacPolicy.ts` — scope compatibility and action inheritance rules.
- `vona/src/suite/cabloy-admin/modules/admin-rbac/src/service/rbacPolicy.ts` — role/grant lookup and Department/user-term resolution.
- `vona/src/suite/cabloy-admin/modules/admin-rbac/src/service/rbacGrant.ts` — mutation validation and invalidation.
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/bean/guard.rbac.ts` and `bean.rbacScope.ts` — guard-time decision and typed scope consumption.

## Verification checklist

1. Confirm an unauthenticated or ungranted caller is denied for every opted-in action.
2. Test each supported scope with persisted data, not only a frontend visibility assertion.
3. Verify forged owner/Department values cannot widen create, update, view, delete, or bulk operations.
4. Grant two scopes through multiple roles and confirm their permitted terms combine as expected.
5. Change a grant, role membership, or Department topology and verify subsequent server decisions and frontend projections refresh.
6. Verify a visible menu or button never makes an ungranted direct API request succeed.

## Read next

- [Shared RBAC Architecture](https://cabloy.com/backend/shared-rbac-architecture)
- [Role Management](role-management.md)
- [Department Management](department-management.md)
- [Menu Authorization](menu-authorization.md)
- [Controller AOP Guide](https://cabloy.com/backend/controller-aop-guide)
- [Permission FormScene and Action Visibility Guide](https://cabloy.com/frontend/permission-formscene-action-visibility-guide)

## Documentation scope

Part of the independently commercially licensed [cabloy-admin documentation](../README.md#license).
