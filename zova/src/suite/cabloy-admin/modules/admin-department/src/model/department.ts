import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiSchemaAdminDepartmentDtoDepartmentMembershipCreate,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipSelectRes,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipUpdate,
  ApiSchemaAdminDepartmentDtoDepartmentTree,
} from '../api/openapi/schemas.js';

export interface IModelOptionsDepartment extends IDecoratorModelOptions {}

const DepartmentResource = 'admin-department:department';

@Model<IModelOptionsDepartment>()
export class ModelDepartment extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(DepartmentResource, true);
  }

  tree() {
    return this.$$modelResource.query<ApiSchemaAdminDepartmentDtoDepartmentTree>(
      'department-tree',
      async () => {
        return await this.scope.api.adminDepartment.tree();
      },
    );
  }

  memberships(departmentId: TableIdentity) {
    return this.$$modelResource.query<ApiSchemaAdminDepartmentDtoDepartmentMembershipSelectRes>(
      `department-memberships-${departmentId}`,
      async () => {
        return await this.scope.api.adminDepartment.selectMemberships({
          params: { departmentId },
        });
      },
    );
  }

  createMembership(departmentId: TableIdentity) {
    return this.$$modelResource.mutationItem<
      TableIdentity,
      ApiSchemaAdminDepartmentDtoDepartmentMembershipCreate
    >({
      id: departmentId,
      action: 'createMembership',
      mutationFn: async body => {
        return await this.scope.api.adminDepartment.createMembership(body, {
          params: { departmentId },
        });
      },
    });
  }

  updateMembership(departmentId: TableIdentity, membershipId: TableIdentity) {
    return this.$$modelResource.mutationItem<
      void,
      ApiSchemaAdminDepartmentDtoDepartmentMembershipUpdate
    >({
      id: departmentId,
      action: `updateMembership-${membershipId}`,
      mutationFn: async body => {
        await this.scope.api.adminDepartment.updateMembership(body, {
          params: { departmentId, membershipId },
        });
      },
    });
  }

  deleteMembership(departmentId: TableIdentity, membershipId: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id: departmentId,
      action: `deleteMembership-${membershipId}`,
      mutationFn: async () => {
        await this.scope.api.adminDepartment.deleteMembership({
          params: { departmentId, membershipId },
        });
      },
    });
  }

  move(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, TableIdentity | null>({
      id,
      action: 'move',
      mutationFn: async parentId => {
        await (this.scope.api.adminDepartment.move(
          { parentId: parentId ?? undefined },
          { params: { id } },
        ) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$invalidateQueries({
          queryKey: ['select', 'department-tree'],
        });
      },
    });
  }

  reorder(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, TableIdentity | null>({
      id,
      action: 'reorder',
      mutationFn: async beforeId => {
        await (this.scope.api.adminDepartment.reorder(
          { beforeId: beforeId ?? undefined },
          { params: { id } },
        ) as Promise<void>);
      },
    });
  }

  updateActivation(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, boolean>({
      id,
      action: 'updateActivation',
      mutationFn: async enabled => {
        await (this.scope.api.adminDepartment.updateActivation(
          { enabled },
          { params: { id } },
        ) as Promise<void>);
      },
    });
  }
}
