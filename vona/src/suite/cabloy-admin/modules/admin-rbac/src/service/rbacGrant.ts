import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IRbacActionDescriptor, TypeRbacDataScope } from 'vona-module-a-rbac';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoRbacGrantCreate } from '../dto/rbacGrantCreate.tsx';
import type { DtoRbacGrantSelectRes } from '../dto/rbacGrantSelectRes.tsx';
import type { DtoRbacGrantUpdate } from '../dto/rbacGrantUpdate.tsx';
import type { DtoRbacGrantView } from '../dto/rbacGrantView.tsx';
import type { EntityRbacGrant } from '../entity/rbacGrant.tsx';
import type { ModelRbacGrant } from '../model/rbacGrant.ts';

import {
  getRbacGrantablePolicyAction,
  isRbacDataScopeCompatible,
  isRbacPolicyRoleAvailable,
} from '../lib/rbacPolicy.ts';

@Service()
export class ServiceRbacGrant extends BeanBase {
  async create(rbacGrant: DtoRbacGrantCreate): Promise<EntityRbacGrant> {
    return await this.$scope.redlock.service.redlock.lockIsolate(
      `admin-rbac.grant.${rbacGrant.roleId}.${rbacGrant.actionKey}.${rbacGrant.dataScope}`,
      async () => await this.createInTransaction(rbacGrant),
    );
  }

  @Core.transaction()
  private async createInTransaction(rbacGrant: DtoRbacGrantCreate): Promise<EntityRbacGrant> {
    const action = this.requireAction(rbacGrant.actionKey);
    this.requireCompatibleDataScope(action, rbacGrant.dataScope);
    await this.ensureRole(rbacGrant.roleId);
    const existing = await this.scope.model.rbacGrant.getForUpdate({
      roleId: rbacGrant.roleId,
      actionKey: rbacGrant.actionKey,
      dataScope: rbacGrant.dataScope,
    });
    if (existing) this.app.throw(409, 'RBAC grant already exists');
    const grant = await this.scope.model.rbacGrant.insert(rbacGrant);
    await this.invalidatePolicy();
    return grant;
  }

  async select(params?: IQueryParams<ModelRbacGrant>): Promise<DtoRbacGrantSelectRes> {
    return await this.scope.model.rbacGrant.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoRbacGrantView | undefined> {
    return await this.scope.model.rbacGrant.getById(id);
  }

  @Core.transaction()
  async update(id: TableIdentity, patch: DtoRbacGrantUpdate): Promise<void> {
    const roleId = await this.getGrantRoleId(id);
    await this.ensureMutableRole(roleId);
    const grant = await this.scope.model.rbacGrant.getByIdForUpdate(id);
    if (!grant) this.app.throw(404, 'RBAC grant not found');
    if (patch.enabled !== false) {
      const action = this.requireAction(grant.actionKey);
      this.requireCompatibleDataScope(action, grant.dataScope);
    }
    await this.scope.model.rbacGrant.updateById(grant.id, patch);
    await this.invalidatePolicy();
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const roleId = await this.getGrantRoleId(id);
    await this.ensureMutableRole(roleId);
    const grant = await this.scope.model.rbacGrant.getByIdForUpdate(id);
    if (!grant) this.app.throw(404, 'RBAC grant not found');
    const departments = await this.scope.model.rbacGrantDepartment.select({
      where: { rbacGrantId: grant.id },
    });
    if (departments.length) {
      await this.scope.model.rbacGrantDepartment.deleteBulk(departments.map(item => item.id));
    }
    await this.scope.model.rbacGrant.deleteById(grant.id);
    await this.invalidatePolicy();
  }

  private async getGrantRoleId(id: TableIdentity): Promise<TableIdentity> {
    const grant = await this.scope.model.rbacGrant.getById(id, {
      disableCacheEntity: true,
      disableCacheQuery: true,
      columns: ['roleId'],
    });
    if (!grant) this.app.throw(404, 'RBAC grant not found');
    return grant.roleId;
  }

  private requireAction(actionKey: string): IRbacActionDescriptor {
    const action = getRbacGrantablePolicyAction(this.bean.rbacCatalog.getCatalog(), actionKey);
    if (!action) this.app.throw(422, 'RBAC action is unavailable');
    return action.action;
  }

  private requireCompatibleDataScope(
    action: IRbacActionDescriptor,
    dataScope: TypeRbacDataScope,
  ): void {
    if (!isRbacDataScopeCompatible(action, dataScope)) {
      this.app.throw(422, 'RBAC data scope is incompatible with the action');
    }
  }

  private async invalidatePolicy(): Promise<void> {
    await this.app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
  }

  private async ensureRole(roleId: TableIdentity): Promise<void> {
    await this.ensureMutableRole(roleId);
  }

  private async ensureMutableRole(roleId: TableIdentity): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(roleId);
    if (!isRbacPolicyRoleAvailable(role)) this.app.throw(422, 'RBAC grant role is unavailable');
  }
}
