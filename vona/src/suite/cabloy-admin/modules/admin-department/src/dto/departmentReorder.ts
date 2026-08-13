import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentReorder extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentReorder>()
export class DtoDepartmentReorder {
  @Api.field(
    v.title($locale('PlaceBeforeDepartment')),
    $makeSchema(v.required(), v.nullable(), v.tableIdentity()),
  )
  beforeId: TableIdentity | null;
}
