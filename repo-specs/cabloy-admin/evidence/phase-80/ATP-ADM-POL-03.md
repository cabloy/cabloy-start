# ATP-ADM-POL-03 — Start Admin policy-editor entry and authority-separation slice

## Traceability

| Field                  | Value                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-POL-03`                                                                                                             |
| PRD                    | `PRD-ADM-POL-01`, `PRD-ADM-SCP-04`                                                                                           |
| SRS                    | `SRS-ADM-POL-09`, `SRS-ADM-SCP-09`                                                                                           |
| WBS                    | `WBS-ADM-80-04`                                                                                                              |
| Tested source revision | working tree based on `2137752` with the Role-detail tabs and policy-editor changes                                          |
| Database client        | managed clean `better-sqlite3` Vona test database for focused controller tests; Start Admin managed runtime for browser test |
| Zova flavor            | Start Admin                                                                                                                  |
| Executor date          | 2026-08-22                                                                                                                   |

## Procedure

Focused server-side authority checks:

```bash
npm run vona -- :bin:test -- \
  src/suite/a-training/modules/training-student/test/dataScope.test.ts \
  src/suite/a-training/modules/training-record/test/dataScope.test.ts \
  --flavor=normal
```

Observed result:

```text
tests 4
pass 4
fail 0
skipped 0
```

Focused Start Admin browser check:

```bash
npm run test:e2e cabloy-admin -- --grep 'ATP-ADM-POL-03'
```

The one-test result below was captured before the unified runner and flat spec layout. The command above is the current rerun equivalent.

Observed result:

```text
1 passed
```

## Coverage

The Role-detail browser scenario verifies:

- the Role list has no `Resource Permissions` table-cell action;
- a persisted Role detail renders a `Role` tab and a `Resource Permissions` second tab;
- the raw Role-detail document contains the server-rendered marker and does not contain the hydration marker before client hydration;
- the hydrated page exposes the same tabs and role fields;
- the policy editor creates a grant with only `roleId`, `actionKey`, `dataScope`, and `enabled` in the request body;
- a fresh server-side role-configuration read reports the enabled scope; and
- a second Role remains isolated from the first Role's grant.

The focused Student/Record controller checks additionally submit forged capability-shaped body values:

```json
{
  "capability": {
    "key": "training-record.controller.record#update",
    "allowed": true
  }
}
```

and the equivalent Student-create value. Callers without the required current server-side policy receive `403`; the forged browser-shaped value does not authorize the request. Each action context uses its own `mockCtx(...)` boundary, and the existing tests clean up all test-owned durable resources in reverse dependency order.

## Expected and observed result

**Implementation-complete for this retained slice; local acceptance pass.** The policy-editor entry, raw SSR marker check, hydrated UI check, Role isolation, narrow grant body, fresh configuration readback, and representative forged-capability denial all passed.

## Verification boundary

This record does not claim full `ATP-ADM-POL-03` or Phase 80 verification. Subsequent source revisions `568becf`, `c46e48a`, and `b743415` add a browser-safe RBAC action projection, focused frontend matcher coverage, Start table row-data handoff, and persisted page-entry/form-data handoff; those changes are outside this retained execution record and were not exercised by the browser procedure above. Generic Start list-row and page-entry/detail-toolbar paths are the current matcher consumers. Nested Start Details action rows and bulk renderers are intentionally outside this increment because details are normally embedded in the primary form; their lack of matcher consumption is not a coverage gap. This record also does not establish PostgreSQL contention/transaction proof, a direct external HTTP session for a delegated browser caller, a stale-projection direct API scenario, or complete SSR-to-hydration DOM equivalence beyond the server marker/hydration-marker boundary checked here. Those remain open under `WBS-ADM-80-04` and `WBS-ADM-80-05`.

No schema, `meta.version.ts`, environment configuration, or port configuration changed for these checks.

## Retained evidence

- [Role-detail policy-editor E2E](../../../../repo-e2e/specs/cabloy-admin.spec.ts)
- [Student data-scope regression](../../../../vona/src/suite/a-training/modules/training-student/test/dataScope.test.ts)
- [Record data-scope regression](../../../../vona/src/suite/a-training/modules/training-record/test/dataScope.test.ts)
- [Opaque capability contract regression](../../../../vona/src/suite-vendor/a-cabloy/modules/a-rbac/test/rbacCatalogGuard.test.ts)

## Waiver

None.
