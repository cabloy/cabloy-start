import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySystemAdminFreshProof } from '../entity/systemAdminFreshProof.tsx';

export interface IModelOptionsSystemAdminFreshProof
  extends IDecoratorModelOptions<EntitySystemAdminFreshProof> {}

@Model<IModelOptionsSystemAdminFreshProof>({ entity: EntitySystemAdminFreshProof })
export class ModelSystemAdminFreshProof extends BeanModelBase<EntitySystemAdminFreshProof> {}
