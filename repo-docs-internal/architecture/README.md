# Architecture Notes

This directory contains Start-specific maintainer notes about durable technical behavior and boundaries.

## Good candidates

- subsystem and cross-package execution flows;
- internal framework and module patterns;
- state, caching, transaction, and lifecycle invariants;
- boundaries between backend contracts, generated consumers, and frontend resources;
- technical constraints that are easy to break during refactoring.

Use current Start source and tests as evidence. Mark claims as observed source behavior, verified test behavior, recommendation, or historical decision as appropriate.

## What belongs elsewhere

- Put reusable user-facing and agent-facing procedures in [`repo-docs/`](../../repo-docs/).
- Put product and business planning records in [`repo-specs/`](../../repo-specs/).
- Put concise AI operating rules in [`CLAUDE.md`](../../CLAUDE.md) and reusable procedures in [`.claude/skills/`](../../.claude/skills/).
- Put temporary investigation notes in the relevant task or change record rather than creating a permanent architecture note.

Internal architecture notes supplement the portable workflow. They must not become required inputs for ordinary implementation or verification.

## Writing questions

Before adding or updating a note, ask:

1. What subsystem or boundary does this explain?
2. Which invariants and assumptions must future changes preserve?
3. What accidental breakage does the note help prevent?
4. Which Start source paths and tests should a maintainer trace first?
5. Which claims are proven here, and which remain recommendations or open questions?

## Current notes

- [Backend Resource Field Update Workflow](./backend-resource-field-workflow.md)
- [Vona Cross-Model Query-Cache Dependencies](./vona-cross-model-query-cache-dependencies.md)
