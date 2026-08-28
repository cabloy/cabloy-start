# ATP-ADM-MGR-01 — Manager membership lifecycle

## Traceability

| Field           | Value                                      |
| --------------- | ------------------------------------------ |
| ATP             | `ATP-ADM-MGR-01`                           |
| PRD             | `PRD-ADM-MEM-05`                           |
| SRS             | `SRS-ADM-MEM-04`, `SRS-ADM-MEM-05`         |
| WBS             | `WBS-ADM-60-02`, `WBS-ADM-60-03`           |
| Tested revision | `534056c7cf59b4bde6b96abefe01cf462ec91203` |
| Database client | `better-sqlite3`                           |
| Zova flavor     | N/A — backend integration scenario         |
| Executor date   | 2026-08-15                                 |

## Procedure

The focused SQLite/API command in [ATP-ADM-MEM-01](./ATP-ADM-MEM-01.md#procedure) executes `action:departmentMembership:managesPrimaryAndManagerLifecycle`. It assigns an enabled same-Department membership as manager, rejects an ineligible manager relation, and requires explicit manager replacement or clearing before destructive membership lifecycle changes. Test-created records are removed in `finally`.

## Expected and observed result

Pass. The retained run reports the manager lifecycle scenario as passed. It rejected disabled-primary selection, manager assignment outside an enabled same-Department membership, and destructive change to the current manager membership without a same-transaction replacement or clear.

## Retained evidence

- [Focused SQLite/API log](./artifacts/2026-08-15-534056c-phase60-sqlite-focused.log)
- [Focused PostgreSQL membership suite](./artifacts/2026-08-15-534056c-primary-contention-pg.log)

## Waiver

None.
