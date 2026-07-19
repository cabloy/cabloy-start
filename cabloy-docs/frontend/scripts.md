# Frontend Scripts

This guide explains the main Zova script workflows in the Cabloy monorepo.

## Shared rule

Zova can build `SSR`, `SPA`, `Web`, and `Admin` modes in one codebase. In Cabloy, contributors should usually start from the root scripts first, then drop into `zova/package.json` only when they need edition-specific detail.

## Detect the edition first

Before choosing script examples, detect whether you are working in Cabloy Basic or Cabloy Start.

A practical rule is:

1. detect the edition first
2. then choose the correct script, flavor, and appMode path
3. only then document or automate edition-specific frontend examples

For the edition-detection workflow, also see [Edition Detection](/editions/detection).

## Cabloy Start root wrappers

From this Cabloy Start repository:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
```

These wrappers use the Start-specific `cabloyStartAdmin` and `cabloyStartWeb` flavors. Build one surface only when appropriate:

```bash
npm run build:zova:admin
npm run build:zova:web
```

## Start SSR browser acceptance

The default Start Web and Admin sites have browser smoke commands that exercise Vona SSR dispatch at `7102`, not a standalone Zova development-server port.

Prepare current artifacts explicitly when the relevant frontend SSR output changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:start:clean
```

The managed clean command resets Vona-managed test data and the local Redis namespace, starts one development Vona worker, and runs the complete suite. Browser commands consume already-built SSR and REST artifacts; they do not rebuild them.

```text
test:e2e:start          complete suite
test:e2e:start:web      all @web surface scenarios
test:e2e:start:admin    all @admin surface scenarios
test:e2e:start:clean    managed clean local suite run
```

Use Playwright tags after npm's argument delimiter for scenario selection instead of adding one root script per scenario:

```bash
npm run test:e2e:start:clean -- --grep @web
npm run test:e2e:start -- --grep ATP-START-FLOW-01
```

For the managed-runner argument boundaries and externally managed-target examples, see [Repo Scripts](/reference/repo-scripts#ssr-browser-checks). For a separately managed Start target, set `START_E2E_BASE_URL`; the caller owns external-target data, cache, and artifact freshness.

## Zova script model

The underlying Zova package still organizes scripts around app mode and flavor.

Examples from the current source include:

- `dev:ssr:admin`
- `build:ssr:admin`
- `preview:ssr:admin`
- `dev:ssr:web`
- `build:ssr:web`
- `preview:ssr:web`
- `dev:ssr:cabloyStartAdmin`
- `build:ssr:cabloyStartAdmin`
- `build:rest:cabloyStartAdmin`
- `dev:ssr:cabloyStartWeb`
- `build:ssr:cabloyStartWeb`
- `build:rest:cabloyStartWeb`

## Cabloy Start

This private commercial repository uses Start-specific flavors:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Representative Zova commands are:

```bash
cd zova && npm run dev:ssr:cabloyStartAdmin
cd zova && npm run build:ssr:cabloyStartAdmin
cd zova && npm run build:rest:cabloyStartAdmin
```

## Workflow guidance

When documenting or automating frontend scripts:

- start from root wrappers for normal Cabloy Basic workflows
- detect the edition before choosing flavor-specific examples
- verify the exact flavor before writing edition-specific examples
- use REST/type generation commands deliberately when backend integration depends on them
- understand the mode/appMode/flavor model before changing script families; see [Environment and Config Guide](/frontend/environment-config-guide)
- enable or package frontend mock support deliberately when development depends on fake-server behavior; see [Mock Guide](/frontend/mock-guide)
- use [Frontend Quickstart](/frontend/quickstart) when the reader first needs the end-to-end onboarding story rather than only a script reference
