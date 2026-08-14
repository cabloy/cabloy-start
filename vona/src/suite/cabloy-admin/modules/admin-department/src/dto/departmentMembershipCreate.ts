import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentMembershipCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipCreate>()
export class DtoDepartmentMembershipCreate {
  @Api.field(v.title($locale('User')), v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.title($locale('Position')), $makeSchema(v.optional(), v.trim(), v.max(100), String))
  position?: string;
}
