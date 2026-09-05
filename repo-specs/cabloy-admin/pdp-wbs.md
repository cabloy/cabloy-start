# Cabloy Admin Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver Cabloy Start system management as verified vertical increments: management façades over established accounts and roles, protected `systemAdmin` recovery authority, a tenant-local Department forest with memberships and managers, and an explicitly opted-in dynamic RBAC/data-scope acceptance slice.

This document owns delivery sequencing and completion checks. The [PRD](./prd.md) owns desired outcomes and business acceptance; the [SRS](./srs.md) owns technical contracts.

## Delivery Principles

- Keep `cabloy-admin` suite-first and generate its Vona/Zova suite and modules through existing CLI command families.
- Keep a Vona instance as the tenant; do not add Organization, `organizationId`, or Organization-scoped behavior.
- Reuse `homeUser`, `homeRole`, `homeRoleUser`, and the stable `a-user` façades rather than duplicating identity facts.
- Preserve one generic Start Admin Resource CRUD/cache owner. A custom semantic façade may not become a parallel cache owner.
- Change backend contract truth first and regenerate consumers; do not edit generated output.
- Build the Start Admin SSR and REST artifacts together before `npm run deps:vona` for reverse-chain changes.
- Enforce tenant-scoped business uniqueness through transactions and service logic, not `table.unique(...)`.
- Keep dynamic RBAC limited to explicitly opted-in actions and the five accepted data-scope terms; Position catalog, Organization, employment workflows, manager-derived authorization, role hierarchy, and a new Admin application remain outside this plan.

## Work Breakdown Structure

### Phase 10: Documentation baseline and implementation gate

Dependencies: none.

The baseline traceability review uses the complete acceptance catalogue as a whole; it does not itself execute a particular ATP scenario.

#### WBS-ADM-10-01: Freeze the accepted technical baseline

Primary documents:

- `repo-specs/cabloy-admin/prd.md`
- `repo-specs/cabloy-admin/srs.md`
- `repo-specs/cabloy-admin/pdp-wbs.md`
- `repo-specs/cabloy-admin/test-plan.md`
- `repo-specs/cabloy-admin/progress.md`
- `repo-specs/cabloy-admin/decisions/0001-admin-mvp-boundaries.md`

Tasks:

- align PRD, ADR, SRS, WBS, ATP, and status identifiers;
- close every decision that changes persistence, authorization, transaction, lifecycle, public DTO, or recovery semantics;
- preserve the Department-only boundary and the protected administrator invariant.

Acceptance checks:

- each product requirement family maps to formal SRS contracts, delivery work, and acceptance evidence;
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
- lifecycle behavior satisfies the Department technical contracts and their formal acceptance scenarios.

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

Integration dependencies for `WBS-ADM-70-01` and `WBS-ADM-70-02`: `WBS-ADM-30-*`, `WBS-ADM-40-*`, `WBS-ADM-50-*`, `WBS-ADM-60-*`. `WBS-ADM-70-03` additionally depends on completed `WBS-ADM-70-01`, `WBS-ADM-70-02`, `WBS-ADM-80-05`, and every other applicable release gate. The integration lane may collect shared evidence before Phase 80 closes, but it cannot make a release decision.

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
- confirm explicitly excluded capability scope remains absent from source and generated contracts.

Acceptance checks:

- every delivered requirement has the required evidence;
- no expired waiver or open severity-one invariant failure remains;
- release status is derived in [progress.md](./progress.md).

### Phase 80: Dynamic RBAC and Department data-scope acceptance

Dependencies: `WBS-ADM-20-*`, `WBS-ADM-30-*`, `WBS-ADM-40-*`, `WBS-ADM-50-*`, `WBS-ADM-60-*`. Phase 80 may consume shared integration evidence from `WBS-ADM-70-01` or `WBS-ADM-70-02`, but those tasks are not prerequisites for Phase 80 acceptance. `WBS-ADM-70-03` remains downstream of `WBS-ADM-80-05`.

#### WBS-ADM-80-01: Complete reusable RBAC catalog and guard contracts

Primary areas:

- `a-rbac` catalog, `@Passport.rbac(...)`, typed policy event, guard, alias validation, and request-local decision state

Tasks:

