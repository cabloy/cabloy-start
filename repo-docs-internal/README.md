# Internal Engineering Documentation

This directory stores Cabloy Start maintainer documentation for architecture, design rationale, refactor records, and durable engineering decisions.

## Purpose

Use this area for internal technical knowledge that helps maintain the Start edition, including:

- architecture notes;
- design rationale and implementation boundaries;
- refactor and migration records;
- decision history;
- important execution and validation summaries.

This is separate from the public and agent-facing guidance in [`repo-docs/`](../repo-docs/) and from the product and business planning records in [`repo-specs/`](../repo-specs/).

## Documentation boundary

- `repo-docs/` owns reusable user-facing and agent-facing guidance.
- `CLAUDE.md` owns concise repository-wide AI operating rules.
- `.claude/skills/` owns reusable executable workflows.
- `repo-specs/` owns product requirements, technical planning, delivery records, acceptance records, and suite-local decisions.
- `repo-docs-internal/` records Start-local maintainer rationale and evidence.

Internal notes are supporting material, not prerequisites for implementation, scaffolding, contract regeneration, or verification. When a referenced internal note is absent, continue from public documentation, bundled skill references, current source, and tests. Do not copy another edition's history or evidence without checking it against this checkout.

## Organization

### `architecture/`

Use this directory for long-lived technical explanations, cross-package behavior, internal framework patterns, and invariants that future development should preserve. The [architecture index](./architecture/README.md) lists the notes established in this checkout.

### `decisions/`

Use this directory for ADR-style records when a durable Start engineering decision needs to be recorded. Create a decision record only when an actual decision and its alternatives, consequences, and scope have been established.

## Exclusions

Do not use this directory for:

- end-user product documentation;
- external framework tutorials;
- release notes;
- product requirements or suite delivery plans;
- temporary personal scratch notes.

Keep each document's evidence boundary explicit. A source observation, a Start test result, a recommendation, and a historical decision are different kinds of claims and should not be presented interchangeably.
