## Summary

- User-visible effect:
- Technical effect:

## Related issue

<!-- Link an issue when one exists, or state "None". -->

## Affected areas

<!-- Select or describe: Vona, Zova, Start Admin, Start Web, generated contracts, documentation, or tooling. -->

## Tests and validation

- Tests added or updated, or why none are needed:

| Command | Result | Scope or notes |
| ------- | ------ | -------------- |
|         |        |                |

## Contract and generated artifacts

- Contract-loop path: <!-- Not applicable / forward chain / reverse chain / consumer drift / local dependency drift -->
- Contract source of truth:
- Generated artifacts changed:
- Build and synchronization steps run:

<!--
For a frontend-to-Vona metadata or dependency change, build each affected Start flavor before synchronizing dependencies:

npm run build:zova:admin
# Also run npm run build:zova:web when Web is affected.
npm run deps:vona

Keep SSR and REST outputs aligned; a REST-only build is not sufficient.
-->

## Documentation

- Updated documentation, or why no documentation change is needed:

## Public-content safety

- [ ] This pull request excludes unrelated generated output, build artifacts, cache files, environment files, credentials, tokens, personal data, and sensitive system information.
- [ ] This pull request does not disclose a suspected vulnerability or exploit details in this public tracker.
