import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityDepartment } from '../entity/department.tsx';

export interface IModelOptionsDepartment extends IDecoratorModelOptions<EntityDepartment> {}

@Model<IModelOptionsDepartment>({ entity: EntityDepartment })
export class ModelDepartment extends BeanModelBase<EntityDepartment> {}
