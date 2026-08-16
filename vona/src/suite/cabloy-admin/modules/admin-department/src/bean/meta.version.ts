import type {
  IMetaVersionSeed,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionSeed, IMetaVersionUpdate {
  async seed() {
    const department = this.scope.model.department;
    const root = await department.insert({
      name: 'CabloyJS',
      parentId: null,
      enabled: true,
      sortOrder: 1024,
    });
    await department.insert({
      name: 'Finance',
      parentId: root.id,
      enabled: true,
      sortOrder: 1024,
    });
    const development = await department.insert({
      name: 'Development',
      parentId: root.id,
      enabled: true,
      sortOrder: 2048,
    });
    await department.insert({
      name: 'Frontend',
      parentId: development.id,
      enabled: true,
      sortOrder: 1024,
    });
    await department.insert({
      name: 'Backend',
      parentId: development.id,
      enabled: true,
      sortOrder: 2048,
    });
  }

  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const department = this.scope.entity.department;
    await this.bean.model.createTable(department.$table, table => {
      table.basicFields();
      table.string(department.name, 100);
      table.tableIdentity(department.parentId);
      table.boolean(department.enabled).defaultTo(true);
      table.integer(department.sortOrder).defaultTo(0);
      table.tableIdentity(department.managerId);
    });

    const departmentMembership = this.scope.entity.departmentMembership;
    await this.bean.model.createTable(departmentMembership.$table, table => {
      table.basicFields();
      table.tableIdentity(departmentMembership.departmentId);
      table.tableIdentity(departmentMembership.userId);
      table.string(departmentMembership.position, 100);
      table.boolean(departmentMembership.enabled).defaultTo(true);
      table.boolean(departmentMembership.primary).defaultTo(false);
    });
  }
}