- freeze explicit decorator opt-in and canonical `<controllerBeanFullName>#<action>` identity;
- include decorated actions from non-`@Resource()` Controllers and exclude undecorated actions;
- validate same-Controller `actionInherit`, default deny, request-local decision handoff, and normal `GuardBase` options;
- make adapter-defined unrestricted admission produce an action-bound `all` decision before policy resolution without importing Start policy semantics;
- define safe predicate composition and opaque capability contracts without importing Start policy semantics.

Acceptance checks:

- missing, invalid, self-referential, cyclic, or cross-Controller aliases fail closed;
- the configured unrestricted adapter path stores an action-bound `all` decision without policy resolution, ordinary RBAC decisions retain default-deny behavior, and normal guard options remain covered;
- no legacy action requires migration merely because the catalog exists.

#### WBS-ADM-80-02: Deliver Start grants, Department resolution, and policy invalidation

Primary areas:

- `admin-rbac` grant and Department-association persistence, policy service, catalog projection, revision/invalidation, protected policy administration

Tasks:

- complete role-to-action grant validation and enabled-state handling;
- resolve `all`, `customDepartments`, `ownDepartment`, `ownDepartmentAndDescendants`, and `mine` terms in active-instance scope, emitting an explicit `all` term for an ordinary scoped `all` grant;
- preserve union semantics, adapter-defined unrestricted admission, disabled-Department behavior, protected control-plane authority, and revision-aware invalidation;
- expose safe policy-editor metadata and effective summaries without raw predicates or hidden topology.

Acceptance checks:

- absent/disabled/invalid grants and empty restricted terms deny;
- multiple grants union, `all` dominates, and custom Departments do not imply descendants;
- grant, role-membership, Department, and membership mutations invalidate policy decisions independently of coarse permission caches.

#### WBS-ADM-80-03: Enforce Student and Record scoped operations

Primary areas:

- `training-student`, `training-record` entities, version-1 schema paths, DTOs, opted-in Controller/action policy boundaries, typed internal scope handoff, neutral services, nested relation mutations, focused tests

Tasks:

- add server-controlled `departmentId` and `userIdOwner` while retaining both module `fileVersion: 1` values;
- deliberately opt in the acceptance actions; resolve policy and scope at the Controller/action boundary, and apply scope for select, view, create, update, delete, bulk, and nested operations;
- derive Student ownership at the Controller/action boundary on create, preserve it on update, and inherit both fields from Student for Record writes;
- expose Student bulk deletion as `DELETE /training/student/bulk` with the ids-only `DtoStudentBulkDelete` command; no Student bulk-update action is part of this slice;
- validate the complete unique bulk target set before mutation and reject forged or cross-instance relationship fields; the training Record service deliberately uses direct ORM operations without application-level transactions or row locks, while services must not independently derive caller authority.

Acceptance checks:

- adapter-defined unrestricted requests produce and consume an active-instance `all` decision before scoped argument extraction, while direct API calls cannot widen ordinary scopes through filters, guessed IDs, nested writes, bulk IDs, or submitted owner/Department fields;
- present out-of-scope rows are rejected at the Controller boundary, Student and Record bulk DELETE reject empty/duplicate/missing/mixed-scope targets before mutation, and inherited `summary`/force-delete/bulk-delete actions resolve their `view`/`delete` policy keys;
- Record nested and multi-row operations intentionally do not claim rollback or row-lock guarantees; no version-2 migration is introduced and changed version paths are covered by `npm run test`.

#### WBS-ADM-80-04: Deliver policy-editor and capability UX

Primary areas:

- Cabloy Start Admin policy editor, generated contracts, safe catalog projections, row/detail capability rendering

Tasks:

- add policy catalog/grant management UI using generated backend contracts;
- render only opaque, server-derived row/detail capabilities as UX hints;
- preserve Resource ownership and SSR/hydration equivalence while keeping backend authority independent of menus and capabilities.

Acceptance checks:

- policy editor cannot submit hidden topology or raw predicates;
- stale or forged capability values do not authorize direct API calls;
- applicable Admin SSR/REST artifacts are built together before `deps:vona`.

#### WBS-ADM-80-05: Close contract loop and acceptance evidence

Tasks:

- regenerate metadata and consumers from Vona contract truth;
- run focused, transaction, PostgreSQL contention, direct API, SSR/browser, type, lint, format, and repository checks as applicable;
- retain traceable Phase 80 ATP evidence and reconcile all planning identifiers.

