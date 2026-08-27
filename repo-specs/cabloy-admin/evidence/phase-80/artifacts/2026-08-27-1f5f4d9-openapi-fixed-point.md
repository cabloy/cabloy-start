# Phase 80 Four-Module OpenAPI Fixed Point

- **Tested revision:** `1f5f4d909d3a67bf9f883dd7470984bb6058fce3` (`feat: admin`)
- **Executor date:** 2026-08-27
- **Swagger producer:** Start worktree Vona runtime at `/Volumes/my-data/cabloy-multirepo/cabloy-start/.claude/worktrees/admin/vona`, PID `45503`, listening on `127.0.0.1:7103`.
- **Source URL:** `http://127.0.0.1:7103/swagger/json?version=V31`
- **Captured source:** 611001 bytes; SHA-256 `21ac3e5c262b5259e90fddf5e6eee2f7c3e8bc21e1d9fac8700ee02f17bf9bb1`; 83 paths, 104 operations, and 125 component schemas.

## Classification

The four Admin module `operations.match` rules correctly restrict the module-owned generated API classes. They do not filter the shared OpenAPI type or schema documents. The generator caches one complete AST for the source URL, writes that complete document to every selected module's `src/api/openapi/types.ts` and `schemas.ts`, and only then applies the operation matcher while generating `src/api/*.ts` classes.

The broad first-pass type/schema changes therefore normalize stale copies generated at different historical runtime snapshots. They are expected forward-contract changes, not generated-file hand edits, source nondeterminism, or matcher leakage. The current snapshot adds the current application contract—including the Admin RBAC and later Home User operations—and removes runtime operations no longer emitted by the captured source. The module-owned `AdminUser_*`, `AdminRole_*`, `AdminDepartment_*`, and `AdminRbacRbac(Grant|GrantDepartment|Policy)_*` consumer classes remain constrained by their respective module filters.

## Reproducible generation

```bash
npm run vona :tools:metadata admin-user admin-rbac admin-role admin-department
npm run zova :tools:metadata admin-user admin-rbac admin-role admin-department
API_BASE_URL=http://127.0.0.1:7103 \
  npm run zova :openapi:generate admin-user admin-rbac admin-role admin-department
```

The first classified normalization updated the four full-document copies and generated metadata. The normalized full-document output converged to these shared hashes:

```text
4250e03e7496c7b19e55ce01a7fe9459af982f464bf5965072b7397822983261  */src/api/openapi/types.ts
e15a5bbcb02ac727f60b15d13a03ad1099aea610fa6eba806e105a4b082c56b0  */src/api/openapi/schemas.ts
```

The identical OpenAPI-generation command was repeated twice while the Swagger endpoint retained the same raw SHA-256. Before the final repeat, SHA-256 inventories of every generated `src/api/**` and `src/apiSchema/**` file across all four modules were recorded. The inventory after the repeat was byte-identical (`diff -u` produced no output). The complete Vona metadata → Zova metadata → OpenAPI-generation sequence was then repeated, and an inventory including all four Vona and Zova `.metadata/**` directories was likewise byte-identical. Together these checks establish the generated fixed point.

## Reverse-chain verification

```bash
npm run build:zova:admin
npm run deps:vona
npm run deps:zova
npm run tsc
```

All commands passed. `build:zova:admin` built both the Start Admin SSR and REST artifacts before dependency handoff. `deps:vona` reported an already-current lockfile, and the root typecheck passed for Zova and every Vona project and suite, including `cabloy-admin`.

## Quality disposition

`git diff --check` passed. Repository-wide lint and format gates remain non-clean due to previously classified unrelated baseline findings; no waiver is recorded. This evidence resolves the OpenAPI fixed-point blocker only and does not mark Phase 80 or release closure as verified.
