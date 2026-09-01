import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const roleMenu = this.scope.entity.roleMenu;
      await this.bean.model.createTable(roleMenu.$table, table => {
        table.comment(roleMenu.$comment.$table);
        table.basicFields();
      });
      await this.bean.model.alterTable(roleMenu.$table, table => {
        table.tableIdentity(roleMenu.roleId);
        table.string(roleMenu.ssrSiteName, 255);
        table.string(roleMenu.ssrMenuName, 255);
      });

      const menuVisibilityRevision = this.scope.entity.menuVisibilityRevision;
      await this.bean.model.createTable(menuVisibilityRevision.$table, table => {
        table.basicFields();
        table.integer(menuVisibilityRevision.revision).defaultTo(0);
      });
    }
  }
}
