# Cabloy Admin Product Requirements Document

## Purpose

Cabloy Admin is the phase-one system-management domain for Cabloy Start. It gives authorized administrators a governed way to manage existing accounts, ordinary roles, a Department forest, and Department memberships within the active Vona instance.

This PRD owns product outcomes, business scope, business rules, and business acceptance. It does not define database schemas, DTOs, controllers, migration versions, generated contracts, or frontend implementation details. Those technical contracts will be defined in the SRS when that document is established.

## Product Goals

- Provide one operational surface for finding and maintaining all existing accounts without replacing the established identity, authentication, or Passport model.
- Allow administrators to create, edit, and delete custom roles; manage non-system-administrator memberships, including `registeredUser`; and reserve `systemAdmin` for controlled recovery authority.
- Model a Department forest directly inside the active Vona instance without adding a premature Organization dimension.
- Allow one account to hold multiple Department memberships and record an optional per-membership position description.
- Make Department responsibility visible through a manager assignment while preserving membership boundaries.
- Prevent ordinary administration from leaving an instance without an activated `systemAdmin`.

## Personas

### System Administrator

A `systemAdmin` is the phase-one operational authority for Cabloy Admin. They manage accounts, ordinary roles, Departments, and memberships. They can use the separate break-glass workflow to grant or revoke `systemAdmin`, subject to the protected-administrator rule.

### Future Management Operator

An ordinary management role may perform explicitly granted administrative tasks after the dynamic policy model is configured. Creating a role or assigning a role does not grant authority by itself. Legacy actions remain protected by their existing guards, while only deliberately opted-in actions participate in dynamic RBAC.

### Managed Account

A current account whose activation state, permitted profile information, ordinary roles, and Department memberships can be inspected or maintained by an authorized administrator.

### Department Administrator

An authorized administrator who maintains the Department forest, assigns memberships, and records Department managers. In phase one this is an operating responsibility of `systemAdmin`, not a separate authorization model.

## Scope

### In Scope

- Find and view all existing accounts in the active instance.
- Maintain permitted account profile information and activation state; the exact mutable fields and credential lifecycle are deferred to the SRS.
- Create, edit, and delete custom existing roles; configured framework-role definitions remain unavailable to generic Role Resource CRUD.
- Display every assigned account role and assign or revoke every non-system-administrator membership, including the fixed `registeredUser` membership.
- Exclude `systemAdmin` membership from generic role edit, delete, candidate-selection, and bulk-replacement operations.
- Grant or revoke `systemAdmin` only through a dedicated protected workflow.
- Configure explicit role-to-action policy grants for opted-in actions without changing undecorated legacy actions.
- Resolve Department and owner data scope on the server for deliberately opted-in operational actions.
- Create, view, maintain, enable, disable, and rearrange the Department forest in the active instance.
- Treat `parentId = null` as a top-level Department.
- Assign one account to multiple Department memberships.
- Record an optional textual `position` for each membership.
- Identify a Department manager and expose that responsibility in Department administration.
- Use the existing Start Admin operational surface and generic Admin Resource page architecture where the resource contract is conventional.

### Deferred

- Multiple Organizations, organization-scoped Department forests, and organization-aware authorization or query rules.
- A normalized Position catalog, `admin-position` module, `positionId`, job grades, headcount, or position-based authorization.
- Manager-derived authorization, role hierarchy, employment history, organization approval flows, reporting lines, scheduling, and attendance.
- Organization merge, split, archival migration, or cross-Organization tree migration workflows.
- SSO synchronization, SCIM, external identity synchronization, and credential-provider redesign.
- A new Admin SSR site, public path, flavor, or independent Admin application.
- Detailed audit, notification, import/export, and bulk-governance product capabilities beyond the phase-one requirement to retain sensitive-operation evidence.

## Primary User Journeys

### Maintain an account and memberships

