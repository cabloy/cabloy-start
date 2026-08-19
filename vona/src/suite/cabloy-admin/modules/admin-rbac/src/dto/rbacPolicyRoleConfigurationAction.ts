import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRbacPolicyRoleConfigurationScope } from './rbacPolicyRoleConfigurationScope.ts';

export interface IDtoOptionsRbacPolicyRoleConfigurationAction extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacPolicyRoleConfigurationAction>()
export class DtoRbacPolicyRoleConfigurationAction {
  @Api.field(v.required())
  actionKey: string;

  @Api.field(v.array(v.object(DtoRbacPolicyRoleConfigurationScope)))
  dataScopes: DtoRbacPolicyRoleConfigurationScope[];
}