Acceptance checks:

- all applicable dynamic policy and data-scope acceptance scenarios pass with identified source revision and retained evidence;
- no generated output is hand-edited, no stale dependency link remains, and all open gates/waivers are recorded;
- Phase 70 release closure remains blocked until Phase 80 and all prior applicable gates are complete.

### Phase 90: Role-menu visibility delivery and acceptance

Dependencies: `WBS-ADM-20-*`, `WBS-ADM-30-*`, `WBS-ADM-80-*`, and the existing SSR/menu foundations. Phase 90 extends navigation disclosure only; it does not reopen verified Phase 70/80 evidence or change action/data-scope authority. ADR 0003 acceptance, the definedness-based `roles` contract, and the source-informed registered-site inventory are completion gates inside `WBS-ADM-90-01`, not predecessors of that same task.

#### WBS-ADM-90-01: Reclose the role-menu decision and registered-site inventory

Primary areas:

- `repo-specs/cabloy-admin/decisions/0003-role-menu-visibility.md`
- `repo-specs/cabloy-admin/{prd,srs,test-plan}.md`
- SSR-site, `@SsrMenu`, and menu-group registrations

Tasks:

- record the approved ADR 0003 amendment before source implementation;
- inventory actual currently registered SSR-site trees, including omitted-`site` declarations bound to every site and final keyed leaf names;
- define `roles === undefined` as public/non-configurable, `roles: []` as dynamic-only/default-deny, and nonempty static roles as static-match OR dynamic-association visibility;
- establish `roleId + ssrSiteName + ssrMenuName` as the future association identity and retain groups as derived presentation rather than grant targets;
- close this authority increment only after authoritative PRD/ADR/SRS/WBS/ATP records reconcile. It does not modify runtime source, schemas, generated consumers, or execute role-menu acceptance procedures.

Acceptance checks:

- the accepted inventory distinguishes registered site partitions, actual bound leaves, omitted-site bindings, final keyed names, public leaves, restricted leaves, and presentation-only groups;
- the authority chain consistently defines the three `roles` states, static-or-dynamic union, no implicit `systemAdmin` visibility bypass, and fail-closed renamed/retired identities;
- persistence terminology consistently uses `roleId`, `ssrSiteName`, and final `ssrMenuName`, not an Admin-only `siteId` or immutable policy key;
- the inventory and ADR preserve navigation disclosure as distinct from API, action, Resource, route, and data-scope authority.

Traceability: `PRD-ADM-MNU-01`–`PRD-ADM-MNU-05`; `SRS-ADM-MNU-01`–`SRS-ADM-MNU-10`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-06`.

#### WBS-ADM-90-02: Implement role-menu persistence and lifecycle in the current version path

Primary areas:

- `vona/src/suite/cabloy-admin/modules/admin-rbac/src/`
- `admin-menu` `meta.version.ts`, entity/model/service tests
- `admin-rbac` current-version-path removal and `admin-role` role-deletion lifecycle integration

Tasks:

- add the distinct active-instance role-menu association with `roleId`, `ssrSiteName`, final `ssrMenuName`, lookup indexes, and ordinary lifecycle fields; row existence is the only enabled dynamic state and an uncheck deletes the row;
- move the entity schema from `admin-rbac` to the current `admin-menu` version-1 path without incrementing either module's `vonaModule.fileVersion`;
- validate target role/site-tree/final-leaf eligibility transactionally, prevent duplicate races without `table.unique(...)`, and clean associations on role deletion;
- make unknown, renamed, retired, or no-longer-bound site/menu identities fail closed and available only to a protected repair/reconciliation path.

Acceptance checks:

- action grants and role-menu associations remain different entities, services, and semantics;
- cross-instance, wrong-site, public-leaf, stale-name, duplicate, absent-row deletion, and partial-write paths fail safely;
- the changed `meta.version.ts` path is covered by `npm run test` and test-owned associations are removed in `finally`.

Traceability: `PRD-ADM-MNU-01`–`PRD-ADM-MNU-04`; `SRS-ADM-MNU-03`–`SRS-ADM-MNU-05`, `SRS-ADM-MNU-15`; `ATP-ADM-MNU-01`, `ATP-ADM-MNU-02`, `ATP-ADM-MNU-04`.

#### WBS-ADM-90-03: Deliver server-side catalog, SSR evaluation, and safe public projection

Primary areas:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/`
- `vona/src/suite/cabloy-admin/modules/admin-menu/src/`
- existing `home-base` menu endpoint and Admin menu declarations

