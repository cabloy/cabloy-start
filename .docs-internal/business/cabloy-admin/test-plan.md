# Cabloy Admin Test Strategy and Acceptance Plan

## Purpose and Authority

This document defines Cabloy Admin verification strategy, executable acceptance scenarios, evidence format, and release proof. It completes the planning chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

The [PRD](./prd.md) owns product outcomes and business acceptance. The [SRS](./srs.md) owns technical contracts and invariants. The [PDP/WBS](./pdp-wbs.md) owns delivery sequence. This document defines how those decisions are proved and must not redefine them.

No Cabloy Admin implementation or acceptance evidence exists when this document is created.

## Scope and Quality Priorities

The phase-one risks requiring repeatable proof are:

1. active-instance isolation and no cross-instance disclosure;
2. server-side API authorization independent of menu or route visibility;
3. reuse of established identity and role facts without duplicate persistence;
4. fixed framework-role-definition protection versus non-system-administrator membership management, including `registeredUser`;
5. fresh reauthentication, immutable audit evidence, and session effects for sensitive operations;
6. transactional preservation of the final activated `systemAdmin`, including actual contention;
7. Department root, parent, move, lifecycle, sibling, and cycle invariants;
8. multiple memberships, membership uniqueness, primary membership, and manager eligibility;
9. Vona-first generated contracts and paired Start Admin reverse handoff; and
10. `presetResource` integration with one selector-scoped generic Resource cache owner.

Dynamic RBAC, recursive Department data scopes, a Position catalog, Organization, employment workflows, external identity synchronization, and a new Admin SSR application remain out of scope.

## Verification Model

### Narrow verification

Run the smallest module-local tests covering the changed capability and invariant. Backend suites use `node:test` and `vona-mock`.

Every scoped operation owns an `app.bean.executor.mockCtx(...)` boundary. API/action behavior uses `performAction(...)`; durable invariants may use direct scoped model reads; negative paths use `assert.rejects(...)` or the asserted API error result.

Runner parallelism is not race proof. Every intentionally competing business operation runs in a separate `mockCtx(...)` boundary, and stateful suites declare `{ concurrency: false }` explicitly. Test-owned persistent records are removed in `finally` with precise identities in reverse dependency order.

### Contract verification

For Vona DTO, controller, schema, or OpenAPI changes, update backend contract truth first and regenerate the owning Zova consumer. Generated files are not hand-edited.

For Zova metadata, renderer, route, menu-resource, or other reverse-chain changes, build the paired Start Admin SSR and REST outputs before refreshing Vona dependencies:

```bash
npm run build:zova:admin
npm run deps:vona
```

`build:rest:*` alone is insufficient.

### Full verification

Before a release candidate, run required focused tests, affected module/repository tests, type/lint/format checks, Start Admin paired artifact generation, dependency synchronization, PostgreSQL contention evidence, and the tagged clean browser suite.

## Test Levels and Planned Locations

| Level                         | Purpose                                                                | Planned location                                            |
| ----------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| Service/state tests           | Lifecycle, validation, data projection, and invariant behavior         | Module-local `test/**/*.test.ts`                            |
| Transaction/integration tests | Locking, rollback, duplicate prevention, and concurrent outcomes       | Module-local `test/**/*.test.ts` with `vona-mock`           |
| Action/API tests              | Authentication, authorization, active-instance absence, DTO boundaries | Module-local `test/**/*.test.ts` using `performAction(...)` |
| Cross-database tests          | Protected-administrator, tree, and membership contention               | PostgreSQL CI plus focused local gate                       |
| Contract tests                | Emitted OpenAPI and generated consumers match Vona source truth        | Owning Vona/Zova module checks                              |
| Admin Resource tests          | Resource permissions, menu metadata, semantic façade invalidation      | Module-local tests and Start Admin integration              |
| SSR/browser acceptance        | Admin SSR, hydration, navigation, direct API separation, interactions  | `e2e/specs/cabloy-start/cabloy-admin.spec.ts`               |

