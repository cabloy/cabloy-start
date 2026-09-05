# Cabloy Start

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![Documentation](https://img.shields.io/badge/docs-cabloy.com-0ea5e9)](https://cabloy.com)

Cabloy Start is a public, MIT-licensed business-system edition baseline for [Cabloy](https://cabloy.com), a coordinated Node.js fullstack system.

- **Vona** is Cabloy's backend framework and runtime layer.
- **Zova** is Cabloy's frontend framework and application layer.
- Cabloy Start provides the `cabloyStartAdmin` and `cabloyStartWeb` SSR flavors with a Vuetify UI layer.

Cabloy Basic and Cabloy Start share the Cabloy architecture, but intentionally differ in their UI layers, frontend flavors, modules, SSR baselines, and project assets. Create a Cabloy Basic project with `npm create cabloy`; clone this repository to use Cabloy Start.

## Prerequisites

- Git
- Node.js `>=24.4.0`
- pnpm `>=11.5.2`
- Redis `>=7.2.6`
- One documented development database baseline: SQLite, MySQL `>=8`, or PostgreSQL `>=16`

SQLite setups using `better-sqlite3` may require a working native build toolchain for `node-gyp`.

## Get started

```bash
git clone https://github.com/cabloy/cabloy-start.git
cd cabloy-start
npm run init
```

`npm run init` installs dependencies, prepares generated local configuration, initializes the Vona and Zova workspaces, and generates the required frontend and backend artifacts. It is more than a package-install command.

## Common commands

| Purpose                                  | Command                    |
| ---------------------------------------- | -------------------------- |
| Start Vona development                   | `npm run dev`              |
| Start one Vona development process       | `npm run dev:one`          |
| Start Start Admin SSR development        | `npm run dev:zova:admin`   |
| Start Start Web SSR development          | `npm run dev:zova:web`     |
| Build all required artifacts             | `npm run build`            |
| Build Start Admin SSR and REST artifacts | `npm run build:zova:admin` |
| Build Start Web SSR and REST artifacts   | `npm run build:zova:web`   |
| Type-check Vona and Zova                 | `npm run tsc`              |
| Check formatting                         | `npm run format`           |
| Lint                                     | `npm run lint`             |
| Run backend tests                        | `npm run test`             |
| Run the full E2E suite                   | `npm run test:e2e`         |
| Run E2E tests without reset              | `npm run test:e2e:fast`    |

## Upgrade the Cabloy framework baseline

Review framework updates before applying them:

```bash
npm run upgrade:dry-run
npm run upgrade
```

These commands synchronize framework-owned content from the public Cabloy package.

## Support

- Documentation and project information: [cabloy.com](https://cabloy.com)
- Bug reports and public support: [GitHub Issues](https://github.com/cabloy/cabloy-start/issues)

## License

Cabloy Start project-owned source, documentation, and assets are licensed under the [MIT License](./LICENSE), unless a file or directory includes its own complete license or third-party notice. See [LICENSES.md](./LICENSES.md) for license scope and third-party terms.
