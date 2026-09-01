import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoRoleMenuBatchItem } from './roleMenuBatchItem.ts';

export interface IDtoOptionsRoleMenuBatch extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRoleMenuBatch>()
export class DtoRoleMenuBatch {
  @Api.field(v.required(), v.tableIdentity())
  roleId: TableIdentity;

  @Api.field(v.required(), v.array(v.object(DtoRoleMenuBatchItem)))
  creates: DtoRoleMenuBatchItem[];

  @Api.field(v.required(), v.array(v.object(DtoRoleMenuBatchItem)))
  deletes: DtoRoleMenuBatchItem[];
}
