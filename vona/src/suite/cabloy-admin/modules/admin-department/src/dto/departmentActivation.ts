import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsDepartmentActivation extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentActivation>()
export class DtoDepartmentActivation {
  @Api.field(z.boolean())
  enabled: boolean;
}
