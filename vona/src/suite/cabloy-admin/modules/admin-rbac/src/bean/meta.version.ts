import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const grant = this.scope.entity.rbacGrant;
      await this.bean.model.createTable(grant.$table, table => {
        table.comment(grant.$comment.$table);
        table.basicFields();
        table.string('name', 50);
        table.string('description', 255);
      });
      await this.bean.model.alterTable(grant.$table, table => {
        table.tableIdentity(grant.roleId);
        table.string(grant.actionKey, 255);
        table.string(grant.dataScope, 64);
        table.boolean(grant.enabled).defaultTo(true);
      });

      const grantDepartment = this.scope.entity.rbacGrantDepartment;
      await this.bean.model.createTable(grantDepartment.$table, table => {
        table.comment(grantDepartment.$comment.$table);
        table.basicFields();
        table.string('name', 50);
        table.string('description', 255);
      });
      await this.bean.model.alterTable(grantDepartment.$table, table => {
        table.tableIdentity(grantDepartment.rbacGrantId);
        table.tableIdentity(grantDepartment.departmentId);
      });

      const policyRevision = this.scope.entity.policyRevision;
      await this.bean.model.createTable(policyRevision.$table, table => {
        table.basicFields();
        table.integer(policyRevision.revision).defaultTo(0);
      });
    }
  }
}
