import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsSystemAdminActivation extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSystemAdminActivation>()
export class DtoSystemAdminActivation {
  @Api.field(z.boolean())
  activated: boolean;

  @Api.field($makeSchema(v.max(255), v.trim(), z.string()))
  reason: string;

  @Api.field(v.min(1), v.max(100))
  freshProof: string;
}
