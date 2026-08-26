# Redacted retained command summary

Commands:

```bash
API_BASE_URL=http://localhost:7202 npm run zova :openapi:generate admin-department
npm run build:zova:admin
npm run deps:vona
npm run tsc
pnpm --dir vona run vona :bin:test -- --flavor=normal admin-department/test/departmentMembership.test.ts
npm run test:e2e cabloy-admin -- --grep 'ATP-ADM-RES-02'
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

Environment/result:

```text
Scoped Admin Department OpenAPI generation from live Swagger: pass
Start Admin paired SSR/REST build: pass
Vona dependency synchronization: pass
Full Zova and Vona TypeScript check: pass
Focused Department membership test: 5 passed, 0 failed, 1 skipped (PostgreSQL-only contention proof)
Focused Start Admin clean E2E database reset: pass
ATP-ADM-RES-02 browser test: 1 passed (9.8s)
Full Start Admin clean E2E database reset: pass
Playwright tests: 3 passed (12.8s)
ATP-ADM-SSR-01: pass
ATP-ADM-RES-02: pass
ATP-ADM-RES-01: pass
```

Browser coverage:

- the rendered Department detail page creates and edits a membership, sets and clears primary state, and sets and clears manager state through custom endpoints without a generic Department `PATCH`;
- after setting the membership as manager again, one rendered Delete confirmation sends exactly `{ "managerMembershipId": null }` in its real HTTP DELETE request;
- that DELETE returns successfully, atomically clears the visible Department manager, removes the membership row, and leaves the empty-membership state without a navigation or reload;
- no dedicated manager-clear `PUT` occurs for this Delete path;
- each successful custom membership command refreshes the visible detail state without a full-page navigation or reload;
- view and edit scenes expose only their intended membership controls;
- a deliberately failed membership query presents its error and Retry restores the rendered empty state; and
- no browser page errors were observed by any tagged scenario.

The acceptance test uses authenticated same-origin fixture APIs only to create and remove isolated Departments. It does not use fixture APIs to perform the membership, primary, manager, or Delete actions claimed above. Test-owned records are removed in reverse dependency order in `finally`.

The generated client accepts the optional DELETE command body as its first argument and transports it as Axios `config.data`. Vona parses DELETE request bodies by default, allowing the existing transactional Department lifecycle service to perform the clear-and-delete operation atomically.

No credentials, access tokens, cookies, fixture identities, database names, screenshots, or network payloads beyond the non-sensitive asserted command shape are retained in this record.
