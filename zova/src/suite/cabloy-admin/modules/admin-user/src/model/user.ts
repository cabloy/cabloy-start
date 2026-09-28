import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsUser extends IDecoratorModelOptions {}

export interface IGrantSystemAdminCommand {
  password: string;
  reason: string;
}

export interface IRevokeSystemAdminCommand {
  password: string;
  reason: string;
}

const UserResource = 'admin-user:user';

@Model<IModelOptionsUser>()
export class ModelUser extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(UserResource, true);
  }

  activate(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'activate',
      mutationFn: async () => {
        await (this.scope.api.adminUser.activate(undefined, { params: { id } }) as Promise<void>);
      },
    });
  }

  updateAccountStatus(id: TableIdentity, accountStatus: 'active' | 'disabled') {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'updateAccountStatus',
      mutationFn: async () => {
        await (this.scope.api.adminUser.updateAccountStatus(
          { accountStatus },
          { params: { id } },
        ) as Promise<void>);
      },
    });
  }

  replaceUserRoles(userId: TableIdentity) {
    return this.$$modelResource.mutationItem<void, TableIdentity[]>({
      id: userId,
      action: 'replaceUserRoles',
      mutationFn: async roleIds => {
        await (this.scope.api.adminUser.replaceUserRoles(
          { roleIds },
          { params: { userId } },
        ) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$$modelResource.$invalidateQueries({ queryKey: ['item', userId] });
        if (process.env.CLIENT && String(this.$passport.user?.id) === String(userId)) {
          this.app.reload();
        }
      },
    });
  }

  grantSystemAdmin(userId: TableIdentity) {
    return this.$$modelResource.mutationItem<void, IGrantSystemAdminCommand>({
      id: userId,
      action: 'grantSystemAdmin',
      mutationFn: async ({ password, reason }) => {
        const { proof } = await (await this.app.bean.getScope('admin-role')).api.adminRole.issueSystemAdminFreshProof({
          password,
        });
        await (this.scope.api.adminUser.grantSystemAdmin(
          { reason, freshProof: proof },
          { params: { userId } },
        ) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$$modelResource.$invalidateQueries({ queryKey: ['item', userId] });
        if (process.env.CLIENT && String(this.$passport.user?.id) === String(userId)) {
          this.app.reload();
        }
      },
    });
  }

  revokeSystemAdmin(userId: TableIdentity) {
    return this.$$modelResource.mutationItem<void, IRevokeSystemAdminCommand>({
      id: userId,
      action: 'revokeSystemAdmin',
      mutationFn: async ({ password, reason }) => {
        const { proof } = await (await this.app.bean.getScope('admin-role')).api.adminRole.issueSystemAdminFreshProof({
          password,
        });
        await (this.scope.api.adminUser.revokeSystemAdmin(
          { reason, freshProof: proof },
          { params: { userId } },
        ) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$$modelResource.$invalidateQueries({ queryKey: ['item', userId] });
        if (process.env.CLIENT && String(this.$passport.user?.id) === String(userId)) {
          this.app.reload();
        }
      },
    });
  }
}
