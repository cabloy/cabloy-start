# Redacted retained command summary

Command:

```bash
npm run build:zova:admin
npm run deps:vona
npm run test:e2e cabloy-admin -- --tag @cabloy-admin
```

Environment/result:

```text
Start Admin paired SSR/REST build: pass
Vona dependency synchronization: pass
Start Admin clean E2E database reset: pass
Playwright tests: 3 passed (14.0s)
ATP-ADM-SSR-01: pass
ATP-ADM-RES-02: pass
ATP-ADM-RES-01: pass
```

Browser coverage:

- the existing SSR redirect, login, hydration, and approved Resource navigation scenario passes;
- the Department detail page renders the `Add Membership` control, empty membership state, and neutral manager state in the view scene;
- the rendered membership dialog adds the seeded Admin account and then edits its position;
- the rendered primary command sets and clears the membership's primary state;
- the rendered manager command sets and clears the Department manager state, without a generic Department `PATCH` request;
- the manager-membership Delete confirmation is exercised and its current `409` lifecycle rejection is displayed; the test then clears the manager through its rendered command and successfully deletes the membership through its rendered Delete command;
- each successful custom membership command refreshes the visible detail state without a full-page navigation or reload;
- view and edit scenes expose only their intended membership controls;
- a deliberately failed membership query presents its error and Retry restores the rendered empty state; and
- no browser page errors were observed by any tagged scenario.

The acceptance test uses authenticated same-origin fixture APIs only to create and remove isolated Departments. It does not use fixture APIs to perform the membership, primary, or manager actions claimed above. Test-owned records are removed in reverse dependency order in `finally`.

The expected `409` is retained as an observed current-contract behavior, not as a successful implicit manager-clear operation. The rendered Delete request does not deliver its intended manager-clear input under the current generated DELETE client shape; clearing the manager is therefore executed by the separately rendered Manager command before the successful rendered deletion.

No credentials, access tokens, cookies, fixture identities, database names, screenshots, or network payloads are retained in this record.
