import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsDepartment extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsDepartment>('adminDepartment', {
  openapi: { title: $locale('Department') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('start-date:formFieldDate'),
      ZovaRender.cell('start-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('start-date:formFieldDate'),
      ZovaRender.cell('start-date:date'),
    ),
  },
})
export class EntityDepartment extends EntityBase {
  @Api.field(
    v.title($locale('DepartmentName')),
    v.required(),
    v.min(1),
    v.max(100),
    ZovaRender.order(1),
    ZovaRender.cell('start-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('ParentDepartment')),
    v.optional(),
    ZovaRender.order(2),
    v.tableIdentity(),
  )
  parentId: TableIdentity | null;

  @Api.field(v.title($locale('Enabled')), v.required(), ZovaRender.order(3))
  enabled: boolean;

  @Api.field(v.title($locale('SortOrder')), v.required(), ZovaRender.order(4))
  sortOrder: number;

  @Api.field(ZovaRender.visible(false), v.optional(), v.tableIdentity())
  managerMembershipId?: TableIdentity;
}
