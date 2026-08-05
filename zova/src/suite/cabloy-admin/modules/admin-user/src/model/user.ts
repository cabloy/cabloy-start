import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsUser extends IDecoratorModelOptions {}

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

  deactivate(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'deactivate',
      mutationFn: async () => {
        await (this.scope.api.adminUser.deactivate(undefined, { params: { id } }) as Promise<void>);
      },
    });
  }
}
