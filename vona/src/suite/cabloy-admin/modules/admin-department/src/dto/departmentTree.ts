import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentTreeItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentTreeItem>()
export class DtoDepartmentTreeItem {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('DepartmentName')), v.required())
  name: string;

  @Api.field(v.title($locale('ParentDepartment')), v.nullable(), v.optional(), v.tableIdentity())
  parentId: TableIdentity | null;

  @Api.field(v.title($locale('Enabled')), v.required())
  enabled: boolean;

  @Api.field(v.title($locale('SortOrder')), v.required())
  sortOrder: number;

  @Api.field(v.array(v.lazy(() => v.object(DtoDepartmentTreeItem))))
  children: DtoDepartmentTreeItem[];
}

export interface IDtoOptionsDepartmentTree extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentTree>()
export class DtoDepartmentTree {
  @Api.field(v.array(v.object(DtoDepartmentTreeItem)))
  list: DtoDepartmentTreeItem[];
}
