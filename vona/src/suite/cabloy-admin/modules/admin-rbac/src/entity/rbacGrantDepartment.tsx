import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsRbacGrantDepartment extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRbacGrantDepartment>('adminRbacRbacGrantDepartment', {
  openapi: { title: $locale('RbacGrantDepartment') },
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
export class EntityRbacGrantDepartment extends EntityBase {
  @Api.field(v.title($locale('RbacGrant')), v.required(), v.tableIdentity(), ZovaRender.order(1))
  rbacGrantId: TableIdentity;

  @Api.field(v.title($locale('Department')), v.required(), v.tableIdentity(), ZovaRender.order(2))
  departmentId: TableIdentity;
}
