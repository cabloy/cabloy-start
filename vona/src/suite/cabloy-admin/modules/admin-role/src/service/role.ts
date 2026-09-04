import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { EntityRole, ModelRole } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';
import { roleSiteIdAll } from 'vona-module-a-openapiutils';

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
    titleLocales: role.titleLocales,
    siteIds: role.siteIds,
    builtin: role.builtin,
  };
}

@Service()
export class ServiceRole extends BeanBase {
  async select(params?: IQueryParams<ModelRole>): Promise<DtoRoleSelectRes> {
    return await this.selectRoles(params);
  }

  async selectMembershipCandidates(params?: IQueryParams<ModelRole>): Promise<DtoRoleSelectRes> {
    return await this.selectRoles(params, new Set(['systemAdmin']));
  }

  async view(id: TableIdentity): Promise<DtoRoleView | undefined> {
    const role = await this.$scope.homeUser.model.role.getById(id);
    if (!role) return undefined;
    return toRoleItem(role) as DtoRoleView;
  }

  @Core.transaction()
  async create(role: DtoRoleCreate): Promise<DtoRoleView> {
    return await this.$scope.redlock.service.redlock.lock(
      `admin-role.role.name.${role.name.toLowerCase()}`,
      async () => {
        this.validateSiteIds(role.siteIds);
        const existing = await this.$scope.homeUser.model.role.getForUpdate({
          name: { _eqI_: role.name },
        });
        if (existing) this.scope.error.RoleNameAlreadyInUse.throw();
        return toRoleItem(
          await this.$scope.homeUser.model.role.insert({ ...role, builtin: false }),
        ) as DtoRoleView;
      },
    );
  }

  @Core.transaction()
  async update(id: TableIdentity, patch: DtoRoleUpdate): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(id);
    if (!role) this.app.throw(404, 'Role not found');
    const builtin = role.builtin === true;
    if (builtin) {
      this.ensureBuiltinRolePatch(role, patch);
    }
    if (patch.siteIds) this.validateSiteIds(patch.siteIds);
    const updatePatch = patch;
    await this.$scope.homeUser.model.role.updateById(role.id, updatePatch);
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(id);
    if (!role) this.app.throw(404, 'Role not found');
    this.ensureMutableRoleDefinition(role);
    const memberships = await this.$scope.homeUser.model.roleUser.select({
      where: { roleId: role.id },
    });
    if (memberships.length) {
      await this.$scope.homeUser.model.roleUser.deleteBulk(memberships.map(item => item.id));
    }
    await this.$scope.homeUser.model.role.deleteById(role.id);
    await this.app.scope('a-rbac').event.policyInvalidated.emit({
      kind: 'role',
      removedRoleIds: [String(role.id)],
    });
  }

  @Core.transaction()
  async replaceUserRoles(userId: TableIdentity, command: DtoUserRoleReplace): Promise<void> {
    const user = await this.$scope.homeUser.model.user.getByIdForUpdate(userId);
    if (!user) this.app.throw(404, 'User not found');

    const requestedRoleIds = this.uniqueRoleIds(command.roleIds);
    const systemAdminRole = await this.getLockedSystemAdminRole();
    const systemAdminRoleId = String(systemAdminRole.id);
    if (requestedRoleIds.some(id => String(id) === systemAdminRoleId)) {
      this.scope.error.BuiltinRoleProtected.throw();
    }

    const requestedRoles = await this.lockRoles(requestedRoleIds);
    for (const role of requestedRoles.values()) {
      if (this.isProtectedMembershipRole(role.name)) {
        this.scope.error.BuiltinRoleProtected.throw();
      }
    }
    if (requestedRoles.size !== requestedRoleIds.length) {
      this.scope.error.InvalidRoleMembership.throw();
    }
    await this.bean.role.replaceUserRoleIds(user.id, requestedRoleIds, {
      preserveRoleIds: [systemAdminRole.id],
    });
  }

  private async selectRoles(
    params: IQueryParams<ModelRole> | undefined,
    excludedRoleNames?: Set<string>,
  ): Promise<DtoRoleSelectRes> {
    const where = excludedRoleNames
      ? {
          _and_: {
            _and_: params?.where ?? {},
            name: { _notIn_: [...excludedRoleNames] },
          },
        }
      : params?.where;
    const result = await this.$scope.homeUser.model.role.selectAndCount({ ...params, where });
    return { ...result, list: result.list.map(toRoleItem) as DtoRoleSelectRes['list'] };
  }

  private async getLockedSystemAdminRole(): Promise<EntityRole> {
    const role = await this.$scope.homeUser.model.role.getForUpdate({ name: 'systemAdmin' });
    if (!role) {
      this.scope.error.ProtectedCommandInvalid.throw();
      throw new Error('system administrator role is unavailable');
    }
    return role;
  }

  private isProtectedMembershipRole(name: string): boolean {
    return name === 'systemAdmin';
  }

  private ensureMutableRoleDefinition(role: EntityRole): void {
    if (role.builtin === true) {
      this.scope.error.BuiltinRoleProtected.throw();
    }
  }

  private ensureBuiltinRolePatch(role: EntityRole, patch: DtoRoleUpdate): void {
    if (patch.name !== undefined && patch.name !== role.name) {
      this.scope.error.BuiltinRoleProtected.throw();
    }
  }

  getUnavailableSiteIds(siteIds: string[]): string[] {
    if (this.hasRoleSiteIdAll(siteIds)) return [];
    const availableSiteIds = new Set(
      this.bean.onion.ssrSite
        .getOnionsEnabled(this.ctx.instanceName ?? undefined)
        .map(item => (item.beanOptions.options as { siteId: string }).siteId),
    );
    return siteIds.filter(siteId => !availableSiteIds.has(siteId));
  }

  isRoleSiteIdsAllOnly(siteIds: string[]): boolean {
    return siteIds.length === 1 && siteIds[0] === roleSiteIdAll;
  }

  private hasRoleSiteIdAll(siteIds: string[]): boolean {
    return siteIds.includes(roleSiteIdAll);
  }

  private validateSiteIds(siteIds: string[]): void {
    if (this.hasRoleSiteIdAll(siteIds) && !this.isRoleSiteIdsAllOnly(siteIds)) {
      this.app.throw(422, this.scope.locale.SiteIdsAllExclusive());
    }
    const unavailableSiteIds = this.getUnavailableSiteIds(siteIds);
    if (unavailableSiteIds.length) {
      this.app.throw(
        422,
        this.scope.locale.SiteIdsUnavailable_(
          unavailableSiteIds.map(siteId => JSON.stringify(siteId)).join(', '),
          unavailableSiteIds.length,
        ),
      );
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
