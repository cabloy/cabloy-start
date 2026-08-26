# ATP-ADM-SCP-02 — Student and Record controller scope enforcement

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-SCP-02` |
| PRD | `PRD-ADM-SCP-01`, `PRD-ADM-SCP-02` |
| SRS | `SRS-ADM-SCP-01`–`SRS-ADM-SCP-08` |
| WBS | `WBS-ADM-80-03` |
| Tested source revision | working tree based on `2137752` with the ATP traceability-label correction |
| Database client | managed clean `better-sqlite3` Vona test databases |
| Zova flavor | `normal` Vona test flavor |
| Executor date | 2026-08-21 |

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

## Verification boundary

This record is retained evidence for the local implementation slice, not a final `verified` claim for `WBS-ADM-80-03`. The run used managed SQLite (`better-sqlite3`) and does not establish PostgreSQL-specific contention or transaction behavior or direct external HTTP API evidence. The Role-detail policy-editor slice is retained separately in `ATP-ADM-POL-03`; post-projection Resource rendering and complete SSR/browser closure remain open under `WBS-ADM-80-03`, `WBS-ADM-80-04`, and `WBS-ADM-80-05`.

No schema, `meta.version.ts`, environment configuration, or port configuration changed for this acceptance run.

## Retained evidence

- [Student data-scope regression](../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)
- [Student API regression](../../../../vona/src/suite/a-training/modules/training-student/test/student.test.ts)
- [Record data-scope regression](../../../../vona/src/suite/a-training/modules/training-record/test/dataScope.test.ts)
- [Record API regression](../../../../vona/src/suite/a-training/modules/training-record/test/record.test.ts)
