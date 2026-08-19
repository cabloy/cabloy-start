import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRbacPolicyRoleConfigurationAction } from './rbacPolicyRoleConfigurationAction.ts';

export interface IDtoOptionsRbacPolicyRoleConfigurationRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacPolicyRoleConfigurationRes>()
export class DtoRbacPolicyRoleConfigurationRes {
  @Api.field(v.required())
  revision: string;

  @Api.field(v.required(), v.tableIdentity())
  roleId: TableIdentity;

  @Api.field(v.array(v.object(DtoRbacPolicyRoleConfigurationAction)))
  list: DtoRbacPolicyRoleConfigurationAction[];
}
