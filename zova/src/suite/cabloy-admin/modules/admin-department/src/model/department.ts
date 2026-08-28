import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiSchemaAdminDepartmentDtoDepartmentManagerUpdate,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipCreate,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipPrimary,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipSelectRes,
  ApiSchemaAdminDepartmentDtoDepartmentMembershipUpdate,
  ApiSchemaAdminDepartmentDtoDepartmentTree,
} from '../api/openapi/schemas.js';

export interface IModelOptionsDepartment extends IDecoratorModelOptions {}

const DepartmentResource = 'admin-department:department';
const UserResource = 'admin-user:user';

@Model<IModelOptionsDepartment>()
export class ModelDepartment extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(DepartmentResource, true);
  }

  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelUserResource(): ModelResource {
    return usePrepareArg(UserResource, true);
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
    return this.$$modelResource.queryItem<ApiSchemaAdminDepartmentDtoDepartmentMembershipSelectRes>(
      {
        id: departmentId,
        action: 'memberships',
        queryFn: async () => {
          return await this.scope.api.adminDepartment.selectMemberships({
            params: { departmentId },
          });
        },
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
      onSuccess: async (_membershipId, body) => {
        await this._invalidateUserView(body.userId);
      },
    });
  }

  updateMembership(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    userId: TableIdentity,
  ) {
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
      onSuccess: async () => {
        await this._invalidateUserView(userId);
      },
    });
  }

  deleteMembership(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    userId: TableIdentity,
  ) {
    return this.$$modelResource.mutationItem<
      void,
      ApiSchemaAdminDepartmentDtoDepartmentMembershipDelete_2d063d28bc7243bed02ebd8bddf1212a93c6305b
    >({
      id: departmentId,
      action: `deleteMembership-${membershipId}`,
      mutationFn: async body => {
        await this.scope.api.adminDepartment.deleteMembership(body, {
          params: { departmentId, membershipId },
        });
      },
      onSuccess: async () => {
        await this._invalidateUserView(userId);
      },
    });
  }

  updateMembershipPrimary(
    departmentId: TableIdentity,
    membershipId: TableIdentity,
    userId: TableIdentity,
  ) {
    return this.$$modelResource.mutationItem<
      void,
      ApiSchemaAdminDepartmentDtoDepartmentMembershipPrimary
    >({
      id: departmentId,
      action: `updateMembershipPrimary-${membershipId}`,
      mutationFn: async body => {
        await this.scope.api.adminDepartment.updateMembershipPrimary(body, {
          params: { departmentId, membershipId },
        });
      },
      onSuccess: async () => {
        await this._invalidateUserView(userId);
        await this.$$modelResource.$invalidateQueries({ queryKey: [] });
      },
    });
  }

  updateManager(id: TableIdentity) {
    return this.$$modelResource.mutationItem<
      void,
      ApiSchemaAdminDepartmentDtoDepartmentManagerUpdate
    >({
      id,
      action: 'updateManager',
      mutationFn: async body => {
        await this.scope.api.adminDepartment.updateManager(body, { params: { id } });
      },
    });
  }

  private async _invalidateUserView(userId: TableIdentity) {
    await this.$$modelUserResource.$invalidateQueries({ queryKey: ['item', userId] });
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
        await this.$$modelResource.$invalidateQueries({
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
        await (this.scope.api.adminDepartment.reorder({ beforeId } as never, {
          params: { id },
        }) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$$modelResource.$invalidateQueries({
          queryKey: ['select', 'department-tree'],
        });
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
      onSuccess: async () => {
        await this.$$modelResource.$invalidateQueries({
          queryKey: ['select', 'department-tree'],
        });
      },
    });
  }
}
