# Redacted retained browser acceptance summary

## Executed check

```bash
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

## Observed result

```text
Clean managed database reset: pass
Start Admin SSR runtime startup: pass
Tagged Cabloy Admin browser suite: 4 passed, 0 failed
Duration: 21.7 seconds
```

## Covered scenarios

- `ATP-ADM-SSR-01`: anonymous Admin redirect, server-rendered login, Admin hydration, and approved Resource navigation;
- `ATP-ADM-RES-02`: rendered Department membership, primary, manager, and delete workflows with visible state refresh;
- `ATP-ADM-RES-03`: rendered non-system-administrator role replacement and User Resource refresh;
- `ATP-ADM-RES-01`: rendered account projections and Department Move state refresh.

The managed runtime logged one expected Department lifecycle-conflict response during a negative browser assertion. The scenario completed successfully and the tagged suite reported no failed tests.

No credentials, tokens, cookies, fixture identities, managed database names, screenshots, or request/response payloads are retained in this record.