Tasks:

- derive a protected site-tree catalog from registered SSR sites and actual menu/group bindings, including omitted-`site` declarations and final keyed leaf names;
- evaluate the definedness-based static/dynamic policy per request before private metadata is projected away, retaining structural site/instance/host/locale cache behavior;
- implement public, dynamic-only/default-deny, and static-or-dynamic union visibility without an implicit `systemAdmin` shortcut;
- derive groups from filtered children and redact every policy-private field from the unchanged public menu endpoint.

Acceptance checks:

- structural caching never returns a subject-specific visible result to another caller;
- public, dynamic-only, and static-or-dynamic leaf semantics are exact, and empty groups are omitted;
- public menu responses contain neither role declarations, association state, protected catalog metadata, revisions, nor role topology.

Traceability: `PRD-ADM-MNU-02`–`PRD-ADM-MNU-05`; `SRS-ADM-MNU-02`, `SRS-ADM-MNU-07`–`SRS-ADM-MNU-10`; `ATP-ADM-MNU-02`, `ATP-ADM-MNU-03`, `ATP-ADM-MNU-05`, `ATP-ADM-MNU-08`.

#### WBS-ADM-90-04: Deliver protected configuration APIs and separate invalidation

Primary areas:

- `admin-menu` controller, DTOs, service, menu-visibility revision/configuration-query invalidation, generated OpenAPI
- `admin-role` Menu Authorization composition integration

Tasks:

- expose a `systemAdmin`-protected registered-site catalog and role configuration command/query surface with narrow safe DTOs;
- validate active-instance role, exact `ssrSiteName`, final `ssrMenuName`, configurable-leaf state, and surviving-association state at the service layer;
- create a dedicated menu-visibility revision and configuration-query invalidation path instead of repurposing action-RBAC or coarse permission invalidation; retain normal `roleMenu` Model entity/query-cache invalidation for SSR association lookup rather than bypassing it;
- generate frontend contracts from Vona DTO/controller/OpenAPI truth.

Acceptance checks:

- catalog/configuration admission and projections cannot leak raw SSR metadata, other-role assignments, Passport topology, or API authority claims;
- committed configuration mutations invalidate only the relevant visibility resolver/editor state and do not leave stale effective policy;
- generated API consumers contain the intended contract without hand edits.

Traceability: `PRD-ADM-MNU-01`–`PRD-ADM-MNU-03`, `PRD-ADM-MNU-05`; `SRS-ADM-MNU-04`, `SRS-ADM-MNU-06`, `SRS-ADM-MNU-11`, `SRS-ADM-MNU-14`; `ATP-ADM-MNU-01`, `ATP-ADM-MNU-04`, `ATP-ADM-MNU-05`, `ATP-ADM-MNU-09`.

#### WBS-ADM-90-05: Add the Role-detail Menu Authorization editor

Primary areas:

- `vona/src/suite/cabloy-admin/modules/admin-role/src/dto/roleView.tsx`
- `zova/src/suite/cabloy-admin/modules/admin-menu/src/`
- generated consumers and Start Admin Role Resource composition

Tasks:

- add the server-rendered Menu Authorization block beside Resource Permissions in the existing Role View;
- implement a dedicated `admin-menu` model/component for catalog/configuration state and mutations;
- retain `rest-resource.model.resource` as the only generic Role CRUD/cache owner and invalidate/refetch only the affected role-configuration state;
- keep targeted editor-state invalidation separate from authenticated menu freshness, which is handled by `WBS-ADM-90-06`;
- preserve Start Admin SSR/hydration equivalence and safe empty/loading/error states.

Acceptance checks:

- Role detail displays only its safe site-tree configuration state; public leaves and groups have no configurable checkbox, and the UI cannot submit hidden policy topology;
- the new block coexists with Resource Permissions without a competing Role Resource cache owner;
- the generated consumer and paired Start Admin outputs reflect Vona-first contract truth.

