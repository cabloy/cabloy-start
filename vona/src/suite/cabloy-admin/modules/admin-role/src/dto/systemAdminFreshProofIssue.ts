import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsSystemAdminFreshProofIssue extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSystemAdminFreshProofIssue>()
export class DtoSystemAdminFreshProofIssue {
  @Api.field(v.min(1), v.max(1024))
  password: string;
}
