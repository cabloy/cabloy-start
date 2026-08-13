import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMove extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMove>()
export class DtoDepartmentMove {
  @Api.field(
    v.title($locale('ParentDepartment')),
    $makeSchema(v.required(), v.nullable(), v.tableIdentity()),
  )
  parentId: TableIdentity | null;
}
