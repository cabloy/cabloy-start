import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleMenuCatalogSite } from './roleMenuCatalogSite.ts';

export interface IDtoOptionsRoleMenuCatalogRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuCatalogRes>()
export class DtoRoleMenuCatalogRes {
  @Api.field(v.required())
  revision: string;

  @Api.field(v.array(v.object(DtoRoleMenuCatalogSite)))
  list: DtoRoleMenuCatalogSite[];
}
