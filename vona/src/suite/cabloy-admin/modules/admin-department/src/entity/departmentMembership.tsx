import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsDepartmentMembership extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsDepartmentMembership>('adminDepartmentMembership', {
  openapi: { title: $locale('DepartmentMembership') },
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
export class EntityDepartmentMembership extends EntityBase {
  @Api.field(v.title($locale('Department')), v.required(), ZovaRender.order(1), v.tableIdentity())
  departmentId: TableIdentity;

  @Api.field(v.title($locale('User')), v.required(), ZovaRender.order(2), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(
    v.title($locale('Position')),
    ZovaRender.order(3),
    $makeSchema(v.optional(), v.max(100), String),
  )
  position?: string;

  @Api.field(v.title($locale('Enabled')), v.required(), ZovaRender.order(4))
  enabled: boolean;

  @Api.field(ZovaRender.visible(false), v.required())
  primary: boolean;
}
