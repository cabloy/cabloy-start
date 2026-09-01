import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleMenuCatalogGroup } from './roleMenuCatalogGroup.ts';
import { DtoRoleMenuCatalogMenu } from './roleMenuCatalogMenu.ts';

export interface IDtoOptionsRoleMenuCatalogSite extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuCatalogSite>()
export class DtoRoleMenuCatalogSite {
  @Api.field(v.required(), v.min(1), v.max(255))
  ssrSiteName: string;

  @Api.field(v.required())
  title: string;

  @Api.field(v.array(v.object(DtoRoleMenuCatalogMenu)))
  menus: DtoRoleMenuCatalogMenu[];

  @Api.field(v.array(v.object(DtoRoleMenuCatalogGroup)))
  groups: DtoRoleMenuCatalogGroup[];
}
