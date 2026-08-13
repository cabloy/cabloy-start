import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('adminDepartment', 'parentId+name'),
    ...$tableColumns('adminDepartment', 'parentId+sortOrder'),
    ...$tableColumns('adminDepartment', 'managerMembershipId'),
  },
})
export class MetaIndex extends BeanBase {}
