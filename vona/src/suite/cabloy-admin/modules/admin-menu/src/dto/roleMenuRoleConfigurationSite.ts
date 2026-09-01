import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleMenuCatalogGroup } from './roleMenuCatalogGroup.ts';
import { DtoRoleMenuRoleConfigurationMenu } from './roleMenuRoleConfigurationMenu.ts';

export interface IDtoOptionsRoleMenuRoleConfigurationSite extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuRoleConfigurationSite>()
export class DtoRoleMenuRoleConfigurationSite {
  @Api.field(v.required(), v.min(1), v.max(255))
  ssrSiteName: string;

  @Api.field(v.required())
  title: string;

  @Api.field(v.array(v.object(DtoRoleMenuRoleConfigurationMenu)))
  menus: DtoRoleMenuRoleConfigurationMenu[];

  @Api.field(v.array(v.object(DtoRoleMenuCatalogGroup)))
  groups: DtoRoleMenuCatalogGroup[];
}
