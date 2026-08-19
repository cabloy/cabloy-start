import type { TypeRbacDataScope } from 'vona-module-a-rbac';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRbacPolicyCatalogResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacPolicyCatalogResItem>()
export class DtoRbacPolicyCatalogResItem {
  @Api.field(v.required())
  actionKey: string;

  @Api.field(
    v.array(
      z.enum(['all', 'customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants', 'mine']),
    ),
  )
  dataScopes: TypeRbacDataScope[];
}
