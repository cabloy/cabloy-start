# Redacted retained command summary

## Executed check

```bash
npm run vona :bin:test -- \
  admin-user/test/authorization.test.ts \
  admin-role/test/authorization.test.ts \
  admin-department/test/authorization.test.ts \
  --flavor=normal
```

## Observed result

```text
Vona managed test database initialization: pass
Focused direct-API authorization suites: 3 passed, 0 failed, 0 skipped
User authorization matrix: pass
Role authorization matrix: pass
Department authorization matrix: pass
```

## Coverage

Each action was invoked through `performAction(...)` with `innerAccess: false` as four independent callers:

- anonymous caller: `401`;
- registered but unactivated caller: `403`;
- activated ordinary caller without `systemAdmin`: `403`;
- seeded active `systemAdmin`: successful endpoint-specific response.

The suites cover every exposed Phase 1 Cabloy Admin controller action: 5 User actions, 12 Role actions, and 15 Department actions (32 actions and 128 caller/action invocations). Test-owned records are removed in `finally` under fresh scoped request contexts.

No credentials, proof values, tokens, cookies, fixture identities, managed database names, or request/response payloads are retained in this record.