Planned backend ownership:

```text
vona/src/suite/cabloy-admin/modules/admin-user/test/userAdmin.test.ts
vona/src/suite/cabloy-admin/modules/admin-role/test/roleAdmin.test.ts
vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts
vona/src/suite/cabloy-admin/modules/admin-department/test/department.test.ts
vona/src/suite/cabloy-admin/modules/admin-department/test/departmentTree.test.ts
vona/src/suite/cabloy-admin/modules/admin-department/test/departmentMembership.test.ts
```

Tests remain with the module that owns the invariant: identity projection in `admin-user`, ordinary/protected role behavior in `admin-role`, and tree/membership/manager facts in `admin-department`.

## Test Fixtures and Evidence

### Minimum fixture set

Isolation and concurrency tests prepare at least:

- active instance A and active instance B;
- active and inactive accounts in each instance;
- two activated `systemAdmin` accounts in instance A for authority-loss contention;
- `registeredUser`, `systemAdmin`, and one ordinary role;
- multiple root Departments, child Departments, and a disabled Department in instance A;
- equivalent business names in distinct instances and sibling scopes where relevant;
- one account with multiple Department memberships, one enabled primary membership, and one eligible manager membership; and
- deterministic fixtures for competing revoke/deactivate, move, duplicate-membership, and primary-membership operations.

Shared durable fixtures are created only by the owning module `meta.version.ts` `seed()` hook and are read-only to tests. Test-local records are explicitly cleaned up in `finally`.

### Evidence record

Each accepted `ATP-ADM-*` scenario retains:

- linked PRD, SRS, and WBS identifiers;
- tested source revision, database client, and Zova flavor where applicable;
- exact command or browser procedure;
- fixture identities and operation interleaving when concurrency matters;
- result and retained log, response, screenshot, CI job, or generated-artifact location; and
- waiver owner, reason, and expiry date for any temporary exception.

A local pass may establish `implementation-complete`; only retained, traceable evidence can establish `verified`. An expired waiver is a release blocker.

## Acceptance Scenario Catalogue

