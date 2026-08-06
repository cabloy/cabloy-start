import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { EntityRole, ModelRole } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoRoleCreate } from '../dto/roleCreate.tsx';
import type { DtoRoleSelectRes } from '../dto/roleSelectRes.tsx';
import type { DtoRoleUpdate } from '../dto/roleUpdate.tsx';
import type { DtoRoleView } from '../dto/roleView.tsx';
import type { DtoUserRoleReplace } from '../dto/userRoleReplace.ts';

function toRoleItem(role: EntityRole) {
  return {
    id: role.id,
    name: role.name,
    title: role.title,
    locales: role.locales,
    siteIds: role.siteIds,
  };
}

@Service()
export class ServiceRole extends BeanBase {
  async select(params?: IQueryParams<ModelRole>): Promise<DtoRoleSelectRes> {
    const result = await this.$scope.homeUser.model.role.selectAndCount({
      ...params,
      where: {
        _and_: {
          _and_: params?.where ?? {},
          name: { _notIn_: [...this.builtinRoleNames] },
        },
      },
    });
    return { ...result, list: result.list.map(toRoleItem) as DtoRoleSelectRes['list'] };
  }

  async view(id: TableIdentity): Promise<DtoRoleView | undefined> {
    const role = await this.$scope.homeUser.model.role.getById(id);
    if (!role || this.isBuiltinRole(role.name)) return undefined;
    return toRoleItem(role) as DtoRoleView;
  }

  @Core.transaction()
  async create(role: DtoRoleCreate): Promise<DtoRoleView> {
    return await this.$scope.redlock.service.redlock.lock(
      `admin-role.role.name.${role.name.toLocaleLowerCase()}`,
      async () => {
        this.ensureOrdinaryRoleName(role.name);
        this.validateSiteIds(role.siteIds);
        const existing = await this.$scope.homeUser.model.role.getForUpdate({
          name: { _eqI_: role.name },
        });
        if (existing) this.scope.error.RoleNameAlreadyInUse.throw();
        return toRoleItem(await this.$scope.homeUser.model.role.insert(role)) as DtoRoleView;
      },
    );
  }

  @Core.transaction()
  async update(id: TableIdentity, patch: DtoRoleUpdate): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(id);
    if (!role) this.app.throw(404, 'Role not found');
    this.ensureOrdinaryRole(role);
    if (patch.siteIds) this.validateSiteIds(patch.siteIds);
    await this.$scope.homeUser.model.role.updateById(role.id, patch);
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(id);
    if (!role) this.app.throw(404, 'Role not found');
    this.ensureOrdinaryRole(role);
    const memberships = await this.$scope.homeUser.model.roleUser.select({
      where: { roleId: role.id },
    });
    if (memberships.length) {
      await this.$scope.homeUser.model.roleUser.deleteBulk(memberships.map(item => item.id));
    }
    await this.$scope.homeUser.model.role.deleteById(role.id);
    await this.bean.permission.clearAllCaches();
  }

  @Core.transaction()
  async replaceUserRoles(userId: TableIdentity, command: DtoUserRoleReplace): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(userId);
    if (!user) this.app.throw(404, 'User not found');

    const requestedRoleIds = this.uniqueRoleIds(command.roleIds);
    const memberships = await this.$scope.homeUser.model.roleUser.select({
      where: { userId: user.id },
    });
    const requestedRoles = await this.lockRoles(requestedRoleIds);
    for (const role of requestedRoles.values()) {
      if (this.isBuiltinRole(role.name)) {
        this.scope.error.BuiltinRoleProtected.throw();
      }
    }
    if (requestedRoles.size !== requestedRoleIds.length) {
      this.scope.error.InvalidRoleMembership.throw();
    }
    const existingRoles = await this.lockRoles(memberships.map(item => item.roleId));
    const rolesById = new Map([...existingRoles, ...requestedRoles]);

    const requestedRoleIdSet = new Set(requestedRoleIds.map(String));
    const obsoleteMembershipIds = memberships
      .filter(item => {
        const role = rolesById.get(String(item.roleId));
        return (
          !role || (!this.isBuiltinRole(role.name) && !requestedRoleIdSet.has(String(item.roleId)))
        );
      })
      .map(item => item.id);
    const currentOrdinaryRoleIds = new Set(
      memberships
        .filter(item => {
          const role = rolesById.get(String(item.roleId));
          return role && !this.isBuiltinRole(role.name);
        })
        .map(item => String(item.roleId)),
    );
    const missingRoleIds = requestedRoleIds.filter(id => !currentOrdinaryRoleIds.has(String(id)));

    if (obsoleteMembershipIds.length) {
      await this.$scope.homeUser.model.roleUser.deleteBulk(obsoleteMembershipIds);
    }
    if (missingRoleIds.length) {
      await this.$scope.homeUser.model.roleUser.insertBulk(
        missingRoleIds.map(roleId => ({ userId: user.id, roleId })),
      );
    }
    if (obsoleteMembershipIds.length || missingRoleIds.length) {
      await this.bean.permission.clearAllCaches();
    }
  }

  private get builtinRoleNames(): Set<string> {
    return new Set(Object.keys(this.$scope.homeUser.config.builtinRoles));
  }

  private isBuiltinRole(name: string): boolean {
    return this.builtinRoleNames.has(name);
  }

  private ensureOrdinaryRoleName(name: string): void {
    if (this.isBuiltinRole(name)) {
      this.scope.error.BuiltinRoleProtected.throw();
    }
  }

  private ensureOrdinaryRole(role: EntityRole): void {
    this.ensureOrdinaryRoleName(role.name);
  }

  private validateSiteIds(siteIds: string[]): void {
    const availableSiteIds = new Set(
      this.bean.onion.ssrSite
        .getOnionsEnabled(this.ctx.instanceName ?? undefined)
        .map(item => (item.beanOptions.options as { siteId: string }).siteId),
    );
    if (siteIds.some(siteId => !availableSiteIds.has(siteId))) {
      this.app.throw(422, 'Role siteIds contain an unavailable site');
    }
  }

  private uniqueRoleIds(roleIds: TableIdentity[]): TableIdentity[] {
    const ids = new Map<string, TableIdentity>();
    for (const id of roleIds) {
      if (ids.has(String(id))) {
        this.scope.error.InvalidRoleMembership.throw();
      }
      ids.set(String(id), id);
    }
    return Array.from(ids.values()).toSorted((a, b) => String(a).localeCompare(String(b)));
  }

  private async lockRoles(roleIds: TableIdentity[]): Promise<Map<string, EntityRole>> {
    const rolesById = new Map<string, EntityRole>();
    for (const roleId of this.uniqueRoleIds(roleIds)) {
      const role = await this.$scope.homeUser.model.role.getByIdForUpdate(roleId);
      if (role) rolesById.set(String(role.id), role);
    }
    return rolesById;
  }
}
