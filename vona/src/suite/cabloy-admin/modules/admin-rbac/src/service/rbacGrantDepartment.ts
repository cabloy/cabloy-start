import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoRbacGrantDepartmentCreate } from '../dto/rbacGrantDepartmentCreate.tsx';
import type { DtoRbacGrantDepartmentSelectRes } from '../dto/rbacGrantDepartmentSelectRes.tsx';
import type { DtoRbacGrantDepartmentView } from '../dto/rbacGrantDepartmentView.tsx';
import type { EntityRbacGrantDepartment } from '../entity/rbacGrantDepartment.tsx';
import type { ModelRbacGrantDepartment } from '../model/rbacGrantDepartment.ts';

@Service()
export class ServiceRbacGrantDepartment extends BeanBase {
  async create(
    rbacGrantDepartment: DtoRbacGrantDepartmentCreate,
  ): Promise<EntityRbacGrantDepartment> {
    return await this.$scope.redlock.service.redlock.lockIsolate(
      `admin-rbac.grant-department.${rbacGrantDepartment.rbacGrantId}.${rbacGrantDepartment.departmentId}`,
      async () => await this.createInTransaction(rbacGrantDepartment),
    );
  }

  @Core.transaction()
  private async createInTransaction(
    rbacGrantDepartment: DtoRbacGrantDepartmentCreate,
  ): Promise<EntityRbacGrantDepartment> {
    const grant = await this.scope.model.rbacGrant.getByIdForUpdate(
      rbacGrantDepartment.rbacGrantId,
    );
    if (!grant) this.app.throw(422, 'RBAC grant is unavailable');
    if (grant.dataScope !== 'customDepartments') {
      this.app.throw(422, 'RBAC grant does not use custom departments');
    }
    const department = await this.app
      .scope('admin-department')
      .model.department.getByIdForUpdate(rbacGrantDepartment.departmentId);
    if (!department || !department.enabled) this.app.throw(422, 'Department is unavailable');
    const existing = await this.scope.model.rbacGrantDepartment.getForUpdate({
      rbacGrantId: grant.id,
      departmentId: department.id,
    });
    if (existing) this.app.throw(409, 'RBAC grant department already exists');
    const row = await this.scope.model.rbacGrantDepartment.insert({
      rbacGrantId: grant.id,
      departmentId: department.id,
    });
    await this.invalidatePolicy();
    return row;
  }

  async select(
    params?: IQueryParams<ModelRbacGrantDepartment>,
  ): Promise<DtoRbacGrantDepartmentSelectRes> {
    return await this.scope.model.rbacGrantDepartment.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoRbacGrantDepartmentView | undefined> {
    return await this.scope.model.rbacGrantDepartment.getById(id);
  }

  @Core.transaction()
  async delete(id: TableIdentity): Promise<void> {
    const row = await this.scope.model.rbacGrantDepartment.getByIdForUpdate(id);
    if (!row) this.app.throw(404, 'RBAC grant department not found');
    await this.scope.model.rbacGrantDepartment.deleteById(row.id);
    await this.invalidatePolicy();
  }

  private async invalidatePolicy(): Promise<void> {
    await this.app.scope('a-rbac').event.policyInvalidated.emit({ kind: 'policy' });
  }
}
