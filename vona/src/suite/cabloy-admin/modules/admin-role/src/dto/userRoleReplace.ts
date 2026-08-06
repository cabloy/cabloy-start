import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsUserRoleReplace extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserRoleReplace>()
export class DtoUserRoleReplace {
  @Api.field(v.array(v.tableIdentity()))
  roleIds: TableIdentity[];
}