1. A System Administrator finds an account in the active instance.
2. They inspect the account's permitted profile, activation state, all assigned roles, and Department memberships.
3. They update permitted profile or activation information when needed.
4. They add, update, remove, or designate a primary membership without changing the account's authentication identity.
5. The system presents the resulting role and membership information consistently on subsequent administration views.

### Maintain an ordinary role

1. A System Administrator creates or selects an ordinary role.
2. They maintain its business-facing identity and presentation information within the supported role contract.
3. They assign or revoke non-system-administrator membership for selected accounts, including `registeredUser`.
4. They cannot use generic role maintenance to mutate a fixed role definition or the protected `systemAdmin` membership.

### Establish a Department tree

1. A System Administrator creates one or more top-level Departments with no parent.
2. They add child Departments only beneath an existing Department in the same active instance.
3. They maintain Department memberships and assign an eligible Department manager.
4. They can inspect the Department forest without exposing another instance's records.

### Assign or transfer a Department membership

1. A System Administrator selects an account and a Department.
2. They add or update the account's membership, optional position text, and primary-membership state.
3. The account may keep memberships in other Departments.
4. The system prevents the membership update from violating the active Department boundary.

### Safely manage system administrator recovery authority

1. A System Administrator starts the dedicated `systemAdmin` grant or revoke workflow.
2. The system requires the additional verification defined for sensitive administration.
3. Before a revoke or other administrator-disabling operation completes, the system verifies that the active instance retains at least one activated `systemAdmin`.
4. The system rejects an operation that would remove the final activated `systemAdmin` and retains evidence of the attempted sensitive operation according to the future technical contract.

### Configure an opted-in action policy

1. A protected policy administrator opens the server-derived action catalog.
2. They select an action explicitly opted into dynamic RBAC; undecorated actions and their existing guards remain unchanged.
3. They assign an ordinary role one or more allowed scope terms without changing the canonical action identity.
4. The server validates the grant, keeps protected bootstrap authority outside mutable policy, and exposes only safe metadata and effective summaries.

### Operate within a Department and owner scope

1. An ordinary role holder calls an opted-in operational action directly or through the Admin UI.
2. The opted-in Controller/action boundary resolves their active-instance roles, Department memberships, enabled Department descendants, and authenticated owner identity, then constructs a private typed scope context; public DTOs cannot carry authority.
3. Matching grants combine as a union of `all`, custom Departments, own Department, own Department plus descendants, and `mine` terms.
4. Neutral domain services apply the supplied scope context to reads and mutations while preserving owner, Department, parent, relationship, and transaction invariants; stale or missing browser capabilities never widen authority.

## Product Requirements

### Account Management

- **PRD-ADM-USR-01**: A System Administrator can find and inspect all existing accounts in the active instance.
- **PRD-ADM-USR-02**: A System Administrator can maintain only the account information and activation lifecycle permitted by the phase-one contract.
- **PRD-ADM-USR-03**: Account administration reuses the established identity model and does not create a second account identity.

### Ordinary Role Management

- **PRD-ADM-ROL-01**: A System Administrator can create, inspect, edit, and delete custom roles in the active instance; configured framework-role definitions remain unavailable to generic Role Resource CRUD.
- **PRD-ADM-ROL-02**: A System Administrator can assign and revoke non-system-administrator membership for accounts, including `registeredUser`.
- **PRD-ADM-ROL-03**: Generic role administration cannot rename, delete, alter the site admission of, select as a replacement candidate, grant, revoke, or bulk-replace the protected `systemAdmin` membership.
- **PRD-ADM-ROL-04**: A newly created custom role has no authority until a protected policy administrator creates an enabled policy grant for an explicitly opted-in action.

### Dynamic Policy and Data Scope

