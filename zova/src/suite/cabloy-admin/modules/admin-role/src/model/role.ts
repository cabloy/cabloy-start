import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsRole extends IDecoratorModelOptions {}

const RoleResource = 'admin-role:role';
const UserResource = 'admin-user:user';

@Model<IModelOptionsRole>()
export class ModelRole extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(RoleResource, true);
  }

  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelUserResource(): ModelResource {
    return usePrepareArg(UserResource, true);
  }

  replaceUserRoles(userId: TableIdentity) {
    return this.$$modelResource.mutationItem<void, TableIdentity[]>({
      id: userId,
      action: 'replaceUserRoles',
      mutationFn: async roleIds => {
        await (this.scope.api.adminRole.replaceUserRoles(
          { roleIds },
          { params: { userId } },
        ) as Promise<void>);
      },
      onSuccess: async () => {
        await this.$$modelUserResource.$invalidateQueries({ queryKey: ['item', userId] });
        await this._refreshCurrentSubjectMenus(userId);
      },
    });
  }

  private async _refreshCurrentSubjectMenus(userId: TableIdentity): Promise<void> {
    if (!process.env.CLIENT || String(this.$passport.user?.id) !== String(userId)) return;
    this.app.reload();
  }
}
