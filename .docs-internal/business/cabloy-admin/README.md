# Cabloy Admin Internal Planning

This directory records the agreed phase-one product and architecture baseline for the Cabloy Admin suite in Cabloy Start. It is maintainer-facing planning material, not end-user or agent-facing documentation.

## Reading Order

1. [Product Requirements Document](./prd.md) defines phase-one product outcomes, users, scope, business rules, and business acceptance.
2. [ADR 0001: Establish Cabloy Admin MVP Boundaries](./decisions/0001-admin-mvp-boundaries.md) records accepted suite, ownership, security, and scope-boundary decisions.
3. [Software Requirements Specification](./srs.md) defines data, authorization, API, transaction, lifecycle, and technical acceptance contracts.
4. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) defines delivery sequencing, dependencies, tasks, and completion checks.
5. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable acceptance scenarios and retained evidence.
6. [Delivery Progress](./progress.md) records derived status, blockers, and evidence pointers only.

## Confirmed Phase-One Baseline

| Concern | Decision |
| --- | --- |
| Suite | `cabloy-admin` (`providerId = cabloy`, `suiteName = admin`) |
| Planned modules | `admin-user`, `admin-role`, and `admin-department` |
| Account scope | Manage all existing accounts through the established identity model rather than duplicate account persistence |
| Role scope | Manage ordinary `homeRole` records and user-role assignments; defer a dynamic permission matrix |
| Department scope | Model one Department forest inside each active Vona instance; the instance remains the tenant boundary |
| Organization boundary | No Organization entity, module, `organizationId`, or Organization-scoped authorization/query rule exists in phase one |
| Membership | A user may hold multiple Department memberships; one membership may later be marked primary |
| Position | Store an optional textual `position` on the membership in phase one; defer `admin-position` and `positionId` |
| Department root | Represent each top-level Department with `parentId = null`, not `0` |
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
- The [SRS](./srs.md) owns data, authorization, API, transaction, lifecycle, invariant, and contract-loop rules.
- The [PDP/WBS](./pdp-wbs.md) owns delivery sequencing, dependencies, tasks, and completion checks.
- The [test plan](./test-plan.md) owns executable acceptance scenarios, verification procedures, and retained evidence.
- [Progress](./progress.md) is derived execution status only; it must not redefine requirements or architecture.
- This README is an index and baseline summary. It does not redefine any authoritative document.

If documents disagree, update the authoritative document first, then update downstream summaries and references.

## Related Framework Records

- [Suites and Modules](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [User Access Guide](../../../cabloy-docs/backend/user-access-guide.md)
- [Admin Resource and Web Self-Service](../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md)
- [Contract Loop Playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
