# Phase 70 Browser and Direct HTTP/API Acceptance

- **Tested candidate base revision:** `3ab574de6435acd59047f2bd5993df867fc92f9e`
- **Execution date:** 2026-08-28
- **Edition / flavor:** Cabloy Start / Start Admin (`cabloyStartAdmin`)
- **Traceability:** `WBS-ADM-70-02`; `ATP-ADM-SSR-01`; `ATP-ADM-RES-01`–`03`; `ATP-ADM-POL-02`–`04`; `ATP-ADM-SCP-01`–`02`
- **Runtime/database:** controlled current-candidate Start Vona development runtime; local SQLite/`better-sqlite3` for the direct HTTP/API matrix
- **Result:** pass

## Clean tagged browser acceptance

The established managed E2E workflow was run after the paired Start Admin artifact build:

```bash
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

This runner reset its managed test state and started its own runtime. Result: **6 passed (33.6s)**.

Covered scenarios:

- `ATP-ADM-SSR-01`: private Start Admin SSR admission, hydration, and approved Resource navigation;
- `ATP-ADM-RES-01`: Start Admin resource projections and Department Resource refresh after Move;
- `ATP-ADM-RES-02`: rendered Department membership actions;
- `ATP-ADM-RES-03`: rendered User non-system-administrator role replacement;
- `ATP-ADM-POL-03`: Role-detail policy-editor isolation;
- `ATP-ADM-POL-04`: delegated Student projection and stale direct mutation denial after grant revocation.

Expected negative-path responses observed by the scenarios were anonymous `401`, revoked delegated Student mutation `403`, and forbidden Department lifecycle with dependents `409`. They were asserted behavior, not test failures.

## Direct external HTTP/API matrix

A separately controlled candidate runtime was started with the standard normal-flavor one-worker command and was stopped after the run. No shared port or environment identity was changed.

```bash
npm run dev:one
E2E_BASE_URL=http://127.0.0.1:7202 \
  npm run test:e2e:fast cabloy-admin-rbac-api -- --tag @admin-rbac-api
```

The fast runner sent real HTTP requests through Playwright `APIRequestContext`; it did not import backend controllers, services, models, `mockCtx(...)`, or `performAction(...)`. Authentication, fresh fixture accounts, bearer handling, and deterministic reverse-order fixture cleanup are owned by the established test helpers. No credential, bearer, cookie, proof, or other secret material is retained in this record.

Observed result: **3 passed (5.9s)**.

| Scenario         | Current-candidate direct API coverage                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ATP-ADM-POL-02` | unrestricted admission, default denial, protected policy-control-plane denial, disabled/enabled/deleted/recreated grants, and invalidation |
| `ATP-ADM-SCP-01` | five scopes, restricted union, `all` dominance, mapped/unmapped Department behavior, and caller-filter composition                         |
| `ATP-ADM-SCP-02` | Student/Record server ownership stamping, forged-input resistance, inherited Record scope, and Student/Record bulk preflight               |

## Boundary

The direct API matrix is bearer-token HTTP acceptance against the controlled SQLite runtime. It is intentionally distinct from the focused PostgreSQL contention proof and from SSR/browser acceptance. The separate Phase 70 quality artifact records the current passing repository format gate.
