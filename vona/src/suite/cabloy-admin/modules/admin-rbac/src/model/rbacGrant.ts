import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRbacGrant } from '../entity/rbacGrant.tsx';

export interface IModelOptionsRbacGrant extends IDecoratorModelOptions<EntityRbacGrant> {}

@Model<IModelOptionsRbacGrant>({ entity: EntityRbacGrant })
export class ModelRbacGrant extends BeanModelBase<EntityRbacGrant> {}
