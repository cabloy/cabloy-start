# ATP-ADM-SCP-02 — Student and Record controller scope enforcement

## Traceability

| Field                  | Value                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-SCP-02`                                                                                                                                                      |
| PRD                    | `PRD-ADM-SCP-01`, `PRD-ADM-SCP-02`                                                                                                                                    |
| SRS                    | `SRS-ADM-SCP-01`–`SRS-ADM-SCP-08`                                                                                                                                     |
| WBS                    | `WBS-ADM-80-03`                                                                                                                                                       |
| Tested source revision | historical working tree based on `2137752` with the ATP traceability-label correction; direct matrix working tree based on `b28df501233b4cf540c898ae138122c7b240ee44` |
| Database client        | managed clean `better-sqlite3` Vona test databases; external matrix used the worktree-managed SQLite/`better-sqlite3` Vona development runtime                        |
| Zova flavor            | `normal` Vona test flavor; direct matrix targeted the external Start Vona HTTP API                                                                                    |
| Executor date          | 2026-08-21; direct matrix 2026-08-27                                                                                                                                  |

## Procedure

The focused Controller/API acceptance run was executed from the repository root:

```bash
npm run vona :bin:test -- \
  src/suite/a-training/modules/training-student/test/dataScope.test.ts \
  src/suite/a-training/modules/training-student/test/student.test.ts \
  src/suite/a-training/modules/training-record/test/dataScope.test.ts \
  src/suite/a-training/modules/training-record/test/record.test.ts \
  --flavor=normal
```

Before the run, the session-owned Vona development process was shut down gracefully with `SIGINT` so the isolated test runner could bind its standard listener without changing ports or environment configuration.

## Coverage

The retained focused tests exercise the Controller/action authority boundary for Student and Record resources:

- delegated Student list, view, create, update, summary, delete, force-delete, and IDs-only bulk delete actions are constrained by the request-local RBAC scope;
- Record actions inherit the associated Student scope, reject foreign targets, and retain the same guarded bulk-delete behavior;
- unrestricted adapter-defined system administrators receive normal unrestricted access across Department rows;
- Student and nested Record creates ignore forged ownership and instance input, deriving `departmentId` and `userIdOwner` from trusted scope values;
- callers without a current server-side grant remain denied when they submit forged `{ key, allowed: true }` capability-shaped body data to Student create or a foreign Record update;
- direct Record creation resolves the scoped Student first and copies trusted Student ownership;
- Record updates do not reparent or accept client-controlled ownership;
- caller filters are composed with server scope rather than replacing it; and
- bulk failures for empty, duplicate, missing, foreign, and mixed IDs occur before mutation.

The expected `403` and validation errors emitted by negative cases were asserted outcomes, not test failures.

## Expected and observed result

**Implementation-complete; local acceptance pass.** The run reported:

```text
tests 16
suites 5
pass 16
fail 0
cancelled 0
skipped 0
```

The test title for the Record acceptance case is now aligned with this ATP:

```text
ATP-ADM-SCP-02 scopes Records, inherits Student scope, and protects Subjects
```

## Direct external HTTP/API matrix

On 2026-08-27, the real bearer-token API matrix ran against the worktree-managed external Vona runtime at `http://127.0.0.1:7103`:

```bash
E2E_BASE_URL=http://127.0.0.1:7103 npm run test:e2e:fast cabloy-admin-rbac-api -- --tag @admin-rbac-api
```

The combined API-only run reported `3 passed (6.3s)`. This ATP's direct matrix verifies trusted Student and Record ownership stamping, forged ownership/instance resistance, inherited Student action keys, Record Student preflight and copied ownership, Student empty/duplicate/missing/foreign/mixed bulk preflight, Record mixed-scope rejection, and successful scoped bulk deletion. The test sends identity command values as strings and proves the corrected Student/Record bulk preflights across the runtime's numeric SQLite and string API identity representations. It uses test-owned accounts whose usernames begin with `e2e-fixture-admin-rbac-` and deterministic reverse-order cleanup.

## Verification boundary

The historical local implementation slice and the direct HTTP/API matrix now provide traceable API acceptance for this ATP, but they do not make `WBS-ADM-80-03` or Phase 80 `verified`. The matrix does not establish PostgreSQL-specific bulk contention or transaction behavior. The current runtime-Swagger regeneration output drift remains unclassified, and repository-wide lint and format gates remain non-clean and unwaived. `WBS-ADM-80-05` and Phase 70 remain open.

No schema, `meta.version.ts`, environment configuration, or port configuration changed for this acceptance run.

## Retained evidence

- [Direct external HTTP/API matrix validation](./artifacts/2026-08-27-b28df50-direct-http-api-matrices.md)
- [API-only matrix specification](../../../../repo-e2e/specs/cabloy-admin-rbac-api.spec.ts)
- [External HTTP fixture helpers](../../../../repo-e2e/specs/helpers/cabloy-admin-api.ts)
- [Student bulk preflight controller](../../../../vona/src/suite/a-training/modules/training-student/src/controller/student.ts)
- [Record bulk preflight controller](../../../../vona/src/suite/a-training/modules/training-record/src/controller/record.ts)
- [Student data-scope regression](../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)
- [Student API regression](../../../../vona/src/suite/a-training/modules/training-student/test/student.test.ts)
- [Record data-scope regression](../../../../vona/src/suite/a-training/modules/training-record/test/dataScope.test.ts)
- [Record API regression](../../../../vona/src/suite/a-training/modules/training-record/test/record.test.ts)
