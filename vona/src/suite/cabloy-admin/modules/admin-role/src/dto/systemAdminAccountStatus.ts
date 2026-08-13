import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, $makeSchema, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsSystemAdminAccountStatus extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSystemAdminAccountStatus>()
export class DtoSystemAdminAccountStatus {
  @Api.field(z.enum(['active', 'disabled']))
  accountStatus: 'active' | 'disabled';

  @Api.field($makeSchema(v.max(255), v.trim(), z.string()))
  reason: string;

  @Api.field(v.min(1), v.max(100))
  freshProof: string;
}
