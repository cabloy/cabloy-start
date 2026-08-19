import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoRbacGrantCreate } from '../dto/rbacGrantCreate.tsx';
import type { DtoRbacGrantSelectRes } from '../dto/rbacGrantSelectRes.tsx';
import type { DtoRbacGrantUpdate } from '../dto/rbacGrantUpdate.tsx';
import type { DtoRbacGrantView } from '../dto/rbacGrantView.tsx';
import type { EntityRbacGrant } from '../entity/rbacGrant.tsx';
import type { ModelRbacGrant } from '../model/rbacGrant.ts';

@Service()
export class ServiceRbacGrant extends BeanBase {
  @Core.transaction()
  async create(rbacGrant: DtoRbacGrantCreate): Promise<EntityRbacGrant> {
    await this.ensureRole(rbacGrant.roleId);
    const existing = await this.scope.model.rbacGrant.getForUpdate({
      roleId: rbacGrant.roleId,
      actionKey: rbacGrant.actionKey,
      dataScope: rbacGrant.dataScope,
    });
    if (existing) this.app.throw(409, 'RBAC grant already exists');
    const grant = await this.scope.model.rbacGrant.insert(rbacGrant);
    await this.bean.permission.clearAllCaches();
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
    const grant = await this.scope.model.rbacGrant.getByIdForUpdate(id);
    if (!grant) this.app.throw(404, 'RBAC grant not found');
    await this.scope.model.rbacGrant.updateById(grant.id, patch);
    await this.bean.permission.clearAllCaches();
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const grant = await this.scope.model.rbacGrant.getByIdForUpdate(id);
    if (!grant) this.app.throw(404, 'RBAC grant not found');
    const departments = await this.scope.model.rbacGrantDepartment.select({
      where: { rbacGrantId: grant.id },
    });
    if (departments.length) {
      await this.scope.model.rbacGrantDepartment.deleteBulk(departments.map(item => item.id));
    }
    await this.scope.model.rbacGrant.deleteById(grant.id);
    await this.bean.permission.clearAllCaches();
  }

  private async ensureRole(roleId: TableIdentity): Promise<void> {
    const role = await this.$scope.homeUser.model.role.getByIdForUpdate(roleId);
    if (!role) this.app.throw(422, 'RBAC grant role is unavailable');
  }
}
