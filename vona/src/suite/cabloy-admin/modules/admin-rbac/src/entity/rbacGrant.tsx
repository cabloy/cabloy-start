import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { $locale } from '../.metadata/locales.ts';

export type TypeRbacGrantDataScope =
  | 'all'
  | 'customDepartments'
  | 'ownDepartment'
  | 'ownDepartmentAndDescendants'
  | 'mine';

export interface IEntityOptionsRbacGrant extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRbacGrant>('adminRbacRbacGrant', {
  openapi: { title: $locale('RbacGrant') },
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
export class EntityRbacGrant extends EntityBase {
  @Api.field(v.title($locale('Role')), v.required(), v.tableIdentity(), ZovaRender.order(1))
  roleId: TableIdentity;

  @Api.field(v.title($locale('ActionKey')), v.required(), v.min(1), ZovaRender.order(2))
  actionKey: string;

  @Api.field(
    v.title($locale('DataScope')),
    v.required(),
    ZovaRender.order(3),
    z.enum(['all', 'customDepartments', 'ownDepartment', 'ownDepartmentAndDescendants', 'mine']),
  )
  dataScope: TypeRbacGrantDataScope;

  @Api.field(v.title($locale('Enabled')), v.required(), ZovaRender.order(4))
  enabled: boolean;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(5))
  description?: string;
}