Traceability: `PRD-ADM-MNU-01`, `PRD-ADM-MNU-03`, `PRD-ADM-MNU-05`; `SRS-ADM-MNU-06`, `SRS-ADM-MNU-13`, `SRS-ADM-MNU-14`; `ATP-ADM-MNU-01`, `ATP-ADM-MNU-08`, `ATP-ADM-MNU-09`.

#### WBS-ADM-90-06: Implement authoritative menu and session freshness

Primary areas:

- `admin-menu` mutation/session integration and visibility resolver
- current-subject application reload and authenticated application bootstrap
- site menu model ownership and server-authoritative retrieval

Tasks:

- make a committed role-menu policy mutation observable on the next authenticated menu retrieval;
- after invalidating the affected role-configuration state, invoke `this.app.reload()` when the affected role is held by the current Passport subject;
- after invalidating the affected User Resource item, invoke `this.app.reload()` when ordinary-role replacement targets the current Passport subject;
- do not invoke targeted Passport refresh, mutation-level relogin fallback, or `home-layoutadmin` `ModelMenu.refreshMenus()` from these mutation callbacks;
- do not reload the current browser for mutations affecting another subject; preserve each site's public-path/locale menu query key and do not add role identity;
- do not add real-time cross-browser push.

Acceptance checks:

- current-subject policy and membership changes cause an application reload and the reloaded application reflects fresh server-authoritative authenticated and menu state;
- mutations affecting another subject do not trigger an unnecessary local reload;
- continuing-session behavior remains server-authoritative and does not expose role identity through a browser cache key;
- one browser's update does not imply unplanned push semantics for other browsers.

Traceability: `PRD-ADM-MNU-02`, `PRD-ADM-MNU-03`, `PRD-ADM-MNU-06`; `SRS-ADM-MNU-08`, `SRS-ADM-MNU-11`–`SRS-ADM-MNU-13`; `ATP-ADM-MNU-02`, `ATP-ADM-MNU-07`, `ATP-ADM-MNU-08`.

#### WBS-ADM-90-07: Prove focused role-menu policy, isolation, and browser behavior

Dependencies: `WBS-ADM-100-01` and `WBS-ADM-100-02`; it executes `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08` against the extracted `admin-menu` ownership.

Primary areas:

- `admin-menu` and `admin-role` module-local tests
- SSR menu/server tests
- `repo-e2e/specs/cabloy-admin.spec.ts`
- retained Phase 90 acceptance evidence after actual execution

Tasks:

- test protected site-tree catalog/configuration access, public/dynamic-only/static-or-dynamic semantics, enabled/disabled assignments, role union, and stale-name denial;
- test active-instance/site isolation, omitted-site bindings, final keyed leaf identities, public menu redaction, and direct API denial despite visible/guessed navigation;
- test affected-current-subject application reload, unrelated-subject no-reload, post-reload SSR/hydration and menu correctness, Role editor rendering, renamed/retired identity reconciliation, and derived empty-group behavior;
- use separate `mockCtx(...)` boundaries for any deliberately competing operation and clean test-owned rows in `finally`.

Acceptance checks:

- all `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08` scenarios have passing, redacted, traceable evidence only after their procedures execute;
- direct server authorization remains separately negative-tested from browser navigation disclosure;
- no Phase 90 status advances beyond observed evidence.

