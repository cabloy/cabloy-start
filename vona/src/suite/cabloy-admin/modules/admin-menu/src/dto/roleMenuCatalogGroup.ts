import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRoleMenuCatalogGroup extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuCatalogGroup>()
export class DtoRoleMenuCatalogGroup {
  @Api.field(v.required(), v.min(1), v.max(255))
  ssrMenuGroupName: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  onionName: string;

  @Api.field(v.optional())
  title?: string;

  @Api.field(v.optional())
  description?: string;

  @Api.field(v.optional())
  icon?: string;

  @Api.field(v.optional())
  order?: number;

  @Api.field(v.optional(), z.union([z.string(), z.array(z.string())]))
  group?: string | string[];

  @Api.field(v.optional())
  collapsed?: boolean;
}
