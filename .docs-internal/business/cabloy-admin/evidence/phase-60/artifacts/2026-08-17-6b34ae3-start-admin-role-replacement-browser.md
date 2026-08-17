# Redacted retained command summary

## Executed checks

```bash
npm run build:zova:admin
npm run deps:vona
pnpm --dir vona run tsc -- --pretty false
pnpm --dir vona run vona :bin:test -- --flavor=normal \
  src/suite/cabloy-admin/modules/admin-role/test/role.test.ts \
  src/suite/cabloy-admin/modules/admin-role/test/systemAdminProtection.test.ts \
  src/suite/cabloy-admin/modules/admin-user/test/user.test.ts
npm run test:e2e:start:clean -- --grep 'ATP-ADM-RES-03'
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

## Observed result

```text
Start Admin paired SSR/REST build: pass
Vona dependency synchronization: pass
Post-sync Vona TypeScript check: pass
Focused Role, protected-system-administrator, and User backend tests: 12 passed, 0 failed, 1 skipped
Skipped test: PostgreSQL-only protected-administrator contention proof
Clean focused `ATP-ADM-RES-03` browser run: 1 passed (7.4s)
Clean tagged `@cabloy-admin` browser suite: 4 passed (16.7s)
```

Focused coverage proves:

- User detail exposes all assigned roles and identifies `systemAdmin` through a hidden presentation marker;
- both `registeredUser` and `systemAdmin` definitions remain unavailable to generic Role Resource lifecycle actions;
- the membership selector includes `registeredUser`, excludes `systemAdmin`, and remains server-enforced under a caller filter that requests `systemAdmin`;
- generic replacement can add and remove `registeredUser`, preserves an omitted `systemAdmin`, and rejects a supplied `systemAdmin` before changing membership state;
- the pre-existing fresh-proof protected grant/revoke workflow and final usable system-administrator invariant still pass their focused regression coverage.

## Replacement browser evidence

The source revision changes the rendered ATP procedure from ordinary-role replacement to non-system-administrator membership replacement. The clean focused replacement scenario passed with 1 test in 7.4 seconds, and the clean tagged `@cabloy-admin` suite passed with 4 tests in 16.7 seconds on this exact revision. Earlier browser output remains intentionally excluded as proof for the superseding policy.

No credentials, access tokens, cookies, fixture identities, database names, screenshots, or non-public network payloads are retained in this record.