Traceability: `PRD-ADM-MNU-*`; `SRS-ADM-MNU-01`–`SRS-ADM-MNU-13`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08`.

### Phase 100: Extract the paired admin-menu module

Dependencies: `WBS-ADM-90-01`–`WBS-ADM-90-06`. This refactoring moves role-menu domain ownership from the existing `admin-rbac` implementation to paired `admin-menu` modules before current-revision Phase 90 behavior acceptance. It preserves the approved menu-visibility behavior and independent authorization boundary, creates no new suite or Admin site, intentionally permits menu API and generated-consumer renaming during development, and keeps each affected `vonaModule.fileVersion` at `1`. `WBS-ADM-90-07` executes `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08` against the extracted ownership; `WBS-ADM-100-03` then closes the extraction contract-loop and regression proof before `WBS-ADM-90-08` performs the combined Phase 90 evidence closure.

#### WBS-ADM-100-01: Establish paired admin-menu module ownership

Primary areas:

- `vona/src/suite/cabloy-admin/modules/admin-menu/`
- `zova/src/suite/cabloy-admin/modules/admin-menu/`
- suite metadata, package dependencies, and `admin-role` Menu Authorization composition

Tasks:

- scaffold paired suite-contained `admin-menu` modules through the established Vona/Zova command families and register normal metadata/dependencies;
- move all menu-domain backend and frontend source from `admin-rbac` to `admin-menu`, including role-menu associations, menu-visibility revisions, catalog/configuration DTOs/controllers/services, SSR resolver integration, generated consumer ownership, model state, and editor component;
- update `admin-role` to compose the `admin-menu` editor while retaining `rest-resource.model.resource` as the sole generic Role CRUD/cache owner;
- remove menu-domain exports, dependencies, and terminology from `admin-rbac`, which continues to own action grants and Department/owner data-scope policy only.

Acceptance checks:

- both source roots contain the paired `admin-menu` module and dependency metadata resolves normally;
- every menu-domain owner is `admin-menu`, while `admin-rbac` retains no role-menu persistence, API, projection, revision, resolver, model, or editor responsibility;
- no new SSR site, flavor, public path, tenant, identity, persistence, or API-authorization boundary is introduced.

Traceability: `PRD-ADM-MNU-01`–`PRD-ADM-MNU-06`; `SRS-ADM-MNU-03`, `SRS-ADM-MNU-06`, `SRS-ADM-MNU-10`–`SRS-ADM-MNU-15`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`.

#### WBS-ADM-100-02: Move version-1 menu persistence and contracts

Primary areas:

- `admin-menu` and `admin-rbac` `meta.version.ts` paths
- `admin-menu` entity/model/service/controller/DTO/OpenAPI sources
- generated Zova menu consumer

Tasks:

- remove role-menu tables from the `admin-rbac` version-1 creation path and create the unchanged development-stage menu schema in `admin-menu` version 1;
- move entity/model/service/controller/DTO/OpenAPI truth to `admin-menu` and regenerate consumers; legacy menu routes and generated-consumer names need not be retained;
- retain active-instance scope, exact role/site/final-leaf identity, transaction/race behavior, safe catalog projection, separate visibility revision, and independent API authorization;
- run `npm run test` after changing either `meta.version.ts` path.

Acceptance checks:

- both affected Vona modules retain `vonaModule.fileVersion: 1` and test database initialization creates the role-menu schema exclusively through `admin-menu`;
- generated API/schema outputs identify `admin-menu` ownership and are not hand-edited;
- old `admin-rbac` role-menu API paths and generated-consumer names are absent rather than maintained as compatibility aliases.

Traceability: `PRD-ADM-MNU-01`–`PRD-ADM-MNU-06`; `SRS-ADM-MNU-03`–`SRS-ADM-MNU-15`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`.

#### WBS-ADM-100-03: Close the extraction contract loop and regression proof

Dependencies: `WBS-ADM-100-01`, `WBS-ADM-100-02`, and `WBS-ADM-90-07`.

Primary areas:

- affected Vona/Zova metadata and generated consumers
- Start Admin SSR/REST artifacts and Vona dependency handoff
- targeted role-menu, Role View, SSR, and authorization tests

Tasks:

- regenerate from Vona contract truth, run the paired `npm run build:zova:admin` output, then run `npm run deps:vona`;
- execute targeted menu-domain, Role View, direct API-authorization, and SSR/hydration tests, followed by `npm run test` for the version-path edit;
- retain new revision-scoped proof for the role-menu ATP scenarios without rewriting the prior Phase 90 historical evidence.

Acceptance checks:

- `npm run build:zova:admin` completes before `npm run deps:vona`; REST-only output is not accepted;
- menu visibility behavior and direct API authorization remain independently proven after the ownership move;
- no generated consumer is hand-edited, and the new evidence identifies the extraction revision, environment, procedure, and result.

Traceability: `PRD-ADM-MNU-*`; `SRS-ADM-MNU-10`, `SRS-ADM-MNU-14`, `SRS-ADM-MNU-15`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`.

#### WBS-ADM-90-08: Close the Vona/Zova contract loop and Phase 90 evidence

Dependencies: `WBS-ADM-90-07` and `WBS-ADM-100-03`.

Primary areas:

- owning Vona contracts and generated Zova consumers
- Start Admin SSR/REST outputs and Vona dependency handoff
- Phase 90 evidence/progress reconciliation

Tasks:

