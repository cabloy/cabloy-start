import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('adminRbacRbacGrant', 'roleId+actionKey'),
    ...$tableColumns('adminRbacRbacGrant', 'roleId+enabled'),
    ...$tableColumns('adminRbacRbacGrantDepartment', 'rbacGrantId'),
    ...$tableColumns('adminRbacRbacGrantDepartment', 'departmentId'),
  },
})
export class MetaIndex extends BeanBase {}
