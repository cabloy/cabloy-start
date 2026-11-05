# cabloy-admin

`cabloy-admin` is the independently commercially licensed System Management suite for Cabloy Start. It provides account administration, roles, Departments, RBAC policy management, and role-menu configuration within the active Vona instance.

This README is the documentation entry point for the entire fullstack suite:

- Backend: `vona/src/suite/cabloy-admin/`
- Frontend: `zova/src/suite/cabloy-admin/`

Both paths are relative to the Cabloy Start repository root. The frontend integrates with Cabloy Start's Vuetify UI and Admin site; it is not a UI-neutral or cross-edition distribution.

## Modules and guides

| Module             | Responsibility                                                                         | Guide                                                  |
| ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `admin-user`       | Account inspection, profile maintenance, activation, and account status                | [User Management](docs/user-management.md)             |
| `admin-role`       | Roles, site admission, user-role memberships, and the authorization editor entry point | [Role Management](docs/role-management.md)             |
| `admin-department` | Department hierarchy, memberships, and manager relationships                           | [Department Management](docs/department-management.md) |
| `admin-rbac`       | Role grants, Department/user scopes, and policy freshness                              | [RBAC Authorization](docs/rbac-authorization.md)       |
| `admin-menu`       | Role-menu associations and navigation freshness                                        | [Menu Authorization](docs/menu-authorization.md)       |

Each module has backend and frontend implementations. Start with User Management for account operations, Role Management for access configuration, or Department Management for organizational structure.

## Framework and suite boundaries

The suite supplies administrative workflows and concrete role/Department policy. Shared authentication, Passport, RBAC runtime contracts, SSR menus, and Resource infrastructure remain framework capabilities:

- [Auth Guide](https://cabloy.com/backend/auth-guide)
- [User Access Guide](https://cabloy.com/backend/user-access-guide)
- [Shared RBAC Architecture](https://cabloy.com/backend/shared-rbac-architecture)
- [Menu Guide](https://cabloy.com/backend/menu-guide)
- [Model Resource Owner Pattern](https://cabloy.com/frontend/model-resource-owner-pattern)

Site admission, menu disclosure, backend action authorization, and data scope are separate boundaries. A visible menu or action never substitutes for backend authorization. All administration stays within the active instance; Departments are not tenant boundaries.

This documentation describes the suite included in the current Start checkout. It does not introduce optional installation, change runtime module detection, or define an installation/upgrade distribution mechanism.

## License

See [LICENSE](LICENSE) for the independent commercial license covering this directory, including its source code, documentation, and assets. The applicable rights and conditions are defined by a separate commercial license agreement with the rights holder.
