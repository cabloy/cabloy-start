# ATP-ADM-POL-04 — Delegated Student Resource projection and stale-policy denial

## Traceability

| Field                  | Value                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-POL-04`                                                                               |
| PRD                    | `PRD-ADM-POL-01`–`PRD-ADM-POL-04`, `PRD-ADM-SCP-01`–`PRD-ADM-SCP-04`                           |
| SRS                    | `SRS-ADM-POL-08`, `SRS-ADM-POL-09`, `SRS-ADM-SCP-09`                                           |
| WBS                    | `WBS-ADM-80-04`, `WBS-ADM-80-05`                                                               |
| Tested source revision | working tree based on `4701888` with the ATP-ADM-POL-04 acceptance and fixture-cleanup changes |
| Database client        | managed clean `better-sqlite3` for normal backend/E2E runs; PostgreSQL for the contention run  |
| Zova flavor            | Start Admin; Vona test flavor `normal`                                                         |
| Executor date          | 2026-08-26                                                                                     |

## Procedure

The PostgreSQL invalidation proof was run against an actual PostgreSQL database:

```bash
DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  --flavor=normal
```

Observed result:

```text
tests 3
pass 3
fail 0
skipped 0
```

The focused normal backend run was:

```bash
npm run vona :bin:test -- \
  src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts \
  src/suite/a-training/modules/training-student/test/dataScope.test.ts \
  src/suite/a-home/modules/home-user/test/passportTest.test.ts \
  --flavor=normal
```

Observed result:

```text
tests 7
pass 6
fail 0
skipped 1
```

The one skipped test is the intentionally PostgreSQL-only contention case; it passed in the PostgreSQL run above.

The paired Admin artifacts and dependency handoff were run before acceptance execution:

```bash
npm run build:zova:admin
npm run deps:vona
npm run deps:zova
npm run tsc
```

All four commands passed. The repository regression run also passed:

```bash
npm run test
```

Observed result: 154 tests, 150 passed, 0 failed, and 4 intentional skips.

Changed-file checks passed:

```bash
npx oxfmt --check \
  e2e/specs/cabloy-admin.spec.ts \
  vona/src/suite/a-home/modules/home-user/src/controller/passportTest.ts \
  vona/src/suite/a-home/modules/home-user/test/passportTest.test.ts \
  vona/src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts
npx oxlint --disable-nested-config \
  e2e/specs/cabloy-admin.spec.ts \
  vona/src/suite/a-home/modules/home-user/src/controller/passportTest.ts \
  vona/src/suite/a-home/modules/home-user/test/passportTest.test.ts \
  vona/src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts
git diff --check
```

The full repository `npm run lint` and `npm run format` checks were also attempted. They remain non-clean because of pre-existing findings in unrelated files across the repository; no unrelated files were reformatted. The changed-file checks above are clean.

## Browser procedure and coverage

The clean focused scenario was:

```bash
npm run test:e2e cabloy-admin -- --grep 'ATP-ADM-POL-04'
```

Observed result: `1 passed`.

The tagged clean Admin suite was:

```bash
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

Observed result: `6 passed`.

`ATP-ADM-POL-04` registers and activates one delegated user and two ordinary Student creators, creates a delegated Role, creator Roles, an allowed Department, a foreign Department, Department memberships, and scoped grants. Students are created in separate ordinary-user sessions so `departmentId` and `userIdOwner` remain server-derived.

The delegated browser directly loads the Student Resource list and both Student `/edit` routes without widening the `systemAdmin`-only Student menu. It verifies:

- both active-instance Student rows are visible through delegated `select` with `all`;
- `Summary` is visible for both rows through delegated `view` with `all`;
- `Force Delete` is visible only for the allowed Department row through delegated `delete` with `customDepartments`;
- persisted edit `Submit` is visible only for the allowed row through delegated `update` with `customDepartments`, while public `Back` remains visible for both rows;
- raw responses contain `data-server-rendered` and do not contain `data-zova-hydrated` before hydration;
- hydrated documents contain `data-zova-hydrated="admin"` and have no unexpected page or console errors; and
- the deliberate stale mutation's expected 403 network console message is the only ignored browser error.

The stale-projection proof is a real wire-level request. After the delegated browser loaded the allowed edit route and displayed `Submit`, the system-admin browser deleted only the delegated `update` grant. Without reloading or re-authenticating the delegated browser, its token sent `PATCH /api/training/student/<allowedStudentId>`. The server returned `403`, and a subsequent system-admin read confirmed that the original Student name remained unchanged.

The PostgreSQL contention case uses the actual `policyInvalidated` event and listener path. Two separate `app.bean.executor.mockCtx(...)` operations are released by an explicit two-party barrier, and a third context verifies that the durable revision increases by exactly two and that post-commit `clearAllCaches` runs exactly twice. The rollback and per-instance isolation cases remain covered in the same test file.

The dev/test-only `removeCurrentFixture` endpoint used by the browser teardown is authenticated, activated-user-only, current-user-scoped, exact-prefix-limited to `e2e-fixture-` accounts, excluded from OpenAPI, and removes auth relations, auth-simple profiles, role memberships, user state, and post-commit token/cache state. It is not a product arbitrary-user deletion API.

## Expected and observed result

**Acceptance pass for the delegated projection, stale-authority, PostgreSQL invalidation, and current contract-loop slice.** The focused browser scenario, tagged Admin suite, targeted normal backend tests, PostgreSQL contention proof, repository regression, paired Admin build/dependency handoff, TypeScript checks, and changed-file lint/format checks passed. No generated consumer or generated artifact was hand-edited.

## Verification boundary

This record closes the evidence added for `ATP-ADM-POL-04` and supports `WBS-ADM-80-04`/`WBS-ADM-80-05`. It does not retroactively replace the earlier implementation-complete boundaries in `ATP-ADM-POL-01`–`ATP-ADM-POL-03` or `ATP-ADM-SCP-01`–`ATP-ADM-SCP-02`. The full repository lint/format commands retain unrelated baseline findings, and the Phase 80 plan remains the authority for any other prior-phase closure gates.

No schema or `meta.version.ts` changed. No environment identity or port configuration changed.

## Retained evidence

- [Delegated Student Resource acceptance](../../../../../e2e/specs/cabloy-admin.spec.ts)
- [Fixture cleanup controller](../../../../../vona/src/suite/a-home/modules/home-user/src/controller/passportTest.ts)
- [Fixture cleanup regression](../../../../../vona/src/suite/a-home/modules/home-user/test/passportTest.test.ts)
- [Policy invalidation and PostgreSQL contention regression](../../../../../vona/src/suite/cabloy-admin/modules/admin-rbac/test/policyInvalidation.test.ts)
- [Student scope regression](../../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)

## Waiver

The repository-wide `npm run lint` and `npm run format` checks report existing unrelated findings. This is recorded as a verification boundary rather than a waiver for changed files; changed-file lint/format checks are clean. No acceptance waiver is requested.
