# ATP-ADM-ROL-01 — Ordinary role lifecycle and membership replacement

## Traceability

| Field                  | Value                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| ATP                    | `ATP-ADM-ROL-01`                                                                                              |
| PRD                    | `PRD-ADM-ROL-01` through `PRD-ADM-ROL-03`                                                                     |
| SRS                    | `SRS-ADM-ROL-01` through `SRS-ADM-ROL-07`; `SRS-ADM-TEN-*`; `SRS-ADM-AUT-*`                                   |
| WBS                    | `WBS-ADM-30-02`                                                                                               |
| Tested source revision | `fde9b0af76f115a10456910a3c1b9f9e19555826` plus uncommitted ordinary-role source, test, and retained evidence |
| Database client        | managed clean `better-sqlite3` Vona test database                                                             |
| Zova flavor            | not applicable — backend API/transaction scenario                                                             |
| Executor date          | 2026-08-18                                                                                                    |

## Procedure and fixture discipline

```bash
npm run vona :bin:test -- \
  admin-role/test/role.test.ts \
  admin-role/test/systemAdminProtection.test.ts \
  --flavor=normal
```

The serialized Role suite creates only randomized test-owned custom Roles and ordinary accounts in the active test instance. It uses `performAction(...)` for API behavior, direct scoped model reads only for durable relation assertions, distinct `mockCtx(...)` contexts for foreign-instance and competing-create checks, and `finally` cleanup in reverse dependency order. The protected-workflow suite separately owns and cleans its protected target, audit, session-eviction, proof-hash, and membership state. This retained record omits credentials, proof strings, tokens, cookies, fixture identities, database identities, and sensitive payloads.

## Expected invariant

Ordinary administration manages the active instance's existing `homeRole` and `homeRoleUser` facts without duplicate persistence. Custom Role names are immutable authorization identities, case-insensitively unique, and transactionally serialized. Generic Role lifecycle never exposes or mutates either configured fixed definition.

The one membership replacement command may reconcile custom Roles and `registeredUser`, but it validates the target and every requested Role in active-instance scope before writes; preserves omitted `systemAdmin`; rejects submitted `systemAdmin`; and leaves no partial relation set on failure. The candidate endpoint returns custom Roles and `registeredUser`, never `systemAdmin`, even under a conflicting caller filter.

## Observed result

Pass. The focused run reported 11 tests across 3 suites: 10 passed, 0 failed, and 1 PostgreSQL-only protected-contention scenario skipped.

- The public Role API proved authenticated/system-administrator admission, custom create/view/update/filter lifecycle, immutable name metadata, active-instance case-insensitive duplicate rejection, and invalid site rejection.
- The generic unfiltered list and fixed-definition view excluded both `registeredUser` and `systemAdmin`. Generic create, update, and delete attempts against either fixed definition were rejected.
- Membership candidates contained the test-owned custom Role and `registeredUser`, omitted `systemAdmin`, and remained empty for a caller filter that requested `systemAdmin`.
- Canonical replacement added and removed `registeredUser`, retained omitted `systemAdmin`, rejected submitted `systemAdmin`, duplicate Role IDs, a missing requested Role, and a missing target account. Durable reads proved rejected replacements did not partially change the existing custom or protected memberships.
- Public deletion of a test-owned custom Role removed its dependent role-membership, and subsequent generic view/list reads found neither the Role nor its relation.
- Separate active-instance contexts kept foreign Role identities absent, and separately scoped competing custom Role creates produced exactly one durable Role and one stable duplicate conflict.
- The protected-workflow regression preserved its distinct fresh-proof, audit, final-administrator, durable eviction/recovery, and active-instance sanitization behavior. Expected rejected-command logs and the PostgreSQL-only skip are asserted scenario behavior, not failures.

## Supporting evidence

- [Redacted focused ordinary-role record](./artifacts/2026-08-18-fde9b0a-phase30-role-focused.md)
- [Ordinary Role API and transaction suite](../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/role.test.ts)
- [Protected-workflow regression suite](../../../../vona/src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts)
- [Direct external authorization matrix](../phase-60/ATP-ADM-AUT-01.md) — retained support for all Role controller caller states; its historical run is not represented as this revision's focused result.
- [Rendered non-system-administrator replacement evidence](../phase-60/ATP-ADM-RES-03.md) — retained Phase 60 Resource/browser support, not rendered generic Role CRUD evidence.

## Remaining gates

This record, together with [ATP-ADM-USR-01](./ATP-ADM-USR-01.md) and [ATP-ADM-TEN-01](./ATP-ADM-TEN-01.md), satisfies the retained Phase 30 API/transaction acceptance evidence for `WBS-ADM-30-01` and `WBS-ADM-30-02`. It does not verify Phase 20, Phase 40, Phase 60, Phase 70, or a release decision.

## Waiver

None.
