# Redacted retained Phase 30 ordinary-role acceptance summary

## Executed check

```bash
npm run vona :bin:test -- \
  admin-role/test/role.test.ts \
  admin-role/test/systemAdminProtection.test.ts \
  --flavor=normal
```

## Observed result

```text
tests 11
suites 3
pass 10
fail 0
cancelled 0
skipped 1
todo 0
duration_ms 1608.61175
```

The skipped scenario is the existing PostgreSQL-only protected-administrator contention proof. This managed SQLite API/transaction run does not exercise that database-specific locking case.

## Covered facts

- Custom Role create, view, update, delete, name uniqueness, configured fixed-definition protection, and active-instance absence are exercised through the public API.
- Generic lists hide both fixed definitions; membership candidates include custom Roles and `registeredUser`, but exclude `systemAdmin` even with a conflicting query filter.
- Canonical membership replacement reconciles ordinary Roles, preserves omitted `systemAdmin`, rejects supplied protected, duplicate, missing-Role, and missing-user input before durable partial membership change.
- Successful custom Role deletion removes its owned role-membership relation; separate request contexts prove one durable outcome for competing same-name creates.
- The separate protected-workflow regression remains covered without changing its authority path.

No credentials, proof strings, tokens, cookies, fixture identities, database identities, or sensitive payloads are retained in this record.
