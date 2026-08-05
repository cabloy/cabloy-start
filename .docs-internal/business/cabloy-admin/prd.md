# Cabloy Admin Product Requirements Document

## Purpose

Cabloy Admin is the phase-one system-management domain for Cabloy Start. It gives authorized administrators a governed way to manage existing accounts, ordinary roles, Organizations, Department trees, and Department memberships within the active Vona instance.

This PRD owns product outcomes, business scope, business rules, and business acceptance. It does not define database schemas, DTOs, controllers, migration versions, generated contracts, or frontend implementation details. Those technical contracts will be defined in the SRS when that document is established.

## Product Goals

- Provide one operational surface for finding and maintaining all existing accounts without replacing the established identity, authentication, or Passport model.
- Allow administrators to create, edit, delete, and assign ordinary roles while reserving `systemAdmin` for controlled recovery authority.
- Model multiple Organizations and independent Department trees within one active Vona instance.
- Allow one account to hold multiple Department memberships and record an optional per-membership position description.
- Make Department responsibility visible through a manager assignment while preserving organization and membership boundaries.
- Prevent ordinary administration from leaving an instance without an activated `systemAdmin`.

## Personas

### System Administrator

A `systemAdmin` is the phase-one operational authority for Cabloy Admin. They manage accounts, ordinary roles, Organizations, Departments, and memberships. They can use the separate break-glass workflow to grant or revoke `systemAdmin`, subject to the protected-administrator rule.

### Future Management Operator

A future ordinary management role may perform selected administrative tasks after a dynamic permission model is introduced. Phase one does not promise any independent authority for this persona; all operational APIs remain protected by the existing `systemAdmin` baseline.

### Managed Account

A current account whose activation state, permitted profile information, ordinary roles, and Organization/Department memberships can be inspected or maintained by an authorized administrator.

### Organization and Department Administrator

An authorized administrator who establishes Organizations, maintains Department trees, assigns memberships, and records Department managers. In phase one this is an operating responsibility of `systemAdmin`, not a separate authorization model.

## Scope

### In Scope

- Find and view all existing accounts in the active instance.
- Maintain permitted account profile information and activation state; the exact mutable fields and credential lifecycle are deferred to the SRS.
- Create, edit, and delete ordinary existing roles, and assign or revoke ordinary roles for accounts.
- Exclude the protected `systemAdmin` role from generic role edit, delete, and bulk-membership operations.
- Grant or revoke `systemAdmin` only through a dedicated protected workflow.
- Create, view, edit, enable, and disable multiple Organizations.
- Create, view, maintain, enable, disable, and rearrange Department trees within an Organization.
- Treat `parentId = null` as the root of a Department tree.
- Assign one account to multiple Organization/Department memberships.
- Record an optional textual `position` for each membership.
- Identify a Department manager and expose that responsibility in Department administration.
- Use the existing Start Admin operational surface and generic Admin Resource page architecture where the resource contract is conventional.

### Deferred

- Dynamic role-to-menu, role-to-Resource, role-to-action, or role-to-data-scope permission matrices.
- A normalized Position catalog, `admin-position` module, `positionId`, job grades, headcount, or position-based authorization.
- Recursive Department data scopes, manager-derived authorization, and role hierarchy.
- Employment history, organization approval flows, reporting lines, scheduling, and attendance.
- Organization merge, split, archival migration, or cross-Organization tree migration workflows.
- SSO synchronization, SCIM, external identity synchronization, and credential-provider redesign.
- A new Admin SSR site, public path, flavor, or independent Admin application.
- Detailed audit, notification, import/export, and bulk-governance product capabilities beyond the phase-one requirement to retain sensitive-operation evidence.

## Primary User Journeys

### Maintain an account and memberships

1. A System Administrator finds an account in the active instance.
2. They inspect the account's permitted profile, activation state, ordinary roles, and Organization/Department memberships.
3. They update permitted profile or activation information when needed.
4. They add, update, remove, or designate a primary membership without changing the account's authentication identity.
5. The system presents the resulting role and membership information consistently on subsequent administration views.

### Maintain an ordinary role

1. A System Administrator creates or selects an ordinary role.
2. They maintain its business-facing identity and presentation information within the supported role contract.
3. They assign or revoke ordinary role membership for selected accounts.
4. They cannot use ordinary role maintenance to mutate the protected `systemAdmin` role.

### Establish an Organization and Department tree

1. A System Administrator creates an Organization.
2. They create root Departments for that Organization with no parent.
3. They add child Departments only beneath a Department in the same Organization.
4. They maintain Department membership and assign an eligible Department manager.
5. They can inspect the Organization's Department structure without exposing another instance's records.

### Assign or transfer a Department membership

1. A System Administrator selects an account and an Organization/Department.
2. They add or update the account's membership, optional position text, and primary-membership state.
3. The account may keep memberships in other Departments.
4. The system prevents the membership update from violating the active Organization or Department boundary.

### Safely manage system administrator recovery authority

1. A System Administrator starts the dedicated `systemAdmin` grant or revoke workflow.
2. The system requires the additional verification defined for sensitive administration.
3. Before a revoke or other administrator-disabling operation completes, the system verifies that the active instance retains at least one activated `systemAdmin`.
4. The system rejects an operation that would remove the final activated `systemAdmin` and retains evidence of the attempted sensitive operation according to the future technical contract.

## Product Requirements

### Account Management

