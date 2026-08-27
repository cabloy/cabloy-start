import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityDepartment } from '../entity/department.tsx';

export interface IModelOptionsDepartment extends IDecoratorModelOptions<EntityDepartment> {}

@Model<IModelOptionsDepartment>({
  entity: EntityDepartment,
  relations: {
    parent: $relation.belongsTo(
      'admin-department:department',
      'admin-department:department',
      'parentId',
      {
        columns: ['id', 'name'],
      },
    ),
  },
})
export class ModelDepartment extends BeanModelBase<EntityDepartment> {}
