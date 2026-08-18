# Phase 30 Acceptance Evidence Index

This retained evidence set covers Phase 30 — account and ordinary role management. It is not a Phase 70 release decision.

## Evidence set

| ATP                                   | WBS             | Result | Tested revision                                                                                                           | Primary retained artifact                                                                            |
| ------------------------------------- | --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [ATP-ADM-USR-01](./ATP-ADM-USR-01.md) | `WBS-ADM-30-01` | pass   | `26c11a76f85969a071757a02089f03665a45ed9f` plus uncommitted User ATP and retained-evidence updates                        | [Focused User and protected-workflow record](./artifacts/2026-08-18-26c11a7-phase30-user-focused.md) |
| [ATP-ADM-TEN-01](./ATP-ADM-TEN-01.md) | cross-cutting   | pass   | `da25284f7cd41726fc7698d04188b995890a55ac` plus uncommitted tenant-isolation implementation and retained-evidence updates | [Focused tenant-isolation record](./artifacts/2026-08-18-da25284-phase30-tenant-focused.md)          |

## Retention and closure state

- `ATP-ADM-USR-01` records current-revision backend/API proof for User projections, the complete profile allowlist, ordinary lifecycle commands, generic protected-target rejection, direct authorization boundaries, and active-instance absence.
- `ATP-ADM-TEN-01` retains separate-context API/integration proof that foreign User, Role, Department, membership, manager, protected audit, session-eviction, and recovery identities remain absent; its B-local rejected protected audit has no foreign target association or eviction work.
- The generic User account-status route rejects a `systemAdmin` target with `admin-user:1002` / `409` and leaves the target unchanged. Fresh-proof protected lifecycle behavior remains separately owned by the `admin-role` workflow and its Phase 40 evidence.
- Phase 30 and `WBS-ADM-30-01` remain `implementation-complete`: `ATP-ADM-ROL-01` remains required before broader closure can be considered.
- Retained summaries omit credentials, proof strings, tokens, cookies, fixture identities, database identities, and sensitive payloads.
- No waivers are recorded.

The [test plan](../../test-plan.md#evidence-record) defines evidence-record requirements and owns ATP acceptance criteria.
