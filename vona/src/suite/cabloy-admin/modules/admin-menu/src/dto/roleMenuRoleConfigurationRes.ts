import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleMenuRoleConfigurationSite } from './roleMenuRoleConfigurationSite.ts';

export interface IDtoOptionsRoleMenuRoleConfigurationRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuRoleConfigurationRes>()
export class DtoRoleMenuRoleConfigurationRes {
  @Api.field(v.required())
  revision: string;

  @Api.field(v.required(), v.tableIdentity())
  roleId: TableIdentity;

  @Api.field(v.array(v.object(DtoRoleMenuRoleConfigurationSite)))
  list: DtoRoleMenuRoleConfigurationSite[];
}
