import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('adminDepartment', 'parentId+name'),
    ...$tableColumns('adminDepartment', 'parentId+sortOrder'),
    ...$tableColumns('adminDepartment', 'managerMembershipId'),
    ...$tableColumns('adminDepartmentMembership', 'departmentId+userId'),
    ...$tableColumns('adminDepartmentMembership', 'departmentId+enabled'),
    ...$tableColumns('adminDepartmentMembership', 'userId+enabled'),
  },
})
export class MetaIndex extends BeanBase {}
