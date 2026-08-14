import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipDelete extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipDelete>()
export class DtoDepartmentMembershipDelete {
  @Api.field(
    v.title($locale('DepartmentManager')),
    $makeSchema(v.optional(), v.nullable(), v.tableIdentity()),
  )
  managerMembershipId?: TableIdentity | null;
}
