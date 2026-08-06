import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsRole extends IDecoratorModelOptions {}

const RoleResource = 'admin-role:role';

@Model<IModelOptionsRole>()
export class ModelRole extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(RoleResource, true);
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
    });
  }
}
