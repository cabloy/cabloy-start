import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRbacPolicyCatalogResItem } from './rbacPolicyCatalogResItem.ts';

export interface IDtoOptionsRbacPolicyCatalogRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacPolicyCatalogRes>()
export class DtoRbacPolicyCatalogRes {
  @Api.field(v.required())
  revision: string;

  @Api.field(v.array(v.object(DtoRbacPolicyCatalogResItem)))
  list: DtoRbacPolicyCatalogResItem[];
}
