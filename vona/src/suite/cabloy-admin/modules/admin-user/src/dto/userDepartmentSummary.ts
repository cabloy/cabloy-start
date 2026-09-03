import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsUserDepartmentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserDepartmentSummary>()
export class DtoUserDepartmentSummary {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  name: string;
}
