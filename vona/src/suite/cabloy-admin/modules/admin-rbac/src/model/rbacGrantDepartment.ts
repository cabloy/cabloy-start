import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRbacGrantDepartment } from '../entity/rbacGrantDepartment.tsx';

export interface IModelOptionsRbacGrantDepartment extends IDecoratorModelOptions<EntityRbacGrantDepartment> {}

@Model<IModelOptionsRbacGrantDepartment>({ entity: EntityRbacGrantDepartment })
export class ModelRbacGrantDepartment extends BeanModelBase<EntityRbacGrantDepartment> {}