- **PRD-ADM-USR-01**: A System Administrator can find and inspect all existing accounts in the active instance.
- **PRD-ADM-USR-02**: A System Administrator can maintain only the account information and activation lifecycle permitted by the phase-one contract.
- **PRD-ADM-USR-03**: Account administration reuses the established identity model and does not create a second account identity.

### Ordinary Role Management

- **PRD-ADM-ROL-01**: A System Administrator can create, inspect, edit, and delete ordinary roles in the active instance.
- **PRD-ADM-ROL-02**: A System Administrator can assign and revoke ordinary role membership for accounts.
- **PRD-ADM-ROL-03**: Ordinary role administration cannot rename, delete, alter the site admission of, or bulk-replace membership for the protected `systemAdmin` role.
- **PRD-ADM-ROL-04**: A newly created ordinary role does not imply a dynamic permission matrix in phase one.

### Protected System Administrator Authority

- **PRD-ADM-SUP-01**: `systemAdmin` remains a protected break-glass role rather than an ordinary role-management record.
- **PRD-ADM-SUP-02**: Granting or revoking `systemAdmin` uses a dedicated sensitive workflow.
- **PRD-ADM-SUP-03**: No management operation may leave the active instance with zero activated `systemAdmin` accounts.
- **PRD-ADM-SUP-04**: Sensitive `systemAdmin` changes retain evidence suitable for later operational review.

### Organization Management

- **PRD-ADM-ORG-01**: A System Administrator can create and maintain multiple Organizations within the active instance.
- **PRD-ADM-ORG-02**: An Organization is an in-instance business structure and does not replace the Vona instance tenant boundary.

### Department Management

- **PRD-ADM-DEP-01**: Each Organization can contain an independent Department tree.
- **PRD-ADM-DEP-02**: A root Department has `parentId = null`.
- **PRD-ADM-DEP-03**: A non-root Department may reference only a parent in the same Organization.
- **PRD-ADM-DEP-04**: A Department can identify a manager through the Organization/Department membership domain.

### Membership Management

- **PRD-ADM-MEM-01**: One account can hold memberships in multiple Departments.
- **PRD-ADM-MEM-02**: A membership belongs to one Organization and one Department in that Organization.
- **PRD-ADM-MEM-03**: A membership can hold optional textual `position` information in phase one.
- **PRD-ADM-MEM-04**: The phase-one contract can designate one membership as primary according to the future technical invariant.
- **PRD-ADM-MEM-05**: A Department manager is expected to be an active member of that Department.

### Security and Operational Surface

- **PRD-ADM-SEC-01**: The active Vona instance remains the authoritative tenant boundary for all Cabloy Admin operations.
- **PRD-ADM-SEC-02**: A browser does not supply the authoritative instance, account ownership, Organization boundary, or Department scope for authorization.
- **PRD-ADM-SEC-03**: Menu visibility and route admission do not replace backend API authorization.
- **PRD-ADM-UI-01**: Conventional operational resources use the existing Start Admin Resource infrastructure rather than a competing CRUD state owner.

## Business Rules

- A Vona instance is the tenant. Organizations are business boundaries inside that active instance.
- Ordinary account, role, Organization, Department, and membership operations are visible only within the active instance.
- `systemAdmin` is a stable protected role name, not a business display label or a normal editable role.
- A sensitive management operation must not leave the active instance without at least one activated `systemAdmin`.
- A Department belongs to exactly one Organization. When a Department has a parent, that parent belongs to the same Organization.
- A root Department uses `parentId = null`; `0` is not a root Department identifier.
- An account can hold multiple Department memberships. The optional `position` describes that specific membership rather than the account globally.
- A Department manager should be an active member of the Department they manage.
- Authorization and data scope are enforced by server-side contracts. A menu, route, page, or browser filter is not the authority boundary.

## Launch Criteria

The phase-one Cabloy Admin baseline is ready for acceptance when:

- an authorized System Administrator can complete the account, ordinary-role, Organization, Department, and membership journeys within the active instance;
- the protected `systemAdmin` workflow prevents an operation from removing the final activated System Administrator;
- a user can hold and display multiple Department memberships with optional position information;
- Department tree administration preserves Organization boundaries and root semantics;
- cross-instance records are absent from ordinary administration operations;
- Admin menu visibility, backend authorization, and data scope remain independently enforced;
- the Vona-to-Zova contract path and the Start Admin paired build path are proven for the implemented resource slices; and
- each delivered requirement has repeatable test or acceptance evidence when the future test plan is established.

## Requirement Traceability

| Product area | PRD requirements | Boundary decision | Future technical contract |
| --- | --- | --- | --- |
| Account management | `PRD-ADM-USR-*` | ADR 0001: identity ownership | Pending SRS |
| Ordinary role management | `PRD-ADM-ROL-*` | ADR 0001: role reuse and deferred policy matrix | Pending SRS |
| Protected administrator authority | `PRD-ADM-SUP-*` | ADR 0001: protected break-glass role | Pending SRS |
| Organizations and Departments | `PRD-ADM-ORG-*`, `PRD-ADM-DEP-*` | ADR 0001: in-instance organization model | Pending SRS |
| Membership | `PRD-ADM-MEM-*` | ADR 0001: multi-membership and textual position | Pending SRS |
| Security and operational UI | `PRD-ADM-SEC-*`, `PRD-ADM-UI-*` | ADR 0001: tenant and Admin Resource boundaries | Pending SRS |

The second documentation batch will expand this table into PRD requirement → SRS contract → delivery task → acceptance scenario → observed evidence.

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
