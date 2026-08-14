import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipItem>()
export class DtoDepartmentMembershipItem {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('User')), v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(
    v.title($locale('Position')),
    $makeSchema(v.optional(), v.nullable(), v.max(100), String),
  )
  position?: string | null;

  @Api.field(v.title($locale('Enabled')), v.required())
  enabled: boolean;
}
