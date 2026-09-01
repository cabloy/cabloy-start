# ADR 0001: Establish Cabloy Admin MVP Boundaries

## Status

Accepted.

## Background

Cabloy Start already provides the framework-level identity, authentication, Passport, role, active-instance, Admin site, SSR menu, Resource, and generated-contract mechanisms needed by operational applications. It does not yet provide a Start-specific system-management domain for maintaining all accounts, ordinary roles, a Department forest, and Department memberships.

Without an explicit boundary, this work could duplicate `home-user` identity persistence, confuse Departments with Vona tenants, treat menu visibility as authorization, or make the framework recovery role an ordinary mutable business record. The first phase therefore needs a durable decision before suite scaffolding or generated-contract work starts.

## Problem

The phase-one system-management domain has several cross-cutting boundaries that must remain stable as capabilities expand:

- framework identity and role facts versus management use cases;
- the Vona instance tenant boundary versus its in-instance Department forest;
- ordinary role administration versus a recovery-level `systemAdmin` role;
- conventional Start Admin Resource UI versus competing page/cache implementations;
- phase-one account, role, Department, and membership capabilities versus deferred dynamic authorization and employment-management features.

If those boundaries are not fixed now, later additions can silently create duplicate identities, conflicting authorization semantics, unsafe administrator revocation, or incompatible resource contracts.

## Decision

### Establish a suite-first Cabloy Admin domain

Create `cabloy-admin` as a Start-internal, suite-first business domain. Its planned phase-one modules are:

- `admin-user` for account-management use cases and integration with the existing identity model;
- `admin-role` for ordinary role management and user-role membership use cases;
- `admin-department` for Department trees, Department memberships, position text, and Department-manager use cases.

The suite will use the normal suite-contained layout in both Vona and Zova:

```text
vona/src/suite/cabloy-admin/modules/
zova/src/suite/cabloy-admin/modules/
```

### Reuse identity and role facts instead of duplicating them

`admin-user` and `admin-role` own management use cases, Resource APIs, and Admin composition. They do not create another identity, Passport, role, or user-role persistence model.

The established framework and project surfaces remain authoritative:

- `bean.user`, `bean.role`, and `bean.passport` remain the stable business-facing entry points;
- `homeUser` remains the account persistence implementation;
- `homeRole` and `homeRoleUser` remain the role and membership facts that Passport consumes.

Custom roles retain a stable, locale-neutral role name for authorization. Their title, locales, and site admission remain separate concerns. User detail displays all resolved role memberships, while `systemAdmin` carries only a presentation-safe protected marker; backend contracts remain the authority. The detailed CRUD, membership-replacement, and adapter/service contracts are defined by the SRS.

### Use the existing Start Admin application and Resource owner

Phase one integrates with the existing Start Admin site rather than introducing a new SSR site, public path, or flavor.

Admin navigation will use the established `@SsrMenu` and `presetResource` approach. Conventional Admin resource state remains selector-scoped under `rest-resource.model.resource`; a module-local model can be a thin semantic façade for custom actions but must not become a competing CRUD/cache owner.

### Separate ordinary roles from protected system administrator recovery authority

Phase one supports ordinary `homeRole` CRUD and ordinary user-role assignments. It defers a dynamic role-to-menu, role-to-Resource, role-to-action, and role-to-data-scope policy matrix.

`registeredUser` and `systemAdmin` are fixed framework-role definitions. Role Management may list and view them and may update only their `siteIds` site-admission configuration; it must not create them, rename them, change their titles or locales, or delete them. Their memberships have intentionally different policy: `registeredUser` is a non-system-administrator membership that generic replacement can add or remove, while `systemAdmin` is a protected break-glass membership. Generic membership APIs must not select, grant, revoke, or bulk-replace `systemAdmin`; a separate sensitive command exclusively owns its grant and revoke.

For every operation that can remove `systemAdmin`, deactivate a System Administrator, delete an administrator account, or otherwise make a System Administrator unable to authenticate or be authorized, server-side behavior must preserve at least one activated `systemAdmin` within the active Vona instance. The sensitive workflow requires server-side authorization, reauthentication, transaction and locking behavior, session invalidation, and immutable audit evidence. The exact API, transaction, error, lock, and audit contracts belong to the SRS.

