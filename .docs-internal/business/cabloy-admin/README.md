# Cabloy Admin Internal Planning

This directory records the agreed phase-one product and architecture baseline for the Cabloy Admin suite in Cabloy Start. It is maintainer-facing planning material, not end-user or agent-facing documentation.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the phase-one product outcomes, users, scope, business rules, and acceptance expectations.
2. [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md) records the accepted suite, ownership, security, and scope-boundary decisions.

The second documentation batch will add the SRS, work breakdown structure, test plan, and delivery progress record after this first baseline has been reviewed.

## Confirmed Phase-One Baseline

| Concern | Decision |
| --- | --- |
| Suite | `cabloy-admin` (`providerId = cabloy`, `suiteName = admin`) |
| Planned modules | `admin-user`, `admin-role`, and `admin-organization` |
| Account scope | Manage all existing accounts through the established identity model rather than duplicate account persistence |
| Role scope | Manage ordinary `homeRole` records and user-role assignments; defer a dynamic permission matrix |
| Organization scope | Support multiple Organizations, each with an independent Department tree |
| Membership | A user may hold multiple Organization/Department memberships; one membership may later be marked primary |
| Position | Store an optional textual `position` on the membership in phase one; defer `admin-position` and `positionId` |
| Department root | Represent a root Department with `parentId = null`, not `0` |
| Department manager | Include a Department manager concept; the manager is expected to be an active Department member |
| Recovery authority | Treat `systemAdmin` as a protected break-glass role and preserve at least one activated `systemAdmin` in the active instance |

## Current Topology

Cabloy Admin is a suite-first, Start-internal business domain. Its planned Vona and Zova modules belong beneath the same suite:

```text
vona/src/suite/cabloy-admin/modules/
zova/src/suite/cabloy-admin/modules/
```

The suite provides management use cases and Admin Resource contracts. It does not replace the existing framework identity, role, authentication, or Passport facts:

- `a-user` supplies the stable `bean.user`, `bean.role`, and `bean.passport` surfaces.
- `home-user` owns the current `homeUser`, `homeRole`, and `homeRoleUser` persistence implementation.
- Cabloy Admin integrates with the existing Start Admin site, SSR menu system, `presetResource` entry, and selector-scoped `rest-resource.model.resource` owner. Phase one does not introduce another Admin SSR site, public path, or flavor.

## Document Authority

- The [PRD](./prd.md) owns product outcomes, personas, scope, business rules, and business acceptance.
- [ADR 0001](./decisions/0001-admin-mvp-boundaries.md) owns accepted phase-one architecture, ownership, and security-boundary decisions.
- This README is an index and baseline summary. It does not redefine either authoritative document.
- The future SRS will own data, authorization, API, transaction, and invariant contracts.
- The future delivery plan will own sequencing and completion checks.
- The future test plan will own executable acceptance scenarios and retained evidence.
- The future progress record will be derived execution status only; it must not redefine requirements or architecture.

If documents disagree, update the authoritative document first, then update downstream summaries and references.

## Related Framework Records

- [Suites and Modules](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [User Access Guide](../../../cabloy-docs/backend/user-access-guide.md)
- [Admin Resource and Web Self-Service](../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md)
- [Contract Loop Playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
