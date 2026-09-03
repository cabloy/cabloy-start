import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityDepartmentMembership } from '../entity/departmentMembership.tsx';

export interface IModelOptionsDepartmentMembership extends IDecoratorModelOptions<EntityDepartmentMembership> {}

@Model<IModelOptionsDepartmentMembership>({
  entity: EntityDepartmentMembership,
  relations: {
    department: $relation.belongsTo(
      'admin-department:departmentMembership',
      'admin-department:department',
      'departmentId',
      {
        columns: ['id', 'name'],
      },
    ),
    user: $relation.belongsTo('admin-department:departmentMembership', 'home-user:user', 'userId', {
      columns: ['id', 'name', 'avatar'],
    }),
  },
})
export class ModelDepartmentMembership extends BeanModelBase<EntityDepartmentMembership> {}