| ID                    | Scenario                                                                                                                                                        | Expected invariant                                                                                                                                                                                                                                      | Level                  | Traceability                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ATP-ADM-TEN-01`      | Use instance-A context to read or mutate instance-B accounts, roles, Department roots/children, memberships, manager relations, and sensitive-operation audits. | Cross-instance rows are absent; no relation, command, audit, or recovery path crosses active-instance scope.                                                                                                                                            | API, integration       | `SRS-ADM-TEN-*`; `WBS-ADM-20-*`, `WBS-ADM-70-*`                                                                         |
| `ATP-ADM-AUT-01`      | Call every phase-one API as anonymous, inactive, ordinary, and `systemAdmin` callers, independent of menu and route knowledge.                                  | APIs are authorized by server-side Passport guards and service checks; navigation visibility never grants authority.                                                                                                                                    | API, SSR               | `SRS-ADM-AUT-*`; `WBS-ADM-20-*`, `WBS-ADM-70-*`                                                                         |
| `ATP-ADM-USR-01`      | List/view accounts, update allowed profile fields, activate/deactivate ordinary accounts, and attempt forbidden identity/credential/protected-field writes.     | Existing identity facts are reused; only allowed fields change; protected authority cases delegate safely.                                                                                                                                              | API, service           | `SRS-ADM-USR-*`; `WBS-ADM-30-01`                                                                                        |
| `ATP-ADM-ROL-01`      | Create/update/delete custom roles; attempt fixed-definition mutations; select and replace `registeredUser`/custom memberships; and submit `systemAdmin`.        | Custom-role lifecycle is active-instance-scoped and atomic; both framework-role definitions remain fixed; `registeredUser` membership is replaceable; generic APIs cannot select, grant, revoke, or mutate `systemAdmin`.                               | API, transaction       | `SRS-ADM-ROL-*`; `WBS-ADM-30-02`                                                                                        |
| `ATP-ADM-SUP-01`      | Grant/revoke `systemAdmin` with fresh verification; inspect audit and target-session effects.                                                                   | Sensitive commands require purpose-bound fresh verification, record redacted immutable evidence, and evict target sessions after commit.                                                                                                                | API, integration       | `SRS-ADM-SUP-*`, `SRS-ADM-AUD-*`; `WBS-ADM-40-01`, `WBS-ADM-40-02`                                                      |
| `ATP-ADM-SUP-02`      | Attempt revoke, deactivate, delete, or other authority-loss actions against the final activated `systemAdmin`.                                                  | Each action is rejected with a stable conflict; role, user, membership, audit, and cache facts remain coherent.                                                                                                                                         | Transaction, API       | `SRS-ADM-TXN-01`–`SRS-ADM-TXN-03`; `WBS-ADM-40-02`                                                                      |
| `ATP-ADM-SUP-RACE-01` | Run competing protected revoke/deactivation operations in separate request contexts.                                                                            | At least one activated `systemAdmin` survives; no partial durable state remains; PostgreSQL confirms lock behavior.                                                                                                                                     | PostgreSQL transaction | `SRS-ADM-TXN-04`; `WBS-ADM-40-03`                                                                                       |
| `ATP-ADM-DEP-01`      | Create multiple roots, valid children, invalid `0` parent, missing/cross-instance parent, self-parent, and descendant-parent move.                              | Roots use `null`; parents are active-instance records; tree cycles and cross-instance parentage are impossible.                                                                                                                                         | API, transaction       | `SRS-ADM-DEP-01`–`SRS-ADM-DEP-04`; `WBS-ADM-50-*`                                                                       |
| `ATP-ADM-DEP-02`      | Exercise sibling duplicate names, ordered moves, disable, and delete with children/memberships/manager dependencies.                                            | Tree lifecycle is deterministic; no implicit recursive deletion or silent dependent-state cascade occurs.                                                                                                                                               | Service, transaction   | `SRS-ADM-DEP-03`–`SRS-ADM-DEP-07`; `WBS-ADM-50-02`                                                                      |
| `ATP-ADM-MEM-01`      | Assign one user to multiple Departments with different position text; attempt duplicate and cross-instance relations.                                           | Position remains membership-scoped; multiple memberships work; duplicate/cross-instance writes fail atomically.                                                                                                                                         | API, integration       | `SRS-ADM-MEM-01`, `SRS-ADM-MEM-02`; `WBS-ADM-60-01`                                                                     |
| `ATP-ADM-MEM-02`      | Set competing primary memberships, remove/disable a primary, and re-read durable state.                                                                         | At most one enabled primary exists per user/instance; setting is atomic and removal/disable clears rather than guesses a replacement.                                                                                                                   | PostgreSQL transaction | `SRS-ADM-MEM-03`; `WBS-ADM-60-02`                                                                                       |
| `ATP-ADM-MGR-01`      | Assign a manager, try a user without an enabled same-Department membership, then remove/disable the manager membership.                                         | Manager is an enabled membership of the same Department and must be replaced or cleared atomically on lifecycle change.                                                                                                                                 | API, transaction       | `SRS-ADM-MEM-04`, `SRS-ADM-MEM-05`; `WBS-ADM-60-02`                                                                     |
| `ATP-ADM-CTR-01`      | Reproduce approved Cabloy Admin suite metadata, change Vona contract truth, and then apply a Start Admin frontend reverse input after the modules exist.        | Suite topology/metadata reproduces without edits; generated consumers refresh without edits; paired Start Admin SSR/REST output builds before `deps:vona`.                                                                                              | Build, contract        | `SRS-ADM-API-04`, `SRS-ADM-API-05`; `WBS-ADM-20-01`, `WBS-ADM-20-03`, `WBS-ADM-70-01`                                   |
| `ATP-ADM-RES-01`      | Open each approved `presetResource` and issue a custom Department/role command.                                                                                 | Generic Resource owns conventional CRUD/cache state; a thin façade shares its selector/invalidation; sensitive commands are not generic CRUD.                                                                                                           | Resource, browser      | `SRS-ADM-UI-01`, `SRS-ADM-UI-02`; `WBS-ADM-20-02`, `WBS-ADM-60-03`                                                      |
| `ATP-ADM-RES-02`      | In rendered Department detail, add, edit, set/clear primary, set/clear manager, and delete a membership.                                                        | Each custom command refreshes the visible membership/manager state through the existing Department Resource selector without a full-page reload; fixture APIs only arrange and clean test data, and no generic Department PATCH handles these commands. | Resource, browser      | `SRS-ADM-MEM-01`–`SRS-ADM-MEM-05`, `SRS-ADM-UI-01`, `SRS-ADM-UI-02`; `WBS-ADM-60-01`–`WBS-ADM-60-03`                    |
| `ATP-ADM-RES-03`      | In rendered User detail, display all roles, label `systemAdmin` as protected, and replace non-system-administrator memberships through the generated picker.    | The picker includes `registeredUser` and custom roles but never `systemAdmin`; the dedicated command excludes `systemAdmin`, refreshes the affected User Resource item without reload, and no generic User PATCH occurs.                                | Resource, browser      | `SRS-ADM-USR-06`, `SRS-ADM-ROL-04`–`SRS-ADM-ROL-07`, `SRS-ADM-UI-01`, `SRS-ADM-UI-02`; `WBS-ADM-30-02`, `WBS-ADM-60-03` |
| `ATP-ADM-SSR-01`      | Load Start Admin SSR, hydrate, navigate menus/routes, and compare direct API outcomes for ordinary and privileged callers.                                      | SSR/hydration, menu/route admission, and Vona API authorization are independently correct.                                                                                                                                                              | SSR, browser, API      | `SRS-ADM-AUT-*`, `SRS-ADM-UI-03`; `WBS-ADM-20-02`, `WBS-ADM-70-02`                                                      |

## Commands

### Available implementation checks

```bash
# Discover command families
npm run vona :
npm run zova :

