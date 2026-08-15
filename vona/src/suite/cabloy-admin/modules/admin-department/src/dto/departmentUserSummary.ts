import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDepartmentUserSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentUserSummary>()
export class DtoDepartmentUserSummary {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('User')), v.required())
  name: string;

  @Api.field(v.optional(), v.nullable())
  avatar?: string | null;
}
