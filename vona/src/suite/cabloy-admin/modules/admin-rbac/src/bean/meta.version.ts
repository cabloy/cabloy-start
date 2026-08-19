import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityRbacGrant = this.scope.entity.rbacGrant;
      await this.bean.model.createTable(entityRbacGrant.$table, table => {
        table.comment(entityRbacGrant.$comment.$table);
        table.basicFields();
        table.string('name', 50);
        table.string('description', 255);
      });
    }
    if (options.version === 2) {
      const entityRbacGrantDepartment = this.scope.entity.rbacGrantDepartment;
      await this.bean.model.createTable(entityRbacGrantDepartment.$table, table => {
        table.comment(entityRbacGrantDepartment.$comment.$table);
        table.basicFields();
        table.string('name', 50);
        table.string('description', 255);
      });
    }
    if (options.version === 3) {
      const grant = this.scope.entity.rbacGrant;
      await this.bean.model.alterTable(grant.$table, table => {
        table.tableIdentity(grant.roleId);
        table.string(grant.actionKey, 255);
        table.string(grant.dataScope, 64);
        table.boolean(grant.enabled).defaultTo(true);
      });
      const grantDepartment = this.scope.entity.rbacGrantDepartment;
      await this.bean.model.alterTable(grantDepartment.$table, table => {
        table.tableIdentity(grantDepartment.rbacGrantId);
        table.tableIdentity(grantDepartment.departmentId);
      });
    }
  }
}
