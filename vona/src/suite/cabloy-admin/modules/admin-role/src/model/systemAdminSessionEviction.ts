import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySystemAdminSessionEviction } from '../entity/systemAdminSessionEviction.tsx';

export interface IModelOptionsSystemAdminSessionEviction
  extends IDecoratorModelOptions<EntitySystemAdminSessionEviction> {}

@Model<IModelOptionsSystemAdminSessionEviction>({ entity: EntitySystemAdminSessionEviction })
export class ModelSystemAdminSessionEviction extends BeanModelBase<EntitySystemAdminSessionEviction> {}
