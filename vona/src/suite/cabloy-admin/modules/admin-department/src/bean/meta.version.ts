import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const department = this.scope.entity.department;
    await this.bean.model.createTable(department.$table, table => {
      table.basicFields();
      table.string(department.name, 100);
      table.tableIdentity(department.parentId);
      table.boolean(department.enabled).defaultTo(true);
      table.integer(department.sortOrder).defaultTo(0);
      table.tableIdentity(department.managerMembershipId);
    });
  }
}
