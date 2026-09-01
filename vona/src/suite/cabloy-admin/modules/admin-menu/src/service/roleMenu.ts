import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoRoleMenuBatch } from '../dto/roleMenuBatch.ts';
import type { EntityRoleMenu } from '../entity/roleMenu.tsx';

export interface IRoleMenuIdentity {
  roleId: TableIdentity;
  ssrSiteName: string;
  ssrMenuName: string;
}

@Service()
export class ServiceRoleMenu extends BeanBase {
  async create(identity: IRoleMenuIdentity): Promise<EntityRoleMenu> {
    const normalized = this.normalizeIdentity(identity);
    return await this.$scope.redlock.service.redlock.lockIsolate(
      this.getRoleLockKey(normalized.roleId),
      async () => await this.createInTransaction(normalized),
    );
  }

  async delete(identity: IRoleMenuIdentity): Promise<void> {
    const normalized = this.normalizeIdentity(identity);
    await this.$scope.redlock.service.redlock.lockIsolate(
      this.getRoleLockKey(normalized.roleId),
      async () => await this.deleteInTransaction(normalized),
    );
  }

  async batch(command: DtoRoleMenuBatch): Promise<void> {
    const { roleId, creates, deletes } = this.normalizeBatch(command);
    await this.$scope.redlock.service.redlock.lockIsolate(
      this.getRoleLockKey(roleId),
      async () => await this.batchInTransaction(roleId, creates, deletes),
    );
  }

  @Core.transaction()
  private async createInTransaction(identity: IRoleMenuIdentity): Promise<EntityRoleMenu> {
    await this.ensureRole(identity.roleId);
    this.requireEligibleMenu(identity);
    const existing = await this.scope.model.roleMenu.getForUpdate(identity);
    if (existing) this.app.throw(409, 'Role menu already exists');
    const roleMenu = await this.scope.model.roleMenu.insert(identity);
    await this.scope.service.menuVisibilityRevision.invalidate();
    return roleMenu;
  }

  @Core.transaction()
  private async deleteInTransaction(identity: IRoleMenuIdentity): Promise<void> {
    const row = await this.scope.model.roleMenu.getForUpdate(identity);
    if (!row) this.app.throw(404, 'Role menu not found');
    await this.scope.model.roleMenu.deleteById(row.id);
    await this.scope.service.menuVisibilityRevision.invalidate();
  }

  @Core.transaction()
  private async batchInTransaction(
    roleId: TableIdentity,
    creates: IRoleMenuIdentity[],
    deletes: IRoleMenuIdentity[],
  ): Promise<void> {
    await this.ensureRole(roleId);
    for (const identity of creates) this.requireEligibleMenu(identity);

    let changed = false;
    for (const identity of deletes) {
      const row = await this.scope.model.roleMenu.getForUpdate(identity);
      if (row) {
        await this.scope.model.roleMenu.deleteById(row.id);
        changed = true;
      }
    }
    for (const identity of creates) {
      const existing = await this.scope.model.roleMenu.getForUpdate(identity);
      if (!existing) {
        await this.scope.model.roleMenu.insert(identity);
        changed = true;
      }
    }
    if (changed) await this.scope.service.menuVisibilityRevision.invalidate();
  }

  private normalizeBatch(command: DtoRoleMenuBatch): {
    roleId: TableIdentity;
    creates: IRoleMenuIdentity[];
    deletes: IRoleMenuIdentity[];
  } {
    if (!command.roleId) this.app.throw(422, 'Role menu role is unavailable');
    const creates = this.uniqueIdentities(
      command.creates.map(identity =>
        this.normalizeIdentity({ ...identity, roleId: command.roleId }),
      ),
    );
    const deletes = this.uniqueIdentities(
      command.deletes.map(identity =>
        this.normalizeIdentity({ ...identity, roleId: command.roleId }),
      ),
    );
    const deleteKeys = new Set(deletes.map(identity => this.identityKey(identity)));
    if (creates.some(identity => deleteKeys.has(this.identityKey(identity)))) {
      this.app.throw(422, 'Role menu batch contains conflicting changes');
    }
    return { roleId: command.roleId, creates, deletes };
  }

  private uniqueIdentities(identities: IRoleMenuIdentity[]): IRoleMenuIdentity[] {
    const unique = new Map<string, IRoleMenuIdentity>();
    for (const identity of identities) unique.set(this.identityKey(identity), identity);
    return [...unique.values()].toSorted((left, right) =>
      this.identityKey(left).localeCompare(this.identityKey(right)),
    );
  }

  private identityKey(identity: IRoleMenuIdentity): string {
    return JSON.stringify([identity.ssrSiteName, identity.ssrMenuName]);
  }

  private normalizeIdentity(identity: IRoleMenuIdentity): IRoleMenuIdentity {
    if (!identity.roleId) this.app.throw(422, 'Role menu role is unavailable');
    return {
      roleId: identity.roleId,
      ssrSiteName: this.requireName(identity.ssrSiteName, 'SSR site name'),
      ssrMenuName: this.requireName(identity.ssrMenuName, 'SSR menu name'),
    };
  }

  private requireName(value: string, label: string): string {
    if (
      typeof value !== 'string' ||
      !value ||
      value.trim().length !== value.length ||
      value.length > 255
    ) {
      this.app.throw(422, `${label} is invalid`);
    }
    return value;
  }

  private getRoleLockKey(roleId: TableIdentity): string {
    return `admin-menu.role-menu.${encodeURIComponent(String(roleId))}`;
  }

  private async ensureRole(roleId: TableIdentity): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(roleId);
    if (!role) this.app.throw(422, 'Role menu role is unavailable');
  }

  private requireEligibleMenu(identity: IRoleMenuIdentity): void {
    const eligibility = this.$scope.ssr.service.ssr.resolveMenuEligibility(
      identity.ssrSiteName,
      identity.ssrMenuName,
    );
    if (!eligibility || !eligibility.rolesDefined) {
      this.app.throw(422, 'SSR menu is unavailable for Role menu');
    }
  }
}
