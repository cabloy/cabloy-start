# Redacted retained Phase 30 tenant-isolation acceptance summary

## Executed check

```bash
npm run vona :bin:test -- \
  admin-user/test/user.test.ts \
  admin-role/test/role.test.ts \
  admin-role/test/systemAdminProtection.test.ts \
  admin-department/test/department.test.ts \
  admin-department/test/departmentMembership.test.ts \
  --flavor=normal
```

## Observed result

```text
tests 27
suites 6
pass 25
fail 0
cancelled 0
skipped 2
todo 0
duration_ms 3123.862375
```

The skipped scenarios are existing PostgreSQL-only contention proofs. This managed SQLite API/integration run does not exercise those database-specific locking cases.

## Covered facts

- Separate active-instance request contexts leave foreign User, ordinary Role, Department forest, membership, primary, manager, protected audit, and durable session-eviction identities absent.
- Foreign account and role mutation commands do not change source-instance values or create target-instance relationships.
- Foreign Department parent and membership inputs cannot form cross-instance tree or membership edges; primary and manager commands cannot cross the active-instance boundary.
- A rejected protected command against a foreign target records only a local sanitized rejection: no foreign target association, no foreign state snapshot, and no eviction work. Scoped audit and recovery paths cannot act on the source-instance accepted audit or eviction.

No credentials, proof strings, tokens, cookies, fixture identities, database identities, or sensitive payloads are retained in this record.
