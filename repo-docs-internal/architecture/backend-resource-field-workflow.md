# Backend Resource Field Update Workflow

This note records Cabloy Start-specific evidence and maintainer rationale for changing a field on an existing backend resource. The portable execution workflow is authored in the canonical Basic public `repo-docs/backend/resource-field-update.md` guide and the [`cabloy-resource-field-update`](../../.claude/skills/cabloy-resource-field-update/SKILL.md) skill. The public guide arrives in this checkout through the normal Cabloy package upgrade; until the installed `repo-docs/` copy includes it, use the canonical documentation source configured for this checkout rather than creating a divergent Start public-doc copy. This note supplements those instructions; contributors must not need it as a prerequisite for a correct field update.

## Start evidence baseline

The `training-student` resource provides a current Start example of a field crossing persistence, contract, metadata, renderer, and test layers:

- The [`EntityStudent`](../../vona/src/suite/a-training/modules/training-student/src/entity/student.tsx) entity declares `level`, its localized title, ordering, field and cell renderers, and the final constrained `z.union(...)` schema.
- The [`ModelStudent`](../../vona/src/suite/a-training/modules/training-student/src/model/student.ts) model owns the entity and relation projections; no hand-authored DTO field list is needed for the basic entity flow.
- [`meta.version.ts`](../../vona/src/suite/a-training/modules/training-student/src/bean/meta.version.ts) introduces the persisted `level` column in version 1, while the module [`package.json`](../../vona/src/suite/a-training/modules/training-student/package.json) records `fileVersion: 1`.
- [`student.test.ts`](../../vona/src/suite/a-training/modules/training-student/test/student.test.ts) checks emitted layout and DTO metadata, create/select/update/view behavior, level filtering, serialization, and invalid values. Read the complete test before treating any one assertion as the whole resource contract.

This example is evidence of the current Start implementation, not a requirement to reproduce its field or module names in another resource.

## Field truth and versioning

Classify the change before editing:

- a new stored field changes the persistence shape and requires an explicit decision about whether `vonaModule.fileVersion` should advance;
- a validation, title, OpenAPI, locale, or rendering refinement may be metadata-only, but confirm the existing storage shape first.

Ask for the file-version decision before changing `meta.version.ts`, a versioned schema branch, or module package metadata. If a new migration version is chosen, preserve old branches and introduce the column only in the new branch. If the current version is intentionally retained, fold the change into the current version path and do not create migration history. In either strategy, one persisted field must have one schema-introduction path; do not introduce the same column in both an old create path and a later migration.

Update the entity contract first. Let inferred `$Dto.create(...)`, `$Dto.update(...)`, and `$Dto.get(...)` projections follow the entity/model chain unless a deliberate business projection requires otherwise. Use `$makeMetadata(...)` for metadata-only refinements and `$makeSchema(...)` for schema or validation refinements. Do not hand-edit generated frontend consumers.

In the Start `level` example, renderer and validation metadata precede the final structure-defining `z.union([z.literal(1), z.literal(2), z.literal(3)])` argument. Keep structure-shaping schema-like arguments last and verify emitted schema/OpenAPI output after such changes; this ordering is a source-backed example, not a promise that every field has the same shape.

## Start renderer boundary

Resolve renderer keys from the active Start source rather than copying Basic names or behavior.

The shared Start select module provides:

- `start-select:formFieldSelect`, implemented by [`ControllerFormFieldSelect`](../../zova/src/suite/cabloy-start/modules/start-select/src/component/formFieldSelect/controller.tsx);
- `start-select:select`, registered by [`TableCellSelect`](../../zova/src/suite/cabloy-start/modules/start-select/src/bean/tableCell.select.tsx).

The form-field wrapper delegates to Vuetify `VSelect`, maps layout and validation properties, uses item-value/title defaults, and applies a value comparator. Its readonly branch renders a text-like preset through `start-input:formFieldInput`. The table-cell bean resolves the display title from the configured items and can wrap the result with the supplied class. Placeholder and empty-value behavior must be checked against this Start implementation for each UX rather than inferred from Basic's `basic-select` conventions.

The same resource also demonstrates a module-local custom renderer pair:

- [`ControllerFormFieldLevel`](../../zova/src/suite/a-training/modules/training-student/src/component/formFieldLevel/controller.tsx) renders editable values as Vuetify chips and readonly values as a colored `VChip`;
- [`TableCellLevel`](../../zova/src/suite/a-training/modules/training-student/src/bean/tableCell.level.tsx) is registered with `@TableCell(...)` and renders the table value as a colored chip;
- the generated component metadata is visible in [`formFieldLevel.ts`](../../zova/src/suite/a-training/modules/training-student/src/.metadata/component/formFieldLevel.ts).

A plain frontend component does not satisfy a backend `ZovaRender.cell(...)` reference. A custom backend-rendered cell needs a registered `@TableCell(...)` bean and the corresponding frontend resource. Prefer shared renderer reuse and field-level configuration before creating a module-local pair.

## Contract and build handoff

A persisted entity/DTO/OpenAPI change follows the forward chain: backend truth, emitted contract verification, generated frontend consumers, and thin consumer follow-up. A frontend-owned FormField or TableCell resource follows the reverse chain: update frontend source, regenerate metadata when required, run the complete affected Start build, then synchronize Vona dependencies.

The Start root scripts currently expose:

- `npm run zova :tools:metadata <module-name>` through the Zova CLI wrapper;
- `npm run build:zova:admin`, which builds the Start Admin SSR and REST outputs together;
- `npm run build:zova:web` when the Web flavor is affected;
- `npm run deps:vona` for the generated handoff;
- `npm run tsc:zova`, `pnpm --dir vona run tsc`, and `npm run test` for relevant verification.

Do not treat a REST-only build as sufficient: the SSR bundle and REST output must move together. Resolve exact generated paths and affected flavors from the current Start root scripts and source. If generated output is correct but installed Vona consumers remain stale after the normal build and dependency sync, diagnose local dependency drift before hand-editing generated links or types.

## Verification layers

Close the layers that the change touches:

1. **Schema and metadata:** inspect emitted OpenAPI/schema and form/table layout metadata.
2. **Persistence:** verify migration behavior and the selected `fileVersion` strategy.
3. **API behavior:** cover create, select/filter, update persistence, get/view, and delete where relevant.
4. **Validation:** reject values outside a constrained enum-like schema.
5. **Presentation:** update localized titles, enum labels, placeholders, and renderer options.
6. **Generated handoff:** regenerate metadata or consumers and run the complete affected Start SSR-plus-REST build before `deps:vona`.
7. **Lifecycle:** run the repository test path whenever `meta.version.ts` changes so the recreated test database exercises schema consistency.

Test-local persisted resources must be deleted in `finally` with precise identities and reverse dependency order. Keep this note's Start paths and assertions current when the evidence baseline changes.
