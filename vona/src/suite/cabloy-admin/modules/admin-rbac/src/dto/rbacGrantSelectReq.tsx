import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-start-admin';

import { EntityRbacGrant } from '../entity/rbacGrant.tsx';

export interface IDtoOptionsRbacGrantSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRbacGrantSelectReq>({
  openapi: { filter: { table: 'adminRbacRbacGrant' } },
  fields: {
    actionKey: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('start-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoRbacGrantSelectReq extends $Dto.queryPage(EntityRbacGrant, [
  'actionKey',
  'createdAt',
]) {}
