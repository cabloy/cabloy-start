import type { TypeRbacDataScope } from 'vona-module-a-rbac';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRbacPolicyRoleConfigurationScope extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacPolicyRoleConfigurationScope>()
export class DtoRbacPolicyRoleConfigurationScope {
  @Api.field(
    v.required(),
    z.enum(['all', 'customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants', 'mine']),
  )
  dataScope: TypeRbacDataScope;

  @Api.field(v.required())
  enabled: boolean;

  @Api.field(v.optional())
  customDepartmentsConfigured?: boolean;
}
