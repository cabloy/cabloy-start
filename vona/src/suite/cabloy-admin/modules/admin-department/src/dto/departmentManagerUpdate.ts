import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentManagerUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentManagerUpdate>()
export class DtoDepartmentManagerUpdate {
  @Api.field(
    v.title($locale('DepartmentManager')),
    $makeSchema(v.required(), v.nullable(), v.tableIdentity()),
  )
  membershipId: TableIdentity | null;
}
