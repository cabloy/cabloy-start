import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRoleMenu } from '../entity/roleMenu.tsx';

export interface IModelOptionsRoleMenu extends IDecoratorModelOptions<EntityRoleMenu> {}

@Model<IModelOptionsRoleMenu>({ entity: EntityRoleMenu })
export class ModelRoleMenu extends BeanModelBase<EntityRoleMenu> {}
