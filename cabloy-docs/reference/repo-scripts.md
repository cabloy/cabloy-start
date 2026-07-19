# Repo Scripts

Use this page as a compact lookup surface for the shared root scripts exposed by this Cabloy Start monorepo.

For the broader Reference landing page, see [Reference Introduction](/reference/introduction).

The root `package.json` is the first reference point for shared monorepo workflows.

## Current shared entrypoints in Cabloy Start

- `npm run init`
- `npm run upgrade`
- `npm run upgrade:dry-run`
- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run dev:one`
- `npm run dev:zova:admin`
- `npm run dev:zova:web`
- `npm run build`
- `npm run build:zova`
- `npm run build:zova:admin`
- `npm run build:zova:web`
- `npm run start`
- `npm run test`
- `npm run test:e2e:start`
- `npm run test:e2e:start:web`
- `npm run test:e2e:start:admin`
- `npm run test:e2e:start:clean`
- `npm run tsc`

## Upgrade

Run `npm run upgrade:dry-run` before `npm run upgrade` to inspect framework files and root manifest entries that an upgrade would synchronize. The Start E2E baseline is currently repository-local: `npm run upgrade` does not fetch, synchronize, or repair `e2e/config/`, `e2e/scripts/`, or `e2e/specs/a-start/`. Keep project browser tests outside those paths, for example under `e2e/specs/my-project/`.

## SSR browser checks

The Start E2E family uses the following command structure:

- `test:e2e:start` runs every browser scenario.
- `test:e2e:start:web` and `test:e2e:start:admin` select the `@web` and `@admin` surfaces.
- `test:e2e:start:clean` resets managed local test state, starts one development Vona worker, then runs the suite or a Playwright-filtered subset.

Framework scenarios use a surface tag (`@web` or `@admin`) and the `@smoke` purpose tag. ATP IDs remain in titles for exact evidence and failure reruns.

Pass Playwright options after npm's `--` delimiter:

```bash
# Exact acceptance scenario
npm run test:e2e:start -- --grep ATP-START-FLOW-01

# Category or surface selection
npm run test:e2e:start:clean -- --grep @web
npm run test:e2e:start:clean -- --grep @admin

# Compose tags with a Playwright regular expression
npm run test:e2e:start:clean -- --grep '(?=.*@admin)(?=.*@smoke)'
```

The managed `:clean` runner owns its suite config and local lifecycle. It accepts normal Playwright selection and reporting options, but not `--config` or positional spec paths. Use `--grep` or `--grep-invert` to narrow the run. It requires port `7102` to be available and rejects an external base URL rather than resetting or starting an externally managed target.

The Start suite exercises Web at `/` and Admin at `/admin` through Vona's SSR dispatcher. Prepare fresh Start SSR and REST artifacts explicitly when frontend output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:start:clean
```

For an externally managed Start target, set `START_E2E_BASE_URL` and use aggregate, surface, or forwarded-tag commands. These commands do not reset, start, stop, or rebuild the target:

```bash
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start:admin
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start -- --grep @web
```

Browser commands consume existing SSR and REST artifacts; they never rebuild them. Install Chromium once when needed with `npx playwright install chromium`.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
