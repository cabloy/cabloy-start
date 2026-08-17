# Cabloy Admin Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver Cabloy Start system management as verified vertical increments: management façades over established accounts and roles, protected `systemAdmin` recovery authority, and a tenant-local Department forest with memberships and managers.

This document owns delivery sequencing and completion checks. The [PRD](./prd.md) owns desired outcomes and business acceptance; the [SRS](./srs.md) owns technical contracts.

## Delivery Principles

- Keep `cabloy-admin` suite-first and generate its Vona/Zova suite and modules through existing CLI command families.
- Keep a Vona instance as the tenant; do not add Organization, `organizationId`, or Organization-scoped behavior.
- Reuse `homeUser`, `homeRole`, `homeRoleUser`, and the stable `a-user` façades rather than duplicating identity facts.
- Preserve one generic Start Admin Resource CRUD/cache owner. A custom semantic façade may not become a parallel cache owner.
- Change backend contract truth first and regenerate consumers; do not edit generated output.
- Build the Start Admin SSR and REST artifacts together before `npm run deps:vona` for reverse-chain changes.
- Enforce tenant-scoped business uniqueness through transactions and service logic, not `table.unique(...)`.
- Do not pull dynamic RBAC, recursive data scopes, a Position catalog, Organization, employment workflows, or a new Admin application into this plan.

## Work Breakdown Structure

### Phase 10: Documentation baseline and implementation gate

Dependencies: none.

#### WBS-ADM-10-01: Freeze the accepted technical baseline

Primary documents:

- `.docs-internal/business/cabloy-admin/prd.md`
- `.docs-internal/business/cabloy-admin/srs.md`
- `.docs-internal/business/cabloy-admin/pdp-wbs.md`
- `.docs-internal/business/cabloy-admin/test-plan.md`
- `.docs-internal/business/cabloy-admin/progress.md`
- `.docs-internal/business/cabloy-admin/decisions/0001-admin-mvp-boundaries.md`

Tasks:

- align PRD, ADR, SRS, WBS, ATP, and status identifiers;
- close every decision that changes persistence, authorization, transaction, lifecycle, public DTO, or recovery semantics;
- preserve the Department-only boundary and the protected administrator invariant.

Acceptance checks:

- each `PRD-ADM-*` family maps to SRS contracts, WBS work, and `ATP-ADM-*` evidence;
- no open policy question changes the phase-one data or authority model;
- no document presents Organization as a phase-one entity, module, or scope.

### Phase 20: Suite, Admin Resource, and contract plumbing

Dependencies: `WBS-ADM-10-01`.

#### WBS-ADM-20-01: Generate the suite and capability modules

Primary areas:

- `vona/src/suite/cabloy-admin/`
- `zova/src/suite/cabloy-admin/`

Tasks:

- use `npm run vona :create:suite cabloy-admin` and `npm run zova :create:suite cabloy-admin`;
- generate `admin-user`, `admin-role`, and `admin-department` under that suite through the matching CLI generators;
- refresh normal module metadata/dependencies without handwritten package scaffolding.

Acceptance checks:

- all modules are suite-contained in Vona and Zova;
- no `admin-organization` package, entity, generated contract, or menu exists;
- module naming and dependency discovery complete through normal tooling.

#### WBS-ADM-20-02: Establish Start Admin Resource and menu entry points

Primary areas:

- Cabloy Admin controllers, Resource metadata, and `@SsrMenu` records
- Start Admin `presetResource` integration

Tasks:

- register `admin-user:user`, `admin-role:role`, and `admin-department:department` only when each backend contract exists;
- add management-group menu entries for `systemAdmin` without creating a site-owner module or new flavor;
- keep conventional pages owned by `rest-resource.model.resource`.

Acceptance checks:

- resource identity, Admin menu, route admission, and API guards agree;
- direct APIs remain protected when a caller knows the menu or route;
- no module-local generic CRUD/cache owner is introduced.

#### WBS-ADM-20-03: Prove contract-loop plumbing

Primary areas:

- Vona DTO/controller/OpenAPI sources
- owning Zova module OpenAPI configurations
- Start Admin SSR/REST artifacts and Vona dependency handoff

Tasks:

- define constrained owning module OpenAPI generation;
- prove a Vona-first forward contract update reaches the generated consumer;
- prove a frontend metadata/route change follows the paired Start Admin reverse handoff.

Acceptance checks:

- generated clients contain only intended operations and are never hand-edited;
- `npm run build:zova:admin` completes before `npm run deps:vona` for reverse-chain changes;
- REST-only output is not used as a substitute for the paired SSR/REST build.

### Phase 30: Account and ordinary role management

Dependencies: `WBS-ADM-20-*`.