# Focus a module-local test after it exists
npm run vona :bin:test -- admin-department/test/departmentTree.test.ts --flavor=normal

# Shared checks
npm run test
npm run tsc
npm run lint
npm run format

# Paired Start Admin handoff after relevant frontend/metadata output changes
npm run build:zova:admin
npm run deps:vona

# Clean browser acceptance after paired artifacts are available
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The clean E2E command resets its managed test state and drives the Vona SSR runtime, but it does not replace the paired build/dependency-sync prerequisite. Do not change shared environment identity or ports to bypass a busy resource.

## Release Gates

| Gate            | Required proof                                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation   | PRD, ADR, SRS, WBS, test plan, and progress records have complete traceability with no implementation-affecting open policy decision.                                   |
| Security        | `ATP-ADM-AUT-01`, `ATP-ADM-SUP-01`, `ATP-ADM-SUP-02`, and `ATP-ADM-SUP-RACE-01` have retained direct API and PostgreSQL evidence.                                       |
| Department      | `ATP-ADM-DEP-*`, `ATP-ADM-MEM-*`, and `ATP-ADM-MGR-01` prove tree, lifecycle, membership, and manager invariants.                                                       |
| Contract        | `ATP-ADM-CTR-01` proves Vona-forward and Start Admin paired reverse loops without generated-file edits.                                                                 |
| Admin runtime   | `ATP-ADM-RES-01`, `ATP-ADM-RES-02`, and `ATP-ADM-SSR-01` prove resource ownership, rendered Department membership commands, Admin browser behavior, and API separation. |
| Release closure | All applicable WBS acceptance checks are satisfied, evidence is retained, and no expired waiver or severity-one invariant failure remains.                              |

## Related Records

- [Cabloy Admin internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Delivery Progress](./progress.md)
- [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md)