- **PRD-ADM-POL-01**: A protected policy administrator can inspect a server-derived catalog of explicitly opted-in actions, including eligible non-Resource actions, without changing the authorization behavior of undecorated legacy actions.
- **PRD-ADM-POL-02**: A protected policy administrator can grant an ordinary role access to an opted-in action and choose an allowed data-scope term when that action supports data scope.
- **PRD-ADM-POL-03**: A policy grant has one stable canonical action identity and cannot use an HTTP path, browser route, or mutable display label as authorization identity.
- **PRD-ADM-POL-04**: Mutable policy administration cannot remove the protected `systemAdmin` recovery authority or convert protected control-plane workflows into ordinary delegated actions.
- **PRD-ADM-SCP-01**: An opted-in action defaults to deny when no effective allowed policy grant exists for the caller in the active instance.
- **PRD-ADM-SCP-02**: Matching grants combine as a logical union: `all` is unrestricted; custom Department, own Department, own Department plus descendant, and mine terms remain independent alternatives.
- **PRD-ADM-SCP-03**: Department scope recognizes only enabled Department facts in the active instance. Custom Departments do not imply descendants; own-plus-descendants resolves enabled descendants recursively.
- **PRD-ADM-SCP-04**: A browser menu, route, filter, permission hint, or browser-safe row/detail action projection does not authorize an API or data mutation; the server remains authoritative.
- **PRD-ADM-SCP-05**: Selected Student and Record actions provide the first acceptance slice for scoped reads and writes; this does not require migration of unrelated existing Controllers.

### Protected System Administrator Authority

- **PRD-ADM-SUP-01**: `systemAdmin` remains a protected break-glass role rather than an ordinary role-management record.
- **PRD-ADM-SUP-02**: Granting or revoking `systemAdmin` uses a dedicated sensitive workflow.
- **PRD-ADM-SUP-03**: No management operation may leave the active instance with zero activated `systemAdmin` accounts.
- **PRD-ADM-SUP-04**: Sensitive `systemAdmin` changes retain evidence suitable for later operational review.

### Department Management

- **PRD-ADM-DEP-01**: The active instance can contain a Department forest with multiple top-level Departments.
- **PRD-ADM-DEP-02**: A top-level Department has `parentId = null`.
- **PRD-ADM-DEP-03**: A non-root Department may reference only an existing parent in the active instance and may not form a cycle.
- **PRD-ADM-DEP-04**: A Department can identify a manager through the Department membership domain.

### Membership Management

- **PRD-ADM-MEM-01**: One account can hold memberships in multiple Departments.
- **PRD-ADM-MEM-02**: A membership belongs to one Department in the active instance.
- **PRD-ADM-MEM-03**: A membership can hold optional textual `position` information in phase one.
- **PRD-ADM-MEM-04**: The phase-one contract can designate one membership as primary according to the future technical invariant.
- **PRD-ADM-MEM-05**: A Department manager is expected to be an active member of that Department.

### Security and Operational Surface

- **PRD-ADM-SEC-01**: The active Vona instance remains the authoritative tenant boundary for all Cabloy Admin operations.
- **PRD-ADM-SEC-02**: A browser does not supply the authoritative instance, account ownership, or Department scope for authorization.
- **PRD-ADM-SEC-03**: Menu visibility and route admission do not replace backend API authorization.
- **PRD-ADM-UI-01**: Conventional operational resources use the existing Start Admin Resource infrastructure rather than a competing CRUD state owner.

## Business Rules

- A Vona instance is the tenant and contains the phase-one Department forest.
- Ordinary account, role, Department, and membership operations are visible only within the active instance.
- `registeredUser` and `systemAdmin` are fixed framework-role definitions, not normal editable Role Resource records; `registeredUser` membership remains manageable.
- `systemAdmin` is a stable protected membership name, not a business display label or a generic role-management mutation target. Its grant and revoke remain exclusive to the sensitive workflow.
- A sensitive management operation must not leave the active instance without at least one activated `systemAdmin`.
- A top-level Department uses `parentId = null`; `0` is not a Department identifier.
- When a Department has a parent, that parent must be an existing Department in the same active instance; a Department cannot become its own ancestor.
- An account can hold multiple Department memberships. The optional `position` describes that specific membership rather than the account globally.
- A Department manager should be an active member of the Department they manage.
- Authorization and data scope are enforced by server-side contracts. A menu, route, page, or browser filter is not the authority boundary.

