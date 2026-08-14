import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityDepartmentMembership } from '../entity/departmentMembership.tsx';

export interface IModelOptionsDepartmentMembership extends IDecoratorModelOptions<EntityDepartmentMembership> {}

@Model<IModelOptionsDepartmentMembership>({ entity: EntityDepartmentMembership })
export class ModelDepartmentMembership extends BeanModelBase<EntityDepartmentMembership> {}
