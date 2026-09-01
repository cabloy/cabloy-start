import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRoleMenuDelete extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuDelete>()
export class DtoRoleMenuDelete {
  @Api.field(v.required(), v.tableIdentity())
  roleId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(255))
  ssrSiteName: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  ssrMenuName: string;
}
