# Phase 80 Direct External HTTP/API Matrix Validation

- **Tested revision:** `b28df501233b4cf540c898ae138122c7b240ee44` (`feat: update`), with the documented working-tree HTTP-fixture, acceptance-specification, and Student/Record bulk-preflight changes.
- **Executor date:** 2026-08-27.
- **External target:** worktree-managed Vona development runtime at `http://127.0.0.1:7103`.
- **Runtime/database:** Cabloy Start Vona development runtime backed by its local SQLite/`better-sqlite3` database.
- **Fixture namespace:** `e2e-fixture-admin-rbac-`.

## Procedure

The API-only Playwright matrix used the configured external target. It sent real HTTP requests through Playwright `APIRequestContext` with bearer tokens issued by the runtime; it did not import backend controllers, services, models, `mockCtx(...)`, or `performAction(...)`.

```bash
E2E_BASE_URL=http://127.0.0.1:7103 npm run test:e2e:fast cabloy-admin-rbac-api -- --tag @admin-rbac-api
```

Observed output:

```text
Running 3 tests using 1 worker

  ✓  1 repo-e2e/specs/cabloy-admin-rbac-api.spec.ts:457:1 › ATP-ADM-POL-02: direct policy admission, control-plane protection, and invalidation @admin @cabloy-admin @admin-rbac-api (1.1s)
  ✓  2 repo-e2e/specs/cabloy-admin-rbac-api.spec.ts:582:1 › ATP-ADM-SCP-01: direct five-scope union and structural-filter matrix @admin @cabloy-admin @admin-rbac-api (3.3s)
  ✓  3 repo-e2e/specs/cabloy-admin-rbac-api.spec.ts:821:1 › ATP-ADM-SCP-02: direct Student and Record ownership, inheritance, and bulk preflight @admin @cabloy-admin @admin-rbac-api (2.0s)

  3 passed (6.3s)
```

## Fixture lifecycle

Each serial scenario registered and activated fresh ordinary accounts whose usernames begin with the fixture namespace. A seeded system-administrator account performed only setup and cleanup through protected control-plane APIs. Each scenario maintained a test-owned ledger and attempted reverse-order cleanup for Records, Students, grant-Department mappings, grants, memberships, Departments, Roles, and temporary accounts. No seeded Role, account membership, or durable fixture was mutated as test data.

## Covered wire contracts

- `ATP-ADM-POL-02`: unrestricted system-administrator admission; ordinary default denial; protected policy-control-plane denial; disabled, enabled, deleted, and recreated grants; stale delegated-token re-admission/denial after committed changes; and canonical action specificity.
- `ATP-ADM-SCP-01`: `all`, `customDepartments`, `ownDepartment`, `ownDepartmentAndDescendants`, and `mine`; restricted-scope union and `all` dominance; Department mapping and disabled/unmapped behavior; and structural caller-filter AND composition.
- `ATP-ADM-SCP-02`: trusted Student and Record ownership stamping; forged ownership/instance resistance; inherited Student action keys; Record Student preflight and copied ownership; Student empty, duplicate, missing, foreign, and mixed bulk-target preflight; Record mixed-scope bulk rejection; and successful scoped bulk deletion.

The bulk commands transmit `TableIdentity` values as strings, matching the runtime `bigint` API transformation. The verified Student and Record controller preflights query the selected rows rather than using type-sensitive `mget(...)` ordering, so runtime numeric SQLite identities and parsed string command identities do not cause false not-found responses.

## Scope boundary

This is retained direct external API evidence for the three named Phase 80 matrices. It does not establish PostgreSQL bulk-contention behavior, resolve the existing runtime-Swagger regeneration-output drift, make repository-wide lint or format clean, close `WBS-ADM-80-05`, or start/close Phase 70.

## Retained implementation and acceptance artifacts

- [API-only matrix specification](../../../../../repo-e2e/specs/cabloy-admin-rbac-api.spec.ts)
- [External HTTP fixture helpers](../../../../../repo-e2e/specs/helpers/cabloy-admin-api.ts)
- [Student bulk preflight controller](../../../../../vona/src/suite/a-training/modules/training-student/src/controller/student.ts)
- [Record bulk preflight controller](../../../../../vona/src/suite/a-training/modules/training-record/src/controller/record.ts)
