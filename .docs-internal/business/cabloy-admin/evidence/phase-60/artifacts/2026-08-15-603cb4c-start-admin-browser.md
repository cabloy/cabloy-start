# Redacted retained command summary

Command:

```bash
npm run test:e2e:start:clean -- --grep @cabloy-admin
```

Environment/result:

```text
Start Admin clean E2E database reset: pass
Playwright tests: 2 passed (10.0s)
ATP-ADM-SSR-01: pass
ATP-ADM-RES-01: pass
```

Browser coverage:

- anonymous `/admin/` responds with a private, no-store redirect to `/admin/login`;
- raw login SSR HTML includes the server-rendered marker and excludes the hydration marker;
- browser login hydrates the Admin site;
- the approved User, Role, and Department Resource menu routes are admitted;
- account detail route `/admin/rest/resource/admin-user%3Auser/1` renders the `Roles` and `Department Memberships` projections;
- test-owned Department roots and a child are created through authenticated same-origin browser fixture requests and removed in reverse dependency order;
- the Department Resource renders the child row and its visible `Move Department` command;
- the rendered modal moves the child to the second test root and the browser observes a successful authenticated `PUT` Department move response;
- without a full-page reload, selecting the original root shows no child row and selecting the destination root shows the moved child row;
- no browser page errors were observed by either tagged test.

This record proves the Department `presetResource` custom Move command uses its existing Resource/tree refresh path. Fixture requests only arrange and remove isolated test data; they are not evidence of a rendered command. This record intentionally does not claim browser execution of membership, primary, manager, role, or membership-query cache-invalidation commands: the current Resource UI does not expose those commands. Their backend and semantic-model behavior is covered by the focused API and PostgreSQL records.

No credentials, access tokens, cookies, fixture identities, screenshots, or network payloads are retained in this record.
