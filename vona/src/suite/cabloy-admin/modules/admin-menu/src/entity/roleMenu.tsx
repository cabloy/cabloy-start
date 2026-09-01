import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsRoleMenu extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRoleMenu>('adminMenuRoleMenu', {
  openapi: { title: $locale('RoleMenu') },
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
export class EntityRoleMenu extends EntityBase {
  @Api.field(v.title($locale('Role')), v.required(), v.tableIdentity(), ZovaRender.order(1))
  roleId: TableIdentity;

  @Api.field(
    v.title($locale('SsrSiteName')),
    v.required(),
    v.trim(),
    v.min(1),
    v.max(255),
    ZovaRender.order(2),
  )
  ssrSiteName: string;

  @Api.field(
    v.title($locale('SsrMenuName')),
    v.required(),
    v.trim(),
    v.min(1),
    v.max(255),
    ZovaRender.order(3),
  )
  ssrMenuName: string;
}
