import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoDepartmentMembershipSummary } from './departmentMembershipSummary.ts';

export interface IDtoOptionsDepartmentMembershipSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDepartmentMembershipSelectRes>()
export class DtoDepartmentMembershipSelectRes {
  @Api.field(v.array(v.object(DtoDepartmentMembershipSummary)))
  list: DtoDepartmentMembershipSummary[];
}
