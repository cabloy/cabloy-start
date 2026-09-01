import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRoleMenuBatchItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuBatchItem>()
export class DtoRoleMenuBatchItem {
  @Api.field(v.required(), v.min(1), v.max(255))
  ssrSiteName: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  ssrMenuName: string;
}