The current bootstrap assignment of `systemAdmin` to the activated `admin` account is implementation background, not the phase-one product API or the only recovery mechanism.

### Model Departments and memberships directly inside the active instance

The active Vona instance contains one Department forest. Multiple root Departments are permitted. Phase one has no Organization entity, module, `organizationId`, or Organization-scoped authorization/query dimension.

A Department has nullable `parentId`:

```text
Top-level Department: parentId = null
Child Department: parentId = an actual Department identity in the active instance
```

`0` is not used as a root sentinel. A Department parent remains an explicit existing Department identity, and tree movement must not create a cycle. The SRS will define the detailed movement, disable, deletion, and ordering rules.

Department membership is a separate domain relation. A user may hold multiple memberships. In phase one, each membership can hold optional textual `position` information and can participate in a future primary-membership rule. A Department manager is an explicit phase-one business concept and is expected to be an active member of the Department. Detailed uniqueness, lifecycle, manager replacement, and removal semantics belong to the SRS.

### Preserve active-instance scope and contract-loop ownership

Every new Cabloy Admin business record remains in the normal Vona active-instance scope. Department and membership services must not set `disableInstance` or accept a browser-controlled tenant identity.

Backend entity, DTO, controller, validation, and OpenAPI changes are Vona contract truth and follow the forward contract loop. When a frontend-owned route, renderer, metadata resource, or other reverse-chain input changes, the matching Start Admin SSR and REST artifacts are built together before `npm run deps:vona`.

## Alternatives Deferred

- **Duplicate admin account and role tables:** rejected because Passport and existing role guards consume `homeUser`, `homeRole`, and `homeRoleUser` facts.
- **Use `parentId = 0` for Department roots:** rejected because it is a magic non-entity identity rather than a natural tree root.
- **Introduce an Organization model:** excluded from phase one. The active Vona instance provides the tenant boundary, and a Department forest meets the phase-one need without adding a persistent organization dimension to every permission and query rule. A future proposal requires a superseding ADR before it changes the model.
- **Introduce `admin-position` in phase one:** deferred. A textual membership `position` is sufficient until positions require their own reusable lifecycle, code, status, headcount, or authorization semantics.
- **Introduce dynamic RBAC and data scopes in phase one:** deferred. A future policy domain must provide server-side authorization truth rather than only frontend configuration.
- **Treat `systemAdmin` as an ordinary role:** rejected because recovery authority needs distinct mutation, concurrency, session, and audit safeguards.
- **Create a new independent Start Admin SSR application:** deferred. The existing Start Admin site and generic Resource infrastructure are the phase-one operational surface.
- **Treat a Department as a tenant:** rejected. A Vona instance remains the tenant; Departments are in-instance business structures.

## Consequences

- The implementation must add managed façades and protected services around existing identity and role ownership rather than duplicate their persistence.
- Role mutations, administrator activation changes, and protected administrator changes require explicit transactional safety, concurrency tests, and session invalidation behavior.
- Department and membership persistence, tree movement, cycle protection, deletion/disable behavior, primary-membership semantics, manager lifecycle, and indexes are owned by the [SRS](../srs.md).
- An Organization model is not an anticipated implementation path. Any future proposal must introduce a superseding ADR and separately define migration, scope, authorization, and query consequences before changing the Department-only model.
- Every resource slice must use the Vona-first forward contract loop and the Start Admin paired SSR/REST reverse handoff where applicable.
- Delivery sequencing is owned by the [PDP/WBS](../pdp-wbs.md), executable proof by the [test plan](../test-plan.md), and derived execution status by [progress](../progress.md).

## Related Records

- [Cabloy Admin internal planning index](../README.md)
- [Cabloy Admin Product Requirements Document](../prd.md)
- [Software Requirements Specification](../srs.md)
- [Product Delivery Plan and Work Breakdown Structure](../pdp-wbs.md)
- [Test Strategy and Acceptance Plan](../test-plan.md)
- [Delivery Progress](../progress.md)
- [Suites and Modules](../../../repo-docs/fullstack/suites-and-modules.md)
- [User Access Guide](../../../repo-docs/backend/user-access-guide.md)
- [Admin Resource and Web Self-Service](../../../repo-docs/fullstack/admin-resource-and-web-self-service.md)
- [Contract Loop Playbook](../../../repo-docs/fullstack/contract-loop-playbook.md)