## Launch Criteria

The phase-one Cabloy Admin baseline is ready for acceptance when:

- an authorized System Administrator can complete the account, ordinary-role, Department, and membership journeys within the active instance;
- the protected `systemAdmin` workflow prevents an operation from removing the final activated System Administrator;
- a user can hold and display multiple Department memberships with optional position information;
- Department-tree administration preserves active-instance boundaries, top-level-root semantics, and cycle protection;
- cross-instance records are absent from ordinary administration operations;
- Admin menu visibility, backend authorization, and data scope remain independently enforced;
- explicitly opted-in actions use the canonical catalog identity and default-deny policy behavior;
- selected Student and Record flows preserve server-derived Department and owner scope;
- the Vona-to-Zova contract path and the Start Admin paired build path are proven for the implemented resource slices; and
- each delivered requirement has repeatable test or acceptance evidence in the applicable acceptance plan.

## Requirement Traceability

| Product area                      | PRD requirements                | SRS contracts                                                     | Delivery work                  | Acceptance scenarios                                                                     |
| --------------------------------- | ------------------------------- | ----------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| Account management                | `PRD-ADM-USR-*`                 | `SRS-ADM-USR-*`                                                   | `WBS-ADM-30-*`                 | `ATP-ADM-USR-01`                                                                         |
| Ordinary role management          | `PRD-ADM-ROL-*`                 | `SRS-ADM-ROL-*`                                                   | `WBS-ADM-30-*`                 | `ATP-ADM-ROL-01`                                                                         |
| Protected administrator authority | `PRD-ADM-SUP-*`                 | `SRS-ADM-SUP-*`, `SRS-ADM-TXN-*`, `SRS-ADM-AUD-*`                 | `WBS-ADM-40-*`                 | `ATP-ADM-SUP-*`                                                                          |
| Departments                       | `PRD-ADM-DEP-*`                 | `SRS-ADM-DEP-*`                                                   | `WBS-ADM-50-*`                 | `ATP-ADM-DEP-*`                                                                          |
| Membership                        | `PRD-ADM-MEM-*`                 | `SRS-ADM-MEM-*`                                                   | `WBS-ADM-60-*`                 | `ATP-ADM-MEM-*`, `ATP-ADM-MGR-01`                                                        |
| Dynamic policy                    | `PRD-ADM-POL-*`                 | `SRS-ADM-POL-*`                                                   | `WBS-ADM-80-01`, `WBS-ADM-80-02`, `WBS-ADM-80-04` | `ATP-ADM-POL-01`, `ATP-ADM-POL-02`, `ATP-ADM-POL-03`                              |
| Department and owner data scope   | `PRD-ADM-SCP-*`                 | `SRS-ADM-SCP-*`                                                   | `WBS-ADM-80-02`, `WBS-ADM-80-03` | `ATP-ADM-SCP-01`, `ATP-ADM-SCP-02`                                                    |
| Security and operational UI       | `PRD-ADM-SEC-*`, `PRD-ADM-UI-*` | `SRS-ADM-TEN-*`, `SRS-ADM-AUT-*`, `SRS-ADM-API-*`, `SRS-ADM-UI-*` | `WBS-ADM-20-*`, `WBS-ADM-70-*`, `WBS-ADM-80-*` | `ATP-ADM-TEN-01`, `ATP-ADM-AUT-01`, `ATP-ADM-CTR-01`, `ATP-ADM-RES-01`, `ATP-ADM-SSR-01`, `ATP-ADM-POL-03` |

The complete traceability chain is PRD requirement → SRS contract → delivery task → acceptance scenario → observed evidence.

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
- [ADR 0002: Dynamic RBAC and Department Data Scope](./decisions/0002-dynamic-rbac-and-data-scope.md)
