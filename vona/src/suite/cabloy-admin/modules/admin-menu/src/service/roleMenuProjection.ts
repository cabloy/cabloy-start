import type { TableIdentity } from 'table-identity';
import type { ISsrMenuCatalog } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoRoleMenuCatalogGroup } from '../dto/roleMenuCatalogGroup.ts';
import type { DtoRoleMenuCatalogMenu } from '../dto/roleMenuCatalogMenu.ts';
import type { DtoRoleMenuCatalogRes } from '../dto/roleMenuCatalogRes.ts';
import type { DtoRoleMenuCatalogSite } from '../dto/roleMenuCatalogSite.ts';
import type { DtoRoleMenuRoleConfigurationRes } from '../dto/roleMenuRoleConfigurationRes.ts';
import type { DtoRoleMenuRoleConfigurationSite } from '../dto/roleMenuRoleConfigurationSite.ts';

@Service()
export class ServiceRoleMenuProjection extends BeanBase {
  async catalog(): Promise<DtoRoleMenuCatalogRes> {
    const catalog = this.$scope.ssr.service.ssr.getMenuCatalog();
    return {
      revision: await this.scope.service.menuVisibilityRevision.current(),
      list: this.projectCatalog(catalog),
    };
  }

  async roleConfiguration(roleId: TableIdentity): Promise<DtoRoleMenuRoleConfigurationRes> {
    const role = await this.$scope.homeUser.model.role.getById(roleId);
    if (!role) this.app.throw(422, 'Role menu role is unavailable');

    const catalog = this.$scope.ssr.service.ssr.getMenuCatalog();
    const associations = await this.scope.model.roleMenu.select({
      where: { roleId },
      columns: ['ssrSiteName', 'ssrMenuName'],
    });
    const associatedMenus = new Set(
      associations.map(association =>
        this.menuKey(association.ssrSiteName, association.ssrMenuName),
      ),
    );
    return {
      revision: await this.scope.service.menuVisibilityRevision.current(),
      roleId: role.id,
      list: this.projectRoleConfiguration(catalog, associatedMenus),
    };
  }

  private projectCatalog(catalog: ISsrMenuCatalog): DtoRoleMenuCatalogSite[] {
    return [...catalog.sites]
      .toSorted((left, right) => left.ssrSiteName.localeCompare(right.ssrSiteName))
      .map(site => ({
        ssrSiteName: site.ssrSiteName,
        title: site.title,
        menus: catalog.menus
          .filter(menu => menu.ssrSiteName === site.ssrSiteName)
          .map(menu => this.projectMenu(menu))
          .toSorted((left, right) => left.ssrMenuName.localeCompare(right.ssrMenuName)),
        groups: catalog.groups
          .filter(group => group.ssrSiteName === site.ssrSiteName)
          .map(group => this.projectGroup(group))
          .toSorted((left, right) => left.ssrMenuGroupName.localeCompare(right.ssrMenuGroupName)),
      }));
  }

  private projectRoleConfiguration(
    catalog: ISsrMenuCatalog,
    associatedMenus: ReadonlySet<string>,
  ): DtoRoleMenuRoleConfigurationSite[] {
    return [...catalog.sites]
      .toSorted((left, right) => left.ssrSiteName.localeCompare(right.ssrSiteName))
      .map(site => ({
        ssrSiteName: site.ssrSiteName,
        title: site.title,
        menus: catalog.menus
          .filter(menu => menu.ssrSiteName === site.ssrSiteName)
          .map(menu => ({
            ...this.projectMenu(menu),
            enabled:
              menu.roles !== undefined &&
              associatedMenus.has(this.menuKey(menu.ssrSiteName, menu.ssrMenuName)),
          }))
          .toSorted((left, right) => left.ssrMenuName.localeCompare(right.ssrMenuName)),
        groups: catalog.groups
          .filter(group => group.ssrSiteName === site.ssrSiteName)
          .map(group => this.projectGroup(group))
          .toSorted((left, right) => left.ssrMenuGroupName.localeCompare(right.ssrMenuGroupName)),
      }));
  }

  private menuKey(ssrSiteName: string, ssrMenuName: string): string {
    return JSON.stringify([ssrSiteName, ssrMenuName]);
  }

  private projectMenu(menu: ISsrMenuCatalog['menus'][number]): DtoRoleMenuCatalogMenu {
    const { ssrMenuName, onionName, roles, title, description, icon, order, group, separator } =
      menu;
    return this.withoutUndefined({
      ssrMenuName,
      onionName,
      configurable: roles !== undefined,
      title: this.resolveDisplay(title),
      description: this.resolveDisplay(description),
      icon: this.resolveDisplay(icon),
      order,
      group,
      separator,
    });
  }

  private projectGroup(group: ISsrMenuCatalog['groups'][number]): DtoRoleMenuCatalogGroup {
    const {
      ssrMenuGroupName,
      onionName,
      title,
      description,
      icon,
      order,
      group: parentGroup,
      collapsed,
    } = group;
    return this.withoutUndefined({
      ssrMenuGroupName,
      onionName,
      title: this.resolveDisplay(title),
      description: this.resolveDisplay(description),
      icon: this.resolveDisplay(icon),
      order,
      group: parentGroup,
      collapsed,
    });
  }

  private resolveDisplay(value: unknown): string | undefined {
    if (value === undefined) return;
    try {
      const resolved = this.app.meta.text.locale(this.ctx.locale, value as never)?.trim();
      return resolved || undefined;
    } catch {
      return undefined;
    }
  }

  private withoutUndefined<T extends object>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
  }
}