- generate consumers from Vona contract truth and verify that no generated consumer is hand-edited;
- run targeted role-menu tests, `npm run test` after the version-path edit, paired Start Admin build, dependency handoff, and applicable quality/browser checks;
- reconcile PRD/SRS/WBS/ATP identifiers, retained redacted evidence, ADR status, and progress only after the required acceptance procedures pass.

Acceptance checks:

- `npm run build:zova:admin` completes before `npm run deps:vona`; REST-only output is not accepted as a reverse-chain substitute;
- `ATP-ADM-MNU-09` and all applicable preceding ATP evidence identify revision, environment, procedure, and outcome;
- Phase 90 remains `not-started` until implementation/evidence exists and becomes verified only through retained traceable proof.

Traceability: `PRD-ADM-MNU-*`; `SRS-ADM-MNU-14`, `SRS-ADM-MNU-15`; `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`.

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

| WBS group        | PRD source                                           | SRS source                                                             | Required ATP evidence                                                                                     |
| ---------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `WBS-ADM-10-*`   | All                                                  | All                                                                    | Traceability review                                                                                       |
| `WBS-ADM-20-*`   | `PRD-ADM-SEC-*`, `PRD-ADM-UI-*`                      | `SRS-ADM-API-*`, `SRS-ADM-UI-*`                                        | `ATP-ADM-CTR-01`, `ATP-ADM-RES-01`, `ATP-ADM-SSR-01`                                                      |
| `WBS-ADM-30-*`   | `PRD-ADM-USR-*`, `PRD-ADM-ROL-*`                     | `SRS-ADM-USR-*`, `SRS-ADM-ROL-*`                                       | `ATP-ADM-USR-01`, `ATP-ADM-ROL-01`                                                                        |
| `WBS-ADM-40-*`   | `PRD-ADM-SUP-*`                                      | `SRS-ADM-SUP-*`, `SRS-ADM-TXN-*`, `SRS-ADM-AUD-*`                      | `ATP-ADM-SUP-01`, `ATP-ADM-SUP-02`, `ATP-ADM-SUP-RACE-01`                                                 |
| `WBS-ADM-50-*`   | `PRD-ADM-DEP-*`                                      | `SRS-ADM-DEP-*`                                                        | `ATP-ADM-DEP-01`, `ATP-ADM-DEP-02`                                                                        |
| `WBS-ADM-60-*`   | `PRD-ADM-MEM-*`                                      | `SRS-ADM-MEM-*`                                                        | `ATP-ADM-MEM-01`, `ATP-ADM-MEM-02`, `ATP-ADM-MGR-01`, `ATP-ADM-RES-01`–`ATP-ADM-RES-03`, `ATP-ADM-SSR-01` |
| `WBS-ADM-80-01`  | `PRD-ADM-POL-*`                                      | `SRS-ADM-POL-01`–`SRS-ADM-POL-09`                                      | `ATP-ADM-POL-01`                                                                                          |
| `WBS-ADM-80-02`  | `PRD-ADM-POL-*`, `PRD-ADM-SCP-*`                     | `SRS-ADM-POL-*`, `SRS-ADM-SCP-01`–`SRS-ADM-SCP-05`                     | `ATP-ADM-POL-02`, `ATP-ADM-SCP-01`                                                                        |
| `WBS-ADM-80-03`  | `PRD-ADM-SCP-*`                                      | `SRS-ADM-SCP-06`–`SRS-ADM-SCP-13`                                      | `ATP-ADM-SCP-02`                                                                                          |
| `WBS-ADM-80-04`  | `PRD-ADM-POL-*`, `PRD-ADM-SCP-*`                     | `SRS-ADM-POL-09`, `SRS-ADM-SCP-09`                                     | `ATP-ADM-POL-03`, `ATP-ADM-POL-04`                                                                        |
| `WBS-ADM-80-05`  | All Phase 80                                         | `SRS-ADM-API-*`, `SRS-ADM-NFR-*`                                       | `ATP-ADM-POL-01`–`ATP-ADM-POL-04`, `ATP-ADM-SCP-01`–`ATP-ADM-SCP-02`                                      |
| `WBS-ADM-90-01`  | `PRD-ADM-MNU-01`, `PRD-ADM-MNU-04`, `PRD-ADM-MNU-05` | `SRS-ADM-MNU-01`, `SRS-ADM-MNU-02`, `SRS-ADM-MNU-09`, `SRS-ADM-MNU-10` | `ATP-ADM-MNU-01`, `ATP-ADM-MNU-03`, `ATP-ADM-MNU-05`, `ATP-ADM-MNU-06`                                    |
| `WBS-ADM-90-02`  | `PRD-ADM-MNU-01`–`PRD-ADM-MNU-04`                    | `SRS-ADM-MNU-03`–`SRS-ADM-MNU-05`, `SRS-ADM-MNU-15`                    | `ATP-ADM-MNU-01`, `ATP-ADM-MNU-02`, `ATP-ADM-MNU-04`                                                      |
| `WBS-ADM-90-03`  | `PRD-ADM-MNU-02`–`PRD-ADM-MNU-05`                    | `SRS-ADM-MNU-02`, `SRS-ADM-MNU-07`–`SRS-ADM-MNU-10`                    | `ATP-ADM-MNU-02`, `ATP-ADM-MNU-03`, `ATP-ADM-MNU-05`, `ATP-ADM-MNU-08`                                    |
| `WBS-ADM-90-04`  | `PRD-ADM-MNU-01`–`PRD-ADM-MNU-03`, `PRD-ADM-MNU-05`  | `SRS-ADM-MNU-04`, `SRS-ADM-MNU-06`, `SRS-ADM-MNU-11`, `SRS-ADM-MNU-14` | `ATP-ADM-MNU-01`, `ATP-ADM-MNU-04`, `ATP-ADM-MNU-05`, `ATP-ADM-MNU-09`                                    |
| `WBS-ADM-90-05`  | `PRD-ADM-MNU-01`, `PRD-ADM-MNU-03`, `PRD-ADM-MNU-05` | `SRS-ADM-MNU-06`, `SRS-ADM-MNU-13`, `SRS-ADM-MNU-14`                   | `ATP-ADM-MNU-01`, `ATP-ADM-MNU-08`, `ATP-ADM-MNU-09`                                                      |
| `WBS-ADM-90-06`  | `PRD-ADM-MNU-02`, `PRD-ADM-MNU-03`, `PRD-ADM-MNU-06` | `SRS-ADM-MNU-08`, `SRS-ADM-MNU-11`–`SRS-ADM-MNU-13`                    | `ATP-ADM-MNU-02`, `ATP-ADM-MNU-07`, `ATP-ADM-MNU-08`                                                      |
| `WBS-ADM-90-07`  | `PRD-ADM-MNU-*`                                      | `SRS-ADM-MNU-01`–`SRS-ADM-MNU-13`                                      | `ATP-ADM-MNU-01`–`ATP-ADM-MNU-08`                                                                         |
| `WBS-ADM-90-08`  | `PRD-ADM-MNU-*`                                      | `SRS-ADM-MNU-14`, `SRS-ADM-MNU-15`                                     | `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`                                                                         |
| `WBS-ADM-100-01` | `PRD-ADM-MNU-*`                                      | `SRS-ADM-MNU-03`, `SRS-ADM-MNU-06`, `SRS-ADM-MNU-10`–`SRS-ADM-MNU-15`  | `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`                                                                         |
| `WBS-ADM-100-02` | `PRD-ADM-MNU-*`                                      | `SRS-ADM-MNU-03`–`SRS-ADM-MNU-15`                                      | `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`                                                                         |
| `WBS-ADM-100-03` | `PRD-ADM-MNU-*`                                      | `SRS-ADM-MNU-10`, `SRS-ADM-MNU-14`, `SRS-ADM-MNU-15`                   | `ATP-ADM-MNU-01`–`ATP-ADM-MNU-09`                                                                         |
| `WBS-ADM-70-*`   | All applicable                                       | `SRS-ADM-NFR-*`                                                        | All applicable ATP evidence                                                                               |

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
- [ADR 0002: Dynamic RBAC and Department Data Scope](./decisions/0002-dynamic-rbac-and-data-scope.md)
- [ADR 0003: Role Menu Visibility](./decisions/0003-role-menu-visibility.md)
- [Menu Guide](../../repo-docs/backend/menu-guide.md)
- [Suites and Modules](../../repo-docs/fullstack/suites-and-modules.md)
- [Contract Loop Playbook](../../repo-docs/fullstack/contract-loop-playbook.md)