#### WBS-ADM-30-01: Deliver the account-management façade

Primary areas:

- `admin-user` projections, service, controller, DTOs, Resource metadata, tests
- existing `home-user` / `a-user` integration

Tasks:

- implement intentional account list/view/profile projections and update allowlist;
- implement named activation/deactivation paths that delegate protected cases to `admin-role`;
- compose ordinary roles and Department membership summaries without duplicating identity facts.

Acceptance checks:

- browser input cannot mutate identity, credentials, instance ownership, or protected fields;
- account operations remain active-instance-scoped;
- deactivation of a protected user converges on the protected administrator service.

#### WBS-ADM-30-02: Deliver ordinary-role lifecycle and membership

Primary areas:

- `admin-role` ordinary role façade, DTOs, Resource metadata, service, tests
- `homeRole` / `homeRoleUser`

Tasks:

- implement custom-role create/view/update/delete while protecting every configured framework-role definition;
- implement atomic non-system-administrator membership replacement for custom roles and `registeredUser`;
- expose a guarded membership-candidate selector that excludes only `systemAdmin` without widening generic Role Resource CRUD;
- preserve existing `systemAdmin` membership, reject supplied `systemAdmin` IDs, and retain the dedicated protected workflow as the only grant/revoke path;
- invalidate effective authentication state where membership changes require it.

Acceptance checks:

- role names are active-instance-scoped, case-insensitive, immutable after creation, and transactionally unique;
- generic Role Resource actions cannot mutate fixed framework-role definitions; generic membership replacement can reconcile `registeredUser` but cannot mutate `systemAdmin` membership;
- no duplicate role persistence or partial replacement survives failure.

### Phase 40: Protected system administrator authority

Dependencies: `WBS-ADM-30-*`.

#### WBS-ADM-40-01: Implement fresh reauthentication and protected commands

Primary areas:

- `admin-role` protected service, command DTOs, auth-provider adapter boundary

Tasks:

- issue/verify purpose-bound, short-lived fresh reauthentication proof;
- implement dedicated grant/revoke commands with mandatory reason;
- define protected activation/deactivation delegation from `admin-user`.

Acceptance checks:

- existing session presence alone cannot authorize a sensitive operation;
- generic role APIs cannot reach protected membership;
- proof material is never logged or persisted in audit evidence.

#### WBS-ADM-40-02: Implement final-administrator transaction, audit, and session behavior

Primary areas:

- protected role/user mutations, audit entity/model, Passport post-commit eviction, tests

Tasks:

- lock and recount active `systemAdmin` state inside a transaction;
- reject a final-administrator removal with stable conflict behavior;
- persist accepted/rejected audit evidence and perform post-commit target session eviction.

Acceptance checks:

- all authority-losing paths preserve one activated system administrator;
- accepted and rejected attempts have durable evidence;
- session invalidation does not occur before an accepted mutation commits.

#### WBS-ADM-40-03: Prove protected-operation contention

Tasks:

- run competing revoke/deactivation operations from separate `mockCtx(...)` boundaries;
- execute PostgreSQL locking proof;
- prove rollback leaves no partial user, role, membership, audit, or cache state.

Acceptance checks:

- at least one activated `systemAdmin` remains durably after every competing outcome;
- evidence satisfies `ATP-ADM-SUP-RACE-01`.

### Phase 50: Department forest foundation

Dependencies: `WBS-ADM-20-*`, `WBS-ADM-40-*`.

#### WBS-ADM-50-01: Implement Department persistence and conventional Resource surface

Tasks:

- add Department entity/model, version path, ordinary indexes, DTOs, service, controller, and Resource metadata;
- provide root/child list, view, create, update, and guarded delete behavior;
- add Start Admin menu/resource presentation.

Acceptance checks:

- roots use `parentId = null`; `0` is rejected;
- every Department remains in normal instance scope;
- no Organization field, entity, or foreign scope is introduced.

#### WBS-ADM-50-02: Implement safe tree commands and lifecycle

Tasks:

- implement deterministic ordering, move, parent validation, and cycle rejection;
- implement explicit disable/delete dependency handling;
- prove cross-instance parent and move attempts are absent.

Acceptance checks:

- moves lock/recheck ancestry and cannot create a cycle;
- normal delete does not recursively remove descendants or memberships;
- lifecycle behavior satisfies `SRS-ADM-DEP-*` and `ATP-ADM-DEP-*`.

### Phase 60: Department memberships and managers

Dependencies: `WBS-ADM-50-*`.

#### WBS-ADM-60-01: Implement membership and position lifecycle

Tasks:

- add membership persistence, indexes, DTOs, commands, and Department/account projections;
- support multiple Department memberships and optional membership-scoped position text;
- reject duplicate memberships transactionally.

