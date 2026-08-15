# ATP-ADM-SSR-01 — Start Admin SSR, redirect, and hydration

## Traceability

| Field | Value |
| --- | --- |
| ATP | `ATP-ADM-SSR-01` |
| PRD | `PRD-ADM-UI-01` |
| SRS | `SRS-ADM-UI-03` |
| WBS | `WBS-ADM-60-03` |
| Tested backend revision | `534056c7cf59b4bde6b96abefe01cf462ec91203` |
| Browser-test source | uncommitted [cabloy-admin.spec.ts](../../../../../e2e/specs/cabloy-start/cabloy-admin.spec.ts) |
| Database client | clean `better-sqlite3` E2E database |
| Zova flavor | Start Admin SSR |
| Executor date | 2026-08-15 |

## Procedure

```bash
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

The browser spec uses an anonymous request to load `/admin/` without following redirects, then confirms the private no-store redirect to `/admin/login`. It reads the login response body before hydration, signs in through the rendered captcha form, requires `data-zova-hydrated="admin"`, and navigates the rendered `User`, `Role`, and `Department` menu links. Each resource navigation is followed by an Admin root load, and the test collects browser page errors for the whole scenario.

## Expected and observed result

Pass. The tagged run reports 2 tests passed. The anonymous Admin root returned `302` with `cache-control: private, no-store` and a login location. The raw login response contained the SSR marker and did not present an already-hydrated Admin document. After browser login, the Administration shell rendered, all three approved Resource menu destinations resolved, the document reported Admin hydration, and no browser page errors were recorded.

This record proves redirect, SSR-document, hydration, and approved Resource-navigation behavior. It does not establish direct API authorization outcomes for ordinary versus privileged callers; that distinct acceptance scope remains owned by the applicable API ATP records.

## Retained evidence

- [Start Admin browser record](./artifacts/2026-08-15-603cb4c-start-admin-browser.md)

## Waiver

None.
