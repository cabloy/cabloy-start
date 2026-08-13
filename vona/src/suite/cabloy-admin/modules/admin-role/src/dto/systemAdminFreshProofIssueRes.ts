import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsSystemAdminFreshProofIssueRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSystemAdminFreshProofIssueRes>()
export class DtoSystemAdminFreshProofIssueRes {
  @Api.field(v.max(100))
  proof: string;

  @Api.field()
  expiresAt: Date;
}