Acceptance checks:

- one account can belong to multiple Departments;
- no duplicate active membership or cross-instance relation survives;
- custom actions reuse the generic Resource invalidation owner.

#### WBS-ADM-60-02: Implement primary membership and manager lifecycle

Tasks:

- atomically set/clear primary membership;
- assign manager through an enabled same-Department membership;
- require replacement or clear when a manager membership is removed/disabled.

Acceptance checks:

- at most one active primary membership exists per user/instance;
- manager eligibility and removal rules are transactionally preserved;
- competing primary updates produce one valid durable outcome.

#### WBS-ADM-60-03: Complete integrated Admin views

Tasks:

- expose all assigned role summaries, including a presentation-only protected marker for `systemAdmin`, alongside approved Department membership/manager summaries;
- verify selector-cache invalidation after custom membership and manager actions;
- keep list/view contracts distinct from mutations.

Acceptance checks:

- UI state has one owner per conventional resource;
- no browser projection becomes an authorization source.

### Phase 70: Integration hardening and release acceptance

Dependencies: `WBS-ADM-30-*`, `WBS-ADM-40-*`, `WBS-ADM-50-*`, `WBS-ADM-60-*`.

#### WBS-ADM-70-01: Complete migration and contract synchronization

Tasks:

- verify module file versions and migration paths;
- regenerate forward contracts and paired Start Admin reverse artifacts;
- refresh Vona/Zova dependency handoffs.

Acceptance checks:

- every schema change has the confirmed file-version decision;
- `npm run test` exercises every changed `meta.version.ts` path;
- no generated output is manually edited or stale.

#### WBS-ADM-70-02: Complete focused and repository verification

Tasks:

- run focused module/action/transaction tests;
- run root test, type, lint, and format checks as applicable;
- run Start Admin paired build/sync and tagged clean browser acceptance.

Acceptance checks:

- applicable ATP scenarios have retained, traceable evidence;
- protected administrator and tree/membership contention are proven on PostgreSQL;
- direct API, SSR, navigation, and browser evidence remain separate and all pass.

#### WBS-ADM-70-03: Close traceability and release decision

Tasks:

- reconcile PRD, SRS, WBS, ATP evidence, and progress status;
- record waivers only with owner, reason, and expiry;
- confirm deferred scope remains absent from source and generated contracts.

Acceptance checks:

- every delivered requirement has the required evidence;
- no expired waiver or open severity-one invariant failure remains;
- release status is derived in [progress.md](./progress.md).

## Future Implementation Commands

These are implementation-phase commands, not checks for the current Markdown batch:

```bash
# Discover and generate using the established command families
npm run vona :
npm run zova :

# Build paired Start Admin outputs after frontend/reverse-chain work
npm run build:zova:admin
npm run deps:vona
npm run deps:zova

# Shared verification
npm run tsc
npm run lint
npm run format
npm run test
```

## Traceability Matrix

| WBS group      | PRD source                       | SRS source                                        | Required ATP evidence                                     |
| -------------- | -------------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| `WBS-ADM-10-*` | All                              | All                                               | Traceability review                                       |
| `WBS-ADM-20-*` | `PRD-ADM-SEC-*`, `PRD-ADM-UI-*`  | `SRS-ADM-API-*`, `SRS-ADM-UI-*`                   | `ATP-ADM-CTR-01`, `ATP-ADM-RES-01`, `ATP-ADM-SSR-01`      |
| `WBS-ADM-30-*` | `PRD-ADM-USR-*`, `PRD-ADM-ROL-*` | `SRS-ADM-USR-*`, `SRS-ADM-ROL-*`                  | `ATP-ADM-USR-01`, `ATP-ADM-ROL-01`                        |
| `WBS-ADM-40-*` | `PRD-ADM-SUP-*`                  | `SRS-ADM-SUP-*`, `SRS-ADM-TXN-*`, `SRS-ADM-AUD-*` | `ATP-ADM-SUP-01`, `ATP-ADM-SUP-02`, `ATP-ADM-SUP-RACE-01` |
| `WBS-ADM-50-*` | `PRD-ADM-DEP-*`                  | `SRS-ADM-DEP-*`                                   | `ATP-ADM-DEP-01`, `ATP-ADM-DEP-02`                        |
| `WBS-ADM-60-*` | `PRD-ADM-MEM-*`                  | `SRS-ADM-MEM-*`                                   | `ATP-ADM-MEM-01`, `ATP-ADM-MEM-02`, `ATP-ADM-MGR-01`      |
| `WBS-ADM-70-*` | All applicable                   | `SRS-ADM-NFR-*`                                   | All applicable ATP evidence                               |

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
- [Suites and Modules](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [Contract Loop Playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
